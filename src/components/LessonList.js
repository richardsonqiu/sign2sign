import React from "react";
import Card from "./Card";
import { lessons } from "../data/lessons.json";
import { useGlobalContext } from "../context";

const LessonList = () => {
  const { user, lessonProgress } = useGlobalContext();

  const lesson = lessons.find((item) => item.id === lessonProgress.id);
  // console.log(lessons);
  // console.log(lessonProgress.id);

  return (
    <section className="container section">
      <h1 className="section-title">Lessons</h1>
      <div className="cards-center">
        {lessons.map((item) => {
          return (
            <Card
              key={item.id}
              {...item}
              url={`lesson/${item.id}`}
              title={`Lesson ${item.id}`}
              img={item.imgSrc}
              desc={item.title}
            />
          );
        })}
      </div>
    </section>
  );
};

export default LessonList;
