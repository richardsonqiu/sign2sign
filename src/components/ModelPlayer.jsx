import { useEffect } from 'react';

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import { Model } from 'components/Model'
import { useVrm } from 'components/hooks'


export function ModelPlayer({ playerState, loadSentenceClips, handleFrame, debug }) {
    const vrm = useVrm("/models/three-vrm-girl.vrm");

    useEffect(() => {
        loadSentenceClips(vrm);

    }, [vrm, playerState.sentences]);

    return (
        <Canvas
            onCreated={state => {
                state.gl.toneMapping = THREE.NoToneMapping;
                state.gl.outputEncoding = THREE.LinearEncoding;
            }}
            camera={{
                fov: 50,
                position: [0, 1, 1.4]
            }}
        >
            <Model
                vrm={vrm}
                playerState={playerState}
                handleFrame={handleFrame}
            />
            <directionalLight
                args={["white", 1]}
                position={[1, 1, 1]}
            />
            <OrbitControls
                target={[0, 1, 0]}
                enablePan={false}
            />
            { debug && <axesHelper args={[5]} /> }
            { debug && <gridHelper args={[10, 10]} /> }
            <color attach="background" args={["black"]} />
        </Canvas>
    )
}