import React from "react";
import { useGlobalContext } from "../context";

const Profile = () => {
  const { user, lessonProgress, vocabProgress, convoProgress } =
    useGlobalContext();
  console.log(user);
  console.log(lessonProgress);
  console.log(vocabProgress);
  return (
    <section className="section profile-section">
      <h3 className="section-title">{user ? user.username : `My Profile`}</h3>
      <h4>Achievements</h4>
    </section>
  );
};

export default Profile;
