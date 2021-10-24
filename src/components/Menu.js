import React from "react";
import LessonCard from "./LessonCard";
import { menu } from "../data";

const Menu = ({ id, title, img, progress, detail }) => {
  console.log({ img });
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <img src={img} />
      {/* <img src={require(`${img}`).default} alt="" /> */}
      <div className="card-footer">
        <h3>{progress}</h3>
        <p>{detail}</p>
      </div>
    </div>
  );
};

export default Menu;
