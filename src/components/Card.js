import React from "react";
import { Link } from "react-router-dom";

const Card = ({ id, material, title, img, lesson, isHome }) => {
  return (
    <>
      <Link to={`/${material}/${id}`}>
        <div className="card">
          <h3 className="card-title">{title}</h3>
          <img src={img} alt={material} />
          <div className="card-footer">
            {isHome ? (
              <p>
                <strong>{`Lesson ${id}`}</strong>
              </p>
            ) : (
              ``
            )}
            <p>{lesson}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Card;
