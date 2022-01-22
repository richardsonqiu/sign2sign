import { CameraInput } from "components/CameraInput";
import { ConvoPractice } from "components/ConvoPractice";
import { useModelPlayer, useSignRecognition } from "components/hooks";
import Loading from "components/Loading";
import { ModelPlayer } from "components/ModelPlayer";
import { PredictionDisplay } from "components/PredictionDisplay";
import { useEffect, useState, useRef } from "react"
import { FaPause, FaPlay, FaSquare } from "react-icons/fa";


// export default () => {
//     const [predictions, setPredictions] = useState([]);
//     const { handleFrame } = useSignRecognition(p => setPredictions([...predictions, p]));

//     return <div>
//         <CameraInput handleFrame={handleFrame} />
//         <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)"}}>
//             {predictions.map((val, i) =>
//                 <div key={i}>
//                     {val}
//                 </div>
//             )}
//         </div>
//     </div>
// }

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ProgressBar = ({ max, val }) => {
    return <div className="progress-bar">
        <div className="filled" style={{ width: `${val * 100 / max}%` }}></div>
    </div>
}

function parseGLTF(data) {
    const loader = new GLTFLoader();
    return new Promise(function (resolve, reject) {
        loader.parse(data, null, resolve, reject);
    });
}


const ConvertAnimation = () => {
    const [file, setFile] = useState(null);
    const [animations, setAnimations] = useState({});

    useEffect(() => {
        if (!file) return;

        (async () => {
            const gltf = await parseGLTF(await file.arrayBuffer());
            const clips = {};
            for (const clip of gltf.animations) {
                clips[clip.name] = clip.toJSON();
            }
            setAnimations(clips);
        })()

    }, [file]);

    return <div>
        <input type={"file"} onChange={async e => {
            const files = e.target.files;
            if (files.length == 0) {
                return;
            }

            setFile(files[0]);
        }} />
        <ol>
            {Object.entries(animations).map(([name, data]) => {
                const blob = new Blob([JSON.stringify(data)], { type: "text/json" });
                return <li key={name}>
                    <a
                        download={`${file.name.substring(0, file.name.length - 5)}.json`}
                        href={URL.createObjectURL(blob)}

                    >
                        {name}
                    </a>
                </li>
            })}
        </ol>
    </div>
}

const ModelTest = () => {
    const {
        playerState,
        handleFrame,
        setSentencesWithAnimation, setIndex,
        seek, play, stop, reset
    } = useModelPlayer();

    useEffect(() => {
        (async () => {
            await setSentencesWithAnimation([["test_wave", "hello", "face"]]);
        })()
    }, []);

    if (playerState.sentences.length == 0) return <Loading />

    // Current word from player state
    const word = playerState.sentences[playerState.index]?.at(0);
    const wordDuration = playerState.wordTimes[playerState.index]?.at(-1);

    return <div>
        <div className="model-player">
            <ModelPlayer
                playerState={playerState}
                handleFrame={handleFrame}
            //   debug={true}
            />
        </div>
        <div className="model-controls">
            <div
                className="play-pause"
                onClick={() =>
                    (Math.abs(playerState.time - wordDuration) < 0.01)
                        ? reset()
                        : (playerState.isPlaying)
                            ? stop()
                            : play()
                }
            >
                {
                    (Math.abs(playerState.time - wordDuration) < 0.01)
                        ? <FaSquare />
                        : (playerState.isPlaying)
                            ? <FaPause />
                            : <FaPlay />
                }
            </div>
            <input
                type="range"
                min={0}
                max={wordDuration}
                step={0.01}
                value={playerState.time}
                onInput={e => seek(parseFloat(e.target.value))}
            />
        </div>
    </div>
}



function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const words = ["heh", "boop", "testing", "gyaa", "dotdotdot"]
const Boop = () => {
    const [predictions, setPredictions] = useState([]);
    const [nextPredIndex, setNextPredIndex] = useState(0);

    useInterval(() => {
        const text = words[Math.floor(Math.random() * words.length)]

        const targetSequence = ["heh", "gyaa", "testing", "dotdotdot", "dotdotdot", "testing", "testing"];
        const isMatch = text == targetSequence[nextPredIndex];

        if (isMatch) {
            setNextPredIndex(nextPredIndex + 1)
        }

        setPredictions([...predictions, { text, isMatch }])
    }, 2000);

    return <div style={{fontSize: "2em"}}>
        <PredictionDisplay predictions={predictions} />
    </div>
}

const dialogues = [
    {
        person: "A",
        sentence: "sakit perut",
        glossSentence: [
            { gloss: "HELLO" },
            { gloss: "I/ME" },
            { gloss: "FINE" },
            { gloss: "YOU" },
            { gloss: "DO", emotion: "question" }
        ]
    }
]

export default () => <div>
    <ConvertAnimation />
    {/* <ConvoPractice dialogues={dialogues} /> */}
</div>
