import React from "react";
import { Link } from "react-router-dom";

const Card = ({ id, material, chapter, img, title }) => {
  return (
    <>
      <Link to={`${material}/${id}`}>
        <div className="card">
          <h3 className="card-title">{chapter}</h3>
          <img src={img} />
          <div className="card-footer">
            <p>{title}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;
