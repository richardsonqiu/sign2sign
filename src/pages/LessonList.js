import React from "react";
import Card from "../components/Card";
import { useGlobalContext } from "../context";

const LessonList = () => {
  const { user, lessonProgress, lessonsData } = useGlobalContext();

  const lesson = lessonsData.find((item) => item.id === lessonProgress.id);

  return (
    <section className="container section">
      <h1 className="section-title">Lessons</h1>
      <div className="cards-center">
        {lessonsData.map((item) => {
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