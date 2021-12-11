import { useState, useEffect } from 'react';
import { VRM } from "@pixiv/three-vrm";

import { loadGLTF, GetBoneNames } from 'util/vrm';
import { getSentenceClipWithTimes } from 'util/track';

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
        sentenceIndex: 0,
        wordTimes: [],
        time: 0
        // handleAction: () => null
    });

    const handleFrame = (action) => {
        if (action.time - playerState.time > 0.1) {
            setPlayerState({ ...playerState, time: action.time });
        }
    }

    const setSentences = (sentences) => {
        setPlayerState({
            ...playerState,
            sentences
        });
    }

    const setSentenceIndex = (sentenceIndex) => {
        setPlayerState({
            ...playerState,
            sentenceIndex,
            time: 0,
            isPlaying: false
        });
    }

    const loadSentenceClips = (vrm) => {
        if (!vrm) return;

        const boneNames = GetBoneNames(vrm);
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

    const seek = (time) => {
        setPlayerState({
            ...playerState,
            time,
        });
    }
    
    const seekWord = (wordIndex) => {
        setPlayerState({
            ...playerState,
            time: playerState.wordTimes[playerState.sentenceIndex][wordIndex]
        })
    }

    return {
        playerState,
        handleFrame,
        loadSentenceClips,
        setSentences,
        setSentenceIndex,
        play,
        stop,
        seek,
        seekWord
    }
}
