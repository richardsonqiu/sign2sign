import React from "react";
import { useEffect, useState, useCallback } from "react";
import useStateRef from "react-usestateref";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { vocabularies as vocabs } from "../data/vocabularies.json";
import { useGlobalContext } from "../context";

const VocabList = () => {
  const { user, vocabProgress, lessonsData } = useGlobalContext();
  const [loading, setLoading] = useStateRef(false);
  var [vocabsGroup, setVocabsGroup] = useStateRef([]);

  function getVocabGroup() {
    try {
      const response = vocabs;
      const data = response;
      if (data) {
        var vocabsGroupByLesson = data.reduce((r, item) => {
          r[item.lessonId] = [...(r[item.lessonId] || []), item];
          return r;
        }, {});
        const vocabsGroupArray = Object.values(vocabsGroupByLesson);
        setVocabsGroup(vocabsGroupArray);
      } else {
        setVocabsGroup(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getVocabGroup();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container section">
      <h3 className="section-title">Vocabularies</h3>
      {vocabsGroup.map((vocabs, index) => {
        let lesson = lessonsData.find((lesson) => lesson.id === index + 1);
        return (
          <>
            <h3 className="lesson-title">
              Lesson {index + 1}: {lesson.title}
            </h3>
            <div className="cards-center">
              {vocabs.map((item, idx) => {
                return (
                  <Card
                    key={item.id}
                    {...item}
                    url={`lesson/${item.lessonId}/vocabulary/${item.order}`}
                    title={`${item.title}`}
                    img={item.imgSrc}
                    desc={item.desc}
                  />
                );
              })}
            </div>
          </>
        );
      })}
    </section>
  );
};

export default VocabList;
