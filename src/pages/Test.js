import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaSquare } from "react-icons/fa";

import Loading from "../components/Loading";
import { ModelPlayer } from "components/ModelPlayer";
import { useModelPlayer } from "components/hooks";
import { getVocab } from "api";

// TODO Get current lesson
const currentLesson = 1;

const VocabQuiz = () => {
    const { lessonId, vocabIndex } = useParams(); // to fetch which lesson and which vocab
    const [vocab, setVocab] = useState(null);
  
    const {
      playerState,
      handleFrame,
      loadSentenceClips,
      setSentences, setIndex,
      seek, play, stop, reset
    } = useModelPlayer();
  
    // Current word from player state
    const word = playerState.sentences[playerState.index]?.at(0);
    const wordDuration = playerState.wordTimes[playerState.index]?.at(-1);

    // Init currentQuestion to 0
    // const [currentQuestion, setCurrentQuestion] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(null)

    const questions = [
		{
			questionText: 'What is the capital of France?',
			answerOptions: [
				{ answerText: 'New York', isCorrect: false },
				{ answerText: 'London', isCorrect: false },
				{ answerText: 'Paris', isCorrect: true },
				{ answerText: 'Dublin', isCorrect: false },
			],
		},
		{
			questionText: 'Who is CEO of Tesla?',
			answerOptions: [
				{ answerText: 'Jeff Bezos', isCorrect: false },
				{ answerText: 'Elon Musk', isCorrect: true },
				{ answerText: 'Bill Gates', isCorrect: false },
				{ answerText: 'Tony Stark', isCorrect: false },
			],
		},
		{
			questionText: 'The iPhone was created by which company?',
			answerOptions: [
				{ answerText: 'Apple', isCorrect: true },
				{ answerText: 'Intel', isCorrect: false },
				{ answerText: 'Amazon', isCorrect: false },
				{ answerText: 'Microsoft', isCorrect: false },
			],
		},
		{
			questionText: 'How many Harry Potter books are there?',
			answerOptions: [
				{ answerText: '1', isCorrect: false },
				{ answerText: '4', isCorrect: false },
				{ answerText: '6', isCorrect: false },
				{ answerText: '7', isCorrect: true },
			],
		},
	];

    const handleAnswerButtonClick = (isCorrect) => {
        const nextQuestion = currentQuestion + 1;

        if (isCorrect) {
            // alert("Your answer is correct!");

            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                nextVocab();
            } else {
                alert('You have reached the end of the quiz');
                // TODO
                // Return to lesson page
            }
        } else {
            alert("Your answer is incorrect, try again!");
            // TODO
            // Let user retry
        }
    };

    useEffect(() => {
      const fetchVocabAndLoadWords = async () => {
        // const res = await getVocab(lessonId, vocabIndex);
        const res = await getVocab(currentLesson, 1);   // PLACEHOLDER
        const vocab = res.data;
  
        setVocab(vocab);
        setSentences(vocab.words.map(word => [word]));
      };
  
      fetchVocabAndLoadWords();
      setCurrentQuestion(0);
      // const answers = generateRandomAnswerIndex();
      // console.log(answers);
    }, []);
  
    // Previous and Next Vocab Functions
    function checkIndex(index) {
      if (index > playerState.sentences.length - 1) {
        // TODO
        // End of quiz, go to subsequent page
        return 0;
      }
      if (index < 0) {
        return playerState.sentences.length - 1;
      }
      return index;
    }
  
    function prevVocab() {
      const newIndex = checkIndex(playerState.index - 1);
      setIndex(newIndex);
    }
  
    function nextVocab() {
      const newIndex = checkIndex(playerState.index + 1);
      setIndex(newIndex);
    }

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

      options = options.map((word, i) => ({word, isCorrect: i == 0}));
      shuffleArray(options)

      return options;
    }
  
    if (!vocab) {
      return <Loading />;
    }
  
    return (
      <section className="container section">
        <h3 className="section-title">Select the correct meaning for the following sign!</h3>
        <div className="vocab-card">
          <h3 className="card-title">{word}</h3>
          {/* <div className="model-prevnext"> */}
            {/* <button className="prev-btn" onClick={prevVocab}>
              <FaChevronLeft />
            </button> */}
            <div className="model-player">
              {/* <ModelPlayer
                playerState={playerState}
                handleFrame={handleFrame}
                loadSentenceClips={loadSentenceClips}
              /> */}
              <p>Model placeholder</p>
            </div>
            {/* <button className="next-btn" onClick={nextVocab}>
              <FaChevronRight />
            </button> */}
          {/* </div> */}
          <div className="card-footer">
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

          <div className="quiz-container">
            <div className='quiz-question'>
                <div className='question-count'>
                    <span>Question {currentQuestion + 1}</span>/{questions.length}
                </div>
                <div className='question-text'>{questions[currentQuestion].questionText}</div>
            </div>
            <div className="quiz-answer">
                {questions[currentQuestion].answerOptions.map((answerOption, index ) => (
                    <button onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}>{answerOption.answerText}</button>
                ))}
            </div>
          </div>

        </div>
      </section>
    );
  };
  
  export default VocabQuiz;
  