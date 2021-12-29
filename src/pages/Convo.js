import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import sampleUser from "img/sample-user.png";
import { getConversation } from "api";
import { useModelPlayer } from "components/hooks";
import { ModelPlayer } from "components/ModelPlayer";

const Convo = () => {
  const { lessonId, convoIndex } = useParams(); // to fetch which lesson and which vocab
  const [convo, setConvo] = useState(null);

  const {
    playerState,
    handleFrame,
    loadSentenceClips,
    setSentences, setIndex,
    seek, play, stop, reset
  } = useModelPlayer();

  useEffect(() => {
    const fetchConvo = async () => {
      const res = await getConversation(lessonId, convoIndex);
      const convo = res.data;

      setConvo(convo);
      setSentences(convo.dialogue.map(d => d.glossSentence));
    }

    fetchConvo();
  }, []);

  // Previous and Next Convo Functions
  function checkIndex(index) {
    if (index > playerState.sentences.length - 1) {
      return 0;
    }
    if (index < 0) {
      return playerState.sentences.length - 1;
    }
    return index;
  }

  function prevConvo() {
    const newIndex = checkIndex(playerState.index - 1);
    setIndex(newIndex);
  }

  function nextConvo() {
    const newIndex = checkIndex(playerState.index + 1);
    setIndex(newIndex);
  }

  if (!convo || !playerState.sentences.length) {
    return <Loading />;
  }

  const text = convo.dialogue[playerState.index].sentence;
  
  const gloss = playerState.sentences[playerState.index];
  const wordTimes = playerState.wordTimes[playerState.index];

  return (
    <section className="container section">
      <h3 className="section-title">{convo.title}</h3>
      <div className="convo-card">
        {/* <h3 className="card-title">{lessonVocabs[index]}</h3> */}
        <div className="convo-container">
          <div className="model-camera">
            <div className="model-player">
              <ModelPlayer
                playerState={playerState}
                handleFrame={handleFrame}
                loadSentenceClips={loadSentenceClips}
              />
            </div>
            <img src={"/img/sample-user.png"} />
          </div>
          <div className="model-prevnext">
            <button className="prev-btn" onClick={prevConvo}>
              <FaChevronLeft />
            </button>
            <div className="sentence-gloss">
              {text.map((item, id) => {
                return (
                  <>
                    <span key={id}>{item}</span>
                  </>
                );
              })}

              <div className="gloss-section">
                {gloss.map((item, index) => {
                  return (
                    <span
                      className="gloss"
                      key={index}
                      onClick={() => seek(wordTimes[index])}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>

            <button className="next-btn" onClick={nextConvo}>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Convo;
