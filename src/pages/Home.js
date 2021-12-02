import React from "react";
// import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import Loading from "../components/Loading";
import Card from "../components/Card";
import AllCard from "../components/AllCard";
import { materials } from "../data/materials.json";

const Home = () => {
  const { user, loading } = useGlobalContext();
  if (loading) {
    <Loading />;
  }

  const lesson = materials.find(
    (materialItem) => materialItem.id === user.lessonProgress
  );
  console.log(lesson);
  const vocab = materials.find(
    (materialItem) => materialItem.id === user.vocabProgress
  );
  const convo = materials.find(
    (materialItem) => materialItem.id === user.convoProgress
  );

  return (
    <section className="container section">
      <h1 className="section-title">Hi {user.username}</h1>
      <div className="cards-center">
        <div className="section-material">
          <Card
            url={`lesson/${lesson.id}`}
            id={lesson.id}
            title="Lesson"
            desc={lesson.title}
            img={lesson.img}
            isHome="home"
          />
          <AllCard url="lessons" />
        </div>

        <div className="section-material">
          <Card
            url={`lesson/${lesson.id}/vocabulary/${vocab.id}`}
            id={vocab.id}
            title="Vocabulary"
            desc={vocab.title}
            img={vocab.img}
            isHome="home"
          />
          <AllCard url="vocabularies" />
        </div>

        <div className="section-material">
          <Card
            url={`lesson/${lesson.id}/conversation`}
            id={convo.id}
            title="Conversation"
            desc={convo.title}
            img={convo.img}
            isHome="home"
          />
          <AllCard url="conversations" />
        </div>
      </div>
    </section>
  );
};

export default Home;
