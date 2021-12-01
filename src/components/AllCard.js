import React from "react";
import { Link } from "react-router-dom";

const AllCard = ({ material }) => {
  return (
    <>
      <Link to={`/${material}`}>
        <div className="card">
          <h3 className="card-title">See all {material}</h3>
        </div>
      </Link>
    </>
  );
};

export default AllCard;
