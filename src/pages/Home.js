import React from "react";
import { useGlobalContext } from "../context";
import Loading from "../components/Loading";
import Card from "../components/Card";
import AllCard from "../components/AllCard";
import { lessons } from "../data/lessons.json";

const Home = () => {
  const { user, lessonProgress, vocabProgress, convoProgress, loading } =
    useGlobalContext();

  if (loading) {
    <Loading />;
  }

  const lesson = lessons.find((item) => item.id === lessonProgress.id);
  const vocab = lessons.find((item) => item.id === vocabProgress.lessonId);
  const convo = lessons.find((item) => item.id === convoProgress.lessonId);

  return (
    <section className="container section">
      <h1 className="section-title">Hi {user.username}</h1>
      <div className="cards-center">
        <div className="section-material">
          <Card
            url={`lesson/${lessonProgress.id}`}
            progress={lessonProgress.id}
            title="Lesson"
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
            title="Vocabulary"
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
            title="Conversation"
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
