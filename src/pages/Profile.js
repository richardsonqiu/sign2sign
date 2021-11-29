import React from "react";
import { useGlobalContext } from "../context";

const Profile = () => {
  const { userid, username } = useGlobalContext();
  return (
    <section className="section profile-section">
      <h3 className="section-title">{username ? username : `My Profile`}</h3>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo sapiente
        facilis optio blanditiis nulla ad amet mollitia pariatur ab vero
        deleniti quia magni aspernatur nemo omnis, explicabo sequi doloremque
        doloribus!
      </p>
    </section>
  );
};

export default Profile;
