import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./Featured.scss";

function Featured() {
  const [input, setInput] = useState();

  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/gigs?search=${input}`);
  }

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Search for the most lucrative jobs
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder='Try "building a website"' onChange={(e) => setInput(e.target.value)}/>
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Web Design</button>
            <button>WordPress</button>
            <button>Logo Design</button>
            <button>AI Services</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featured;