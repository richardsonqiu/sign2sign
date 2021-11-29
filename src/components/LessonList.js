import React from "react";
import Lesson from "./Lesson";
import { menu } from "../data";

const LessonList = () => {
  return (
    <section className="container section">
      <h1 className="section-title">Lessons</h1>
      <div className="cards-center">
        {menu.map((item) => {
          return <Lesson key={item.id} {...item} />;
        })}
      </div>
    </section>
  );
};

export default LessonList;
