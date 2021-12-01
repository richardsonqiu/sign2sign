import React from "react";
import { useParams, Link } from "react-router-dom";
import { chapter1, chapter2, chapter3 } from "../data/lesson1.json";
import Card from "./Card";
import { materials } from "../data/materials.json";
import { useGlobalContext } from "../context";

const Lesson = () => {
  const { id } = useParams();
  const { user } = useGlobalContext();

  const lesson = materials.find(
    (materialItem) => materialItem.id === user.lessonProgress
  );
  return (
    <section className="container section">
      <h1 className="section-title">Lesson {id}</h1>
      <div className="cards-center">
        <Card />
      </div>
    </section>
  );
};

export default Lesson;
