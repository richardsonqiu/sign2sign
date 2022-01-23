import { useEffect, useState } from "react";
import { CameraInput } from "./CameraInput";
import { useSignRecognition } from "./hooks";
import { PredictionDisplay } from "./PredictionDisplay";
import { ProgressBar } from "./ProgressBar";

export const VocabQuizSigning = ({ title, words, onPrevSection, onNextSection }) => {
    const [index, setIndex] = useState(0);

    const [predictions, setPredictions] = useState([]);
    const [nextPredIndex, setNextPredIndex] = useState(0);

    const onPrediction = (p) => {
        const targetSequence = [words[index].gloss];
        const isMatch = p == targetSequence[nextPredIndex];

        if (isMatch) setNextPredIndex(nextPredIndex + 1);
        console.log(p)
        setPredictions([...predictions, { text: p, isMatch }]);
    };

    useEffect(() => {
        setPredictions([]);
        setNextPredIndex(0);
    }, [index]);

    const { handleFrame } = useSignRecognition(onPrediction);

    function prevVocab() {
        const prevIndex = Math.max(index - 1, 0);
        setIndex(prevIndex);
    }

    function nextVocab() {
        const nextIndex = Math.min(index + 1, words.length - 1);
        setIndex(nextIndex);
    }

    return (
        <section className="container section">
            <h3 className="section-title">{title}</h3>
            <ProgressBar max={words.length} val={index + 1} />
            <div className="vocab-card">
                <h3 className="card-instruction">Sign the following words!</h3>
                <h3 className="card-title">{words[index].gloss}</h3>

                <div className="model">
                    <CameraInput handleFrame={handleFrame} />
                </div>

                {/* Prediction section */}
                <div style={{fontSize: "2em"}}>
                    <PredictionDisplay predictions={predictions} />
                </div>
            </div>

            <div className="prev-next-section">
                <button
                    className="section-btn"
                    onClick={() => index == 0 ? onPrevSection() : prevVocab()}
                >
                    {index == 0 ? "PREV SECTION" : "PREV"}
                </button>
                <button 
                    className="section-btn"
                    disabled={nextPredIndex < 1}
                    onClick={() => index == words.length - 1 ? onNextSection() : nextVocab()}
                >
                    {index == words.length - 1 ? "NEXT SECTION" : "NEXT"}
                </button>
            </div>

        </section>
    );
}
