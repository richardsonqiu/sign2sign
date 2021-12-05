import React from "react";
import { useGlobalContext } from "../context";
import Loading from "../components/Loading";
import Card from "../components/Card";
import AllCard from "../components/AllCard";

const Home = () => {
  const {
    user,
    lessonProgress,
    vocabProgress,
    convoProgress,
    loading,
    lessonsData,
  } = useGlobalContext();

  if (loading) {
    <Loading />;
  }

  const lesson = lessonsData.find((item) => item.id === lessonProgress.id);
  const vocab = lessonsData.find((item) => item.id === vocabProgress.lessonId);
  const convo = lessonsData.find((item) => item.id === convoProgress.lessonId);

  return (
    <section className="container section">
      <h1 className="section-title">Hi {user.username}</h1>
      <div className="cards-center">
        <div className="section-material">
          <Card
            url={`lesson/${lessonProgress.id}`}
            progress={lessonProgress.id}
            title="My current lesson"
            desc={lesson.title}
            img={lesson.imgSrc}
            isHome="home"
          />
          <AllCard url="lessons" />
        </div>

        <div className="section-material">
          <Card
            url={`lesson/${vocabProgress.lessonId}/vocabulary/${vocabProgress.id}`}
            progress={vocabProgress.lessonId}
            title="My current vocabulary"
            desc={vocab.title}
            img={vocab.imgSrc}
            isHome="home"
          />
          <AllCard url="vocabularies" />
        </div>

        <div className="section-material">
          <Card
            url={`lesson/${convoProgress.lessonId}/conversation/${convoProgress.id}`}
            progress={convoProgress.lessonId}
            title="My current conversation"
            desc={convo.title}
            img={convo.imgSrc}
            isHome="home"
          />
          <AllCard url="conversations" />
        </div>
      </div>
    </section>
  );
};

export default Home;
