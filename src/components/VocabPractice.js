import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { VocabModelPlayer } from "./VocabModelPlayer";


export const VocabPractice = ({ title, words, onPrevSection, onNextSection }) => {
    const [index, setIndex] = useState(0);

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
            <ProgressBar max={words.length} val={index+1} />
            <div className="vocab-card">
                <h3 className="card-instruction">Follow this sign!</h3>
                <h3 className="card-title">{words[index]}</h3>

                <div className="model">
                    <VocabModelPlayer words={words} index={index} />
                </div>

            </div>

            <div className="prev-next-section">
                <button className="section-btn" onClick={() => index == 0 ? onPrevSection() : prevVocab()}>{1 ? "PREV" : "boop"}</button>
                <button className="section-btn" onClick={() => index == words.length - 1 ? onNextSection() : nextVocab()}>NEXT</button>
            </div>

        </section>
    );
}