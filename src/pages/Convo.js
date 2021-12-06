import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import useStateRef from "react-usestateref";
import Loading from "../components/Loading";
import { conversation as convoData } from "../data/conversation.json";
import { word } from "../data/word.json"; // get word for particular lesson and vocab
import { useGlobalContext } from "../context";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import sampleImg from "../imgs/lesson2.png";

const Convo = () => {
  const { lessonId, convoId } = useParams(); // to fetch which lesson and which vocab
  const { user, vocabProgress } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [wordbank, setWordbank] = useState([]); // from word.json
  const [dialogue, setDialogue] = useState([]); // from conversation.dialog
  const [glossSentences, setGlossSentences] = useState([]); // from conversation.dialog.glossSentence
  const [oriSentences, setOriSentences] = useState([]); // from conversation.dialog.sentence
  const [index, setIndex] = useState(0); // to set which glossSentence is being displayed

  // Data fetching
  function getConvos() {
    setLoading(true);
    try {
      const response = convoData;
      const data = response;
      if (data) {
        const lessonConvos = data.find(
          (item) => item.lessonId == lessonId && item.id == convoId
        );
        const convoDialog = lessonConvos.dialogue;
        setDialogue(convoDialog);

        const glossSentenceList = [];
        const oriSentenceList = [];
        convoDialog.map((item) => {
          glossSentenceList.push(item.glossSentence);
          oriSentenceList.push(item.sentence);
        });
        setGlossSentences(glossSentenceList);
        setOriSentences(oriSentenceList);
      } else {
        setDialogue(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function getWordbank() {
    setLoading(true);
    try {
      const response = word;
      const data = response;
      if (data) {
        setWordbank(data);
      } else {
        setWordbank(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getWordbank();
    getConvos();
  }, []);

  // Previous and Next Vocab Functions
  function checkIndex(index) {
    if (index > dialogue.length - 1) {
      return 0;
    }
    if (index < 0) {
      return dialogue.length - 1;
    }
    return index;
  }

  function prevConvo() {
    setIndex((index) => {
      let newIndex = index - 1;
      return checkIndex(newIndex);
    });
  }

  function nextConvo() {
    setIndex((index) => {
      let newIndex = index + 1;
      return checkIndex(newIndex);
    });
  }

  const currGloss = glossSentences[index];
  const currSentence = oriSentences[index];

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container section">
      <h3 className="section-title">(lesson title)</h3>
      <div className="convo-card">
        {/* <h3 className="card-title">{lessonVocabs[index]}</h3> */}
        <div className="convo-container">
          <div className="model-camera">
            <img src={sampleImg} />
            <img src={sampleImg} />
          </div>
          <div className="model-prevnext">
            <button className="prev-btn" onClick={prevConvo}>
              <FaChevronLeft />
            </button>
            <div className="sentence-gloss">
              {currSentence.map((item, id) => {
                return (
                  <>
                    <span key={id}>{item}</span>
                  </>
                );
              })}

              <div className="gloss-section">
                {currGloss.map((item, id) => {
                  return (
                    <span className="gloss" key={id}>
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
