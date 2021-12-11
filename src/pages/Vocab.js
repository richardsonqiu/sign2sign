import React from "react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useStateRef from "react-usestateref";
import Loading from "../components/Loading";
import { vocabulary as vocabData } from "../data/vocabulary.json";
import { word } from "../data/word.json"; // get word for particular lesson and vocab
import { useGlobalContext } from "../context";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import sampleModel from "../imgs/sample-model.png";

const Vocab = () => {
  const { lessonId, vocabId } = useParams(); // to fetch which lesson and which vocab
  const { user, vocabProgress } = useGlobalContext();

  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState([]); // from vocabularies.words
  const [index, setIndex] = useState(0); // to set which vocab is being displayed
  const [currLandmark, setCurrLandmark] = useState(null);

  // Data fetching
  function getVocabs() {
    setLoading(true);
    try {
      const response = vocabData;
      const data = response;
      if (data) {
        const lessonVocabs = data.find(
          (item) => item.lessonId == lessonId && item.id == vocabId
        );
        const vocabWords = lessonVocabs.words;
        setWords(vocabWords);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getVocabs();
  }, []);

  function getLandmarks(index) {
    const landmark = wordbank.find(
      (item) => item.text === words[index]
    ).landmarks;
    setCurrLandmark(landmark);
  }

  // Previous and Next Vocab Functions
  function checkIndex(index) {
    if (index > words.length - 1) {
      return 0;
    }
    if (index < 0) {
      return words.length - 1;
    }
    return index;
  }

  function prevVocab() {
    setIndex((index) => {
      let newIndex = index - 1;
      getLandmarks(checkIndex(newIndex));
      return checkIndex(newIndex);
    });
  }

  function nextVocab() {
    setIndex((index) => {
      let newIndex = index + 1;
      getLandmarks(checkIndex(newIndex));
      return checkIndex(newIndex);
    });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container section">
      <h3 className="section-title">Follow this sign!</h3>
      <div className="vocab-card">
        <h3 className="card-title">{words[index]}</h3>
        <div className="model-prevnext">
          <button className="prev-btn" onClick={prevVocab}>
            <FaChevronLeft />
          </button>
          <img src={sampleModel} />
          <button className="next-btn" onClick={nextVocab}>
            <FaChevronRight />
          </button>
        </div>
        <div className="card-footer">
          <p>(Landmarks: {currLandmark})</p>
          <p>(Player Component)</p>
        </div>
      </div>
    </section>
  );
};

export default Vocab;
