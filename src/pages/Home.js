import React from "react";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import { lessons } from "../data";

function GetUserProgress() {
  const lessonId = 1;
  const vocabId = 2;
  const convoId = 3;
  return { lessonId, vocabId, convoId };
}

function GetLessonDetail(id) {
  const curLesson = lessons[id - 1];
  const lessonId = id;
  const lessonImg = curLesson.img;
  const lessonTitle = curLesson.title;
  return { lessonId, lessonImg, lessonTitle };
}

function GetVocabDetail(id) {
  const curLesson = lessons[id - 1];
  const vocabId = id;
  const vocabImg = curLesson.img;
  const vocabTitle = curLesson.title;
  return { vocabId, vocabImg, vocabTitle };
}

function GetConvoDetail(id) {
  const curLesson = lessons[id - 1];
  const convoId = id;
  const convoImg = curLesson.img;
  const convoTitle = curLesson.title;
  return { convoId, convoImg, convoTitle };
}

const Home = () => {
  const { userid, username } = useGlobalContext();
  const userProgress = GetUserProgress();
  const { lessonId, lessonImg, lessonTitle } = GetLessonDetail(
    userProgress.lessonId
  );
  const { vocabId, vocabImg, vocabTitle } = GetVocabDetail(
    userProgress.vocabId
  );
  const { convoId, convoImg, convoTitle } = GetConvoDetail(
    userProgress.convoId
  );

  return (
    <section className="container section">
      <h1 className="section-title">Welcome back, {username}</h1>
      <div className="cards-center">
        <Link to="/lesson">
          <div className="card">
            <h3 className="card-title">Lessons</h3>
            <img src={lessonImg} />
            <div className="card-footer">
              <h3>Lesson {lessonId}</h3>
              <p>{lessonTitle}</p>
            </div>
          </div>
        </Link>

        <Link to="/vocabulary">
          <div className="card">
            <h3 className="card-title">Vocabulary</h3>
            <img src={vocabImg} />
            <div className="card-footer">
              <h3>Lesson {vocabId}</h3>
              <p>{vocabTitle}</p>
            </div>
          </div>
        </Link>

        <Link to="/conversation">
          <div className="card">
            <h3 className="card-title">Conversation</h3>
            <img src={convoImg} />
            <div className="card-footer">
              <h3>Lesson {convoId}</h3>
              <p>{convoTitle}</p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Home;
