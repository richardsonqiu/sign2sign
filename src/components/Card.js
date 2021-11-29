import React from "react";
import { menu } from "../data";

const Card = ({ id, title, img, progress, detail }) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <img src={img} />
      <div className="card-footer">
        <h3>{progress}</h3>
        <p>{detail}</p>
      </div>
    </div>
  );
};

export default Card;
