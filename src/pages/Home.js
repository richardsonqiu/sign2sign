import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import Loading from "../components/Loading";
import Card from "../components/Card";
import { materials } from "../data/materials.json";

const Home = () => {
  const { user, loading } = useGlobalContext();
  if (loading) {
    <Loading />;
  }

  const lesson = materials.find(
    (materialItem) => materialItem.id === user.lessonProgress
  );
  const vocab = materials.find(
    (materialItem) => materialItem.id === user.vocabProgress
  );
  const convo = materials.find(
    (materialItem) => materialItem.id === user.convoProgress
  );

  return (
    <section className="container section">
      <h1 className="section-title">Welcome back, {user.username}</h1>
      <div className="cards-center">
        <Card
          material="/lesson"
          id={lesson.id}
          chapter={`Lesson ${lesson.id}`}
          title={lesson.title}
          img={lesson.img}
        />
        <Card
          material="/vocabulary"
          id={vocab.id}
          chapter={`Vocabulary ${vocab.id}`}
          title={vocab.title}
          img={vocab.img}
        />
        <Card
          material="/conversation"
          id={convo.id}
          chapter={`Conversation`}
          title={convo.title}
          img={convo.img}
        />
      </div>
    </section>
  );
};

export default Home;
