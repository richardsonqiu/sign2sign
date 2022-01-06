import { useState, useEffect, useCallback, useRef } from 'react';
import { VRM } from "@pixiv/three-vrm";
import { Holistic } from "@mediapipe/holistic"

import { loadGLTF, getBoneNames } from 'utils/vrm';
import { getSentenceClipWithTimes } from 'utils/track';
import config from 'config';
import { processResult } from 'utils/signRecognition';

export const useVrm = (vrmSrc) => {
    const [vrm, setVrm] = useState(null);

    useEffect(async () => {
        if (!vrmSrc) return;

        const gltf = await loadGLTF(vrmSrc); 
        setVrm(await VRM.from(gltf));

    }, [vrmSrc]);

    return vrm;
}

export const useModelPlayer = () => {
    const [playerState, setPlayerState] = useState({
        isPlaying: false,
        sentences: [],
        sentenceClips: [],
        index: 0,
        wordTimes: [],
        time: 0
        // handleAction: () => null
    });

    const handleFrame = (action) => {
        if (!playerState.isPlaying) {
            return;
        }

        // Check action has ended
        const wordTimes = playerState.wordTimes[playerState.index]
        const end = wordTimes.at(-1);
        if (Math.abs(action.time - end) < 0.01) {
            setPlayerState({
                ...playerState,
                isPlaying: false,
                time: end
            });
            return;
        }

        // Periodically update player state to sync up with action
        if (action.time - playerState.time > 0.1) {
            setPlayerState({
                ...playerState,
                time: action.time
            });
            return;
        }
    }

    const setSentences = (sentences) => {
        setPlayerState({
            ...playerState,
            sentences
        });
    }

    const setIndex = (index) => {
        setPlayerState({
            ...playerState,
            index,
            time: 0,
            isPlaying: false
        });
    }

    const loadSentenceClips = (vrm) => {
        const fetchClips = async () => {
            const boneNames = getBoneNames(vrm);

            const clips = [];
            for (const sentence of playerState.sentences) {
                clips.push(await getSentenceClipWithTimes(sentence, boneNames));
            }
            
            setPlayerState({
                ...playerState,
                sentenceClips: clips.map(x => x.clip),
                wordTimes: clips.map(x => x.wordTimes)
            });
        }

        if (!vrm) return;
        fetchClips();
    }

    const play = () => {
        setPlayerState({
            ...playerState,
            isPlaying: true,
        });
    }

    const stop = () => {
        setPlayerState({
            ...playerState,
            isPlaying: false,
        });
    }

    const reset = () => {
        setPlayerState({
            ...playerState,
            isPlaying: true,
            time: 0
        });
    }

    const seek = (time) => {
        setPlayerState({
            ...playerState,
            time,
        });
    }
    
    const seekWord = (wordIndex) => {
        setPlayerState({
            ...playerState,
            time: playerState.wordTimes[playerState.index][wordIndex]
        })
    }

    return {
        playerState,
        handleFrame,
        loadSentenceClips,
        setSentences,
        setIndex,
        play,
        stop,
        seek,
        reset,
        seekWord
    }
}

export const useSignRecognition = (onPrediction) => {
    const holisticRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        // Set up websocket connection
        const socket = new WebSocket(config.SIGN_RECOGNITION_ENDPOINT);
        socketRef.current = socket;
        
        // Set up MediaPipe holistic
        const holistic = new Holistic({locateFile: file => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }});
        holistic.setOptions({
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        holistic.onResults(result => {
            const frame = processResult(result);
            const data = JSON.stringify(frame);

            if (socket.readyState === WebSocket.OPEN) socket.send(data);
        });
        holisticRef.current = holistic;

        return () => {
            holistic.close();
            socket.close();
        };
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        socket.onmessage = event => onPrediction(JSON.parse(event.data));

    }, [onPrediction]);

    const handleFrame = useCallback(async (videoElement) => {
        const holistic = holisticRef.current;
        await holistic.send({image: videoElement});

    }, []);

    return { handleFrame };
}
