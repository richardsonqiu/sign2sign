import { useState, useEffect } from 'react';
import { VRM } from "@pixiv/three-vrm";

import { loadGLTF, getBoneNames } from 'utils/vrm';
import { getSentenceClipWithTimes } from 'utils/track';

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
        if (!vrm) return;

        const boneNames = getBoneNames(vrm);
        const sc = playerState.sentences.map(sentence => getSentenceClipWithTimes(sentence, boneNames));
        
        setPlayerState({
            ...playerState,
            sentenceClips: sc.map(x => x.clip),
            wordTimes: sc.map(x => x.wordTimes)
        });
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
