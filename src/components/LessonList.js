import React from "react";
import Card from "./Card";
import { materials } from "../data/materials.json";
import { useGlobalContext } from "../context";

const LessonList = () => {
  const { user } = useGlobalContext();

  const lesson = materials.find(
    (materialItem) => materialItem.id === user.lessonProgress
  );

  return (
    <section className="container section">
      <h1 className="section-title">Lessons</h1>
      <div className="cards-center">
        {materials.map((materialItem) => {
          return (
            <Card
              key={materialItem.id}
              {...materialItem}
              material="lesson"
              title={`Lesson ${materialItem.id}`}
              lesson={lesson.title}
            />
          );
        })}
      </div>
    </section>
  );
};

export default LessonList;
