import React from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
import {
  vocabularies as lessonVocabs,
  conversations as lessonConvos,
} from "../data/lesson.json";
import { useGlobalContext } from "../context";

const Lesson = () => {
  const { lessonId } = useParams(); // get lesson id from URL
  const { user, lessonProgress, vocabProgress, convoProgress, lessonsData } =
    useGlobalContext();

  const lesson = lessonsData.find((item) => item.id == lessonId);

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
