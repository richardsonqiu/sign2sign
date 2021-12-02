import React from "react";
import { useParams, Link } from "react-router-dom";
import Card from "./Card";
import { lessons } from "../data/lessons.json";
import {
  vocabularies as lessonVocabs,
  conversations as lessonConvos,
} from "../data/lesson.json";
import { useGlobalContext } from "../context";

const Lesson = () => {
  const { lessonId } = useParams(); // get lesson id from URL
  const { user, lessonProgress, vocabProgress, convoProgress } =
    useGlobalContext();

  const lesson = lessons.find((item) => item.id == lessonId);

  return (
    <section className="container section">
      <h1 className="section-title">
        Lesson {lessonId}: {lesson.title}
      </h1>
      <div className="cards-center">
        {lessonVocabs.map((item) => {
          return (
            <Card
              key={item.id}
              {...item}
              url={`lesson/${lessonId}/vocabulary/${item.id}`}
              title={item.title}
              img={item.imgSrc}
              desc={item.desc} // count # words in vocab API
            />
          );
        })}

        {lessonConvos.map((item) => {
          return (
            <Card
              key={item.id}
              url={`lesson/${lessonId}/conversation/${item.id}`}
              title="Conversation"
              img={item.imgSrc}
              desc={item.title}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Lesson;
