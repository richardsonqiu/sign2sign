import { useEffect, useRef } from 'react';

import { AnimationMixer, LoopOnce } from "three";
import { VRMSchema } from "@pixiv/three-vrm"
import { useFrame } from '@react-three/fiber'

export const Model = ({ vrm, playerState, handleFrame }) => {
    const mixer = useRef(null);
    const actions = useRef([]);

    const currentAction = () => {
        return actions.current[playerState.index];
    };

    useFrame((state, delta) => {
        if (mixer.current) mixer.current.update(delta);
        
        const action = currentAction();
        if (action) handleFrame(action);
    });

    useEffect(() => {
        if (!vrm) return;
        
        vrm.scene.rotation.y = Math.PI;
        for (const boneName of Object.values(VRMSchema.HumanoidBoneName)) {
            const node = vrm.humanoid.getBoneNode(boneName);
            if (node) {
                node.rotation.order = "ZYX";
            }
        }

        mixer.current = new AnimationMixer(vrm.scene);
        actions.current = playerState.sentenceClips.map(clip => mixer.current.clipAction(clip));

    }, [vrm]);

    useEffect(() => {
        if (!playerState.sentenceClips || !mixer.current) return;
        actions.current = playerState.sentenceClips.map(clip => mixer.current.clipAction(clip));

    }, [playerState.sentenceClips]);

    useEffect(() => {
        const action = currentAction();
        if (!action) return;

        mixer.current.stopAllAction();
        action.play();
        action.loop = LoopOnce;
        action.clampWhenFinished = true;
        action.paused = !playerState.isPlaying;
        action.time = 0;

    }, [playerState.sentenceClips, playerState.index]);

    useEffect(() => {
        const action = currentAction();
        if (!action) return;

        action.time = playerState.time;
        action.paused = !playerState.isPlaying;

    }, [playerState.time, playerState.isPlaying])

    // useEffect(() => {
    //     const action = actions.current[index];
    //     if (action) handleAction(action);

    // }, [handleAction]);

    return vrm && <primitive object={vrm.scene} />;
}
