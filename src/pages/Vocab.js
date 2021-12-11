import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { useGlobalContext } from "../context";
import Loading from "../components/Loading";
import { ModelPlayer } from "components/ModelPlayer";
import { useModelPlayer } from "components/hooks";

import { vocabulary as vocabData } from "../data/vocabulary.json";

const Vocab = () => {
  const { lessonId, vocabId } = useParams(); // to fetch which lesson and which vocab
  const { user, vocabProgress } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const { playerState, handleFrame, loadSentenceClips, setSentences, setIndex } = useModelPlayer();

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
        <h3 className="card-title">{playerState.sentences[playerState.index]?.at(0)}</h3>
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
          <p>(Player Component)</p>
        </div>
      </div>
    </section>
  );
};

export default Vocab;
