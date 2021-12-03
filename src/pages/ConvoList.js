import React from "react";
import { useEffect, useState, useCallback } from "react";
import useStateRef from "react-usestateref";
import Card from "../components/Card";
import Loading from "../components/Loading";
import { conversations as convos } from "../data/conversations.json";
import { lessons } from "../data/lessons.json";
import { useGlobalContext } from "../context";

const ConvoList = () => {
  const { user, convoProgress } = useGlobalContext();
  const [loading, setLoading] = useStateRef(false);
  var [convosGroup, setConvosGroup] = useStateRef([]);

  function getConvoGroup() {
    try {
      const response = convos;
      const data = response;
      if (data) {
        var convosGroupByLesson = data.reduce((r, item) => {
          r[item.lessonId] = [...(r[item.lessonId] || []), item];
          return r;
        }, {});
        const convosGroupArray = Object.values(convosGroupByLesson);
        setConvosGroup(convosGroupArray);
      } else {
        setConvosGroup(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getConvoGroup();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="container section">
      <h3 className="section-title">Conversations</h3>
      {convosGroup.map((convos, index) => {
        console.log(convos);
        let lesson = lessons.find((lesson) => lesson.id === index + 1);
        return (
          <>
            <h3 className="lesson-title">
              Lesson {index + 1}: {lesson.title}
            </h3>
            <div className="cards-center">
              {convos.map((item, idx) => {
                return (
                  <Card
                    key={item.id}
                    {...item}
                    url={`lesson/${item.lessonId}/conversation/${item.order}`}
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

export default ConvoList;
