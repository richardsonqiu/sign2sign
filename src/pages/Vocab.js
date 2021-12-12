import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaAngleDoubleLeft, FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaSquare, FaSyncAlt, FaUndo, FaUndoAlt } from "react-icons/fa";

import { useGlobalContext } from "../context";
import Loading from "../components/Loading";
import { ModelPlayer } from "components/ModelPlayer";
import { useModelPlayer } from "components/hooks";

import { vocabulary as vocabData } from "../data/vocabulary.json";

const Vocab = () => {
  const { lessonId, vocabId } = useParams(); // to fetch which lesson and which vocab
  const { user, vocabProgress } = useGlobalContext();

  const [loading, setLoading] = useState(true);
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

  // Data fetching
  function fetchWords() {
    setLoading(true);
    try {
      const response = vocabData;
      const data = response;
      if (data) {
        const lessonVocabs = data.find(
          (item) => item.lessonId == lessonId && item.id == vocabId
        );
        const vocabWords = lessonVocabs.words;
        setSentences(vocabWords.map(word => [word]));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWords();
  }, []);

  // Previous and Next Vocab Functions
  function checkIndex(index) {
    if (index > playerState.sentences.length - 1) {
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

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container section">
      <h3 className="section-title">Follow this sign!</h3>
      <div className="vocab-card">
        <h3 className="card-title">{word}</h3>
        <div className="model-prevnext">
          <button className="prev-btn" onClick={prevVocab}>
            <FaChevronLeft />
          </button>
          <div className="model-player">
            <ModelPlayer
              playerState={playerState}
              handleFrame={handleFrame}
              loadSentenceClips={loadSentenceClips}
            />
          </div>
          <button className="next-btn" onClick={nextVocab}>
            <FaChevronRight />
          </button>
        </div>
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
      </div>
    </section>
  );
};

export default Vocab;
