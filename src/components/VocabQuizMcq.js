import { useEffect, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { VocabModelPlayer } from "./VocabModelPlayer";


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateRandomOptions(words, currentIndex, totalOptions) {
    let options = [words[currentIndex]];

    while (options.length < totalOptions) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];
        if (!options.includes(word)) {
            options.push(word);
        }
    }

    // options = options.map((word, i) => ({ word, isCorrect: i == 0 }));
    shuffleArray(options)

    return options;
}

export const VocabQuizMcq = ({ title, words, onPrevSection, onNextSection }) => {
    const [index, setIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        setQuestions(words.map((word, i) => ({
            correctAns: word,
            options: generateRandomOptions(words, i, 4)
        })));
        setAnswers(words.map(() => null));
    }, []);

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
                <h3 className="card-instruction">Select the correct meaning for the following sign!</h3>
                <h3 className="card-title">{words[index]}</h3>

                <div className="model">
                    <VocabModelPlayer words={words} index={index} />
                </div>

                <div className="options">
                    {questions[index]?.options.map(word => {
                        const ans = answers[index];
                        const correctAns = questions[index].correctAns;

                        const classList = ["option-btn"];
                        if (ans == word) {
                            classList.append(ans == correctAns ? "correct" : "incorrect");
                        }

                        // TODO setAnswers()
                        return <button className={classList.join(" ")} onClick={() => setAnswers()}>{word}</button>
                    })}
                </div>
            </div>

            <div className="prev-next-section">
                <button className="section-btn" onClick={() => index == 0 ? onPrevSection() : prevVocab()}>{1 ? "PREV" : "boop"}</button>
                {/* TODO Prevent user from going to next question if ans not right and gray out NEXT */}
                <button className="section-btn" onClick={() => index == words.length - 1 ? onNextSection() : nextVocab()}>NEXT</button>
                {/* TODO On correct answer, give correct ans message */}
            </div>

        </section>
    );
}