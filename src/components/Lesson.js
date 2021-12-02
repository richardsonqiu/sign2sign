import React from "react";
import { useParams, Link } from "react-router-dom";
import { lesson1 } from "../data/lesson1.json";
import Card from "./Card";
import { materials } from "../data/materials.json";
import { useGlobalContext } from "../context";

const Lesson = () => {
  const { id } = useParams(); // get lesson id from URL
  const { user } = useGlobalContext();

  const lesson = materials.find(
    (materialItem) => materialItem.id === user.lessonProgress
  );
  return (
    <section className="container section">
      <h1 className="section-title">
        Lesson {id}: {lesson.title}
      </h1>
      <div className="cards-center">
        {lesson1.map((item) => {
          return (
            <Card
              key={item.id}
              url={`lesson/${id}/${item.type}/${item.id}`}
              title={item.title}
              desc={item.type === "vocabulary" ? `n words` : lesson.title} // count # words in vocab API
              img={item.img}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Lesson;
