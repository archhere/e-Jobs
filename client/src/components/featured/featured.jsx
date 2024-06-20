import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./Featured.scss";
import { 
    GRAPHICS_AND_DESIGN, WRITING_AND_TRANSLATION,
    PROGRAMMING_AND_TECH,AI_SERVICES
  } from "../../utils/constants";

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
            <button onClick={() => navigate(`/gigs?id=6&cat=${encodeURIComponent(PROGRAMMING_AND_TECH)}`)}>Web Development</button>
            <button onClick={() => navigate(`/gigs?id=3&cat=${encodeURIComponent(WRITING_AND_TRANSLATION)}`)}>WordPress</button>
            <button onClick={() => navigate(`/gigs?id=1&cat=${encodeURIComponent(GRAPHICS_AND_DESIGN)}`)}>Logo Design</button>
            <button onClick={() => navigate(`/gigs?id=7&cat=${encodeURIComponent(AI_SERVICES)}`)}>AI Services</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featured;