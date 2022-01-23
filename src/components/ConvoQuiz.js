import { useEffect, useState } from "react";
import { CameraInput } from "./CameraInput";
import { useModelPlayer, useSignRecognition } from "./hooks";
import Loading from "./Loading";
import { ModelPlayer } from "./ModelPlayer";
import { PlaybackControls } from "./PlaybackControls";
import { PredictionDisplay } from "./PredictionDisplay";
import { ProgressBar } from "./ProgressBar";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getAllGloss(dialogue) {
    let glossSet = new Set();

    for (let i = 0; i < dialogue.length; i++) {
        for (let j = 0; j < dialogue[i].glossSentence.length; j++) {
            glossSet.add(dialogue[i].glossSentence[j].gloss)
        }
    }

    const gloss = [...glossSet];
    shuffleArray(gloss);
    return gloss;
}

function getCorrectAns(dialogue) {
    let gloss = [];

    for (let j = 0; j < dialogue.glossSentence.length; j++) {
        gloss.push(dialogue.glossSentence[j].gloss)
    }

    return gloss;
}

const ReadSign = ({ dialogue, question, answer, handleSetAnswer, modelPlayer }) => {
    const {
        playerState, handleFrame,
        play, stop, reset, seek
    } = modelPlayer;

    const { correctAns } = question;

    const appendWord = (word) => {
        handleSetAnswer([...answer, word]);
    }

    const resetAnswer = () => {
        handleSetAnswer([]);
    }

    return <div className="convo-card">
        <h3 className="card-instruction">Form the sentence signed below!</h3>

        <div className="model-container">
            <ModelPlayer playerState={playerState} handleFrame={handleFrame} />
            <PlaybackControls playerState={playerState} play={play} stop={stop} reset={reset} seek={seek} />
        </div>

        <div className="dialogue">
            <p className="person-sentence">{dialogue.person}: {dialogue.sentence[0]}</p>
            <div>
                {dialogue.person == 'A' ? "" : (<p>Gloss: {correctAns.join(" ")}</p>)}
            </div>
            <p>Gloss reference: {correctAns.join(" ")}</p>
        </div>

        <div className="player-answer">
            <p>Your answer:</p>
            <div className="player-answer-grid">
                {
                    answer.map((ans, i) => {
                        if (ans) {
                            return <button key={i} className="player-answer-btn">{ans}</button>
                        }
                    })
                }
            </div>

            <button className="answer-reset-btn" onClick={resetAnswer}>RESET ANSWER</button>
        </div>

        <div className="options">
            {
                question.options.map(word => {
                    return <button key={word} className="option-btn" onClick={() => appendWord(word)}>{word}</button>
                })
            }
        </div>
    </div>
}

const DoSign = ({ dialogue, handleSetAnswer }) => {
    const [predictions, setPredictions] = useState([]);
    const [nextPredIndex, setNextPredIndex] = useState(0);

    const targetAnswer = dialogue.glossSentence.map(w => w.gloss);
    const onPrediction = (p) => {
        const isMatch = p == targetAnswer[nextPredIndex];

        if (isMatch) {
            setNextPredIndex(nextPredIndex + 1);
            handleSetAnswer(targetAnswer.slice(0, nextPredIndex + 1));
        }
        setPredictions([...predictions, { text: p, isMatch }]);
    };

    const { handleFrame } = useSignRecognition(onPrediction);

    return <div className="convo-card">
        <div className="card-instruction">Sign the following sentence!</div>

        <CameraInput handleFrame={handleFrame} />

        <div className="dialogue">
            <p className="person-sentence">{dialogue.person}: {dialogue.sentence[0]}</p>
            <div>
                <p>Gloss: {targetAnswer.join(" ")}</p>
            </div>
        </div>

        <div style={{ fontSize: "2em" }}>
            <PredictionDisplay predictions={predictions} />
        </div>
    </div>
}

export const ConvoQuiz = ({ title, dialogue, onPrevSection, onNextSection }) => {
    const [index, setIndex] = useState(0);

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    const modelPlayer = useModelPlayer();

    useEffect(() => {
        modelPlayer.setSentencesWithAnimation(dialogue.map(d => d.glossSentence));
    }, [dialogue]);

    useEffect(() => {
        modelPlayer.setIndex(index);
    }, [index]);

    useEffect(() => {
        setQuestions(dialogue.map(d => ({
            correctAns: getCorrectAns(d),
            options: getAllGloss(dialogue)
        })));
        setAnswers(dialogue.map(() => []));
    }, []);

    function handleSetAnswer(answer) {
        let newAnswers = [...answers];
        newAnswers[index] = answer;

        setAnswers(newAnswers);
    }

    function checkAnswer() {
        const { correctAns } = questions[index];

        const ans = answers[index];
        var is_same = (ans.length === correctAns.length) && ans.every(function (element, i) {
            return element === correctAns[i];
        });

        return is_same;
    }

    if (questions.length == 0 || answers.length == 0 || modelPlayer.playerState.sentences.length == 0) {
        return <Loading />
    }

    return (
        <section className="container section">
            <h3 className="section-title">{title}</h3>
            <ProgressBar max={dialogue.length} val={index + 1} />

            {dialogue[index].person == 'A' ?
                <ReadSign
                    dialogue={dialogue[index]}
                    question={questions[index]}
                    answer={answers[index]}
                    handleSetAnswer={handleSetAnswer}
                    modelPlayer={modelPlayer}
                /> :
                <DoSign dialogue={dialogue[index]} handleSetAnswer={handleSetAnswer} />
            }

            <div className="prev-next-section">
                <button
                    className="section-btn"
                    onClick={() => index == 0 ? onPrevSection() : setIndex(index - 1)}
                >
                    {index == 0 ? "PREV SECTION" : "PREV"}
                </button>
                <button
                    className="section-btn"
                    disabled={!checkAnswer()}
                    onClick={() => index == dialogue.length - 1 ? onNextSection() : setIndex(index + 1)}
                >
                    {index == dialogue.length - 1 ? "NEXT SECTION" : "NEXT"}
                </button>
            </div>

        </section>
    );
}
