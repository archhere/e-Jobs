import React from "react";
import "./Footer.scss";
import { 
  GRAPHICS_AND_DESIGN, VIDEO_AND_ANIMATION, LIFESTYLE, WRITING_AND_TRANSLATION,
  DIGITAL_MARKETING, MUSIC_AND_AUDIO, PROGRAMMING_AND_TECH, BUSINESS, AI_SERVICES,
  PHOTOGRAPHY, OPEN_BID
} from "../../utils/constants";
import {useNavigate } from "react-router-dom";

function Footer() {

  const navigate = useNavigate();

  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <span onClick={() => navigate(`/gigs?id=1&cat=${encodeURIComponent(GRAPHICS_AND_DESIGN)}`)}>{GRAPHICS_AND_DESIGN}</span>
            <span onClick={() => navigate(`/gigs/?id=2&cat=${encodeURIComponent(DIGITAL_MARKETING)}`)}>{DIGITAL_MARKETING}</span>
            <span onClick={() => navigate(`/gigs/?id=3&cat=${encodeURIComponent(WRITING_AND_TRANSLATION)}`)}>{WRITING_AND_TRANSLATION}</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span onClick={() => navigate(`/gigs/?id=4&cat=${encodeURIComponent(VIDEO_AND_ANIMATION)}`)}>{VIDEO_AND_ANIMATION}</span>
            <span onClick={() => navigate(`/gigs/?id=5&cat=${encodeURIComponent(MUSIC_AND_AUDIO)}`)}>{MUSIC_AND_AUDIO}</span>
            <span onClick={() => navigate(`/gigs/?id=6&cat=${encodeURIComponent(PROGRAMMING_AND_TECH)}`)}>{PROGRAMMING_AND_TECH}</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span onClick={() => navigate(`/gigs/?id=7&cat=${encodeURIComponent(AI_SERVICES)}`)}>{AI_SERVICES}</span>
            <span onClick={() => navigate(`/gigs/?id=8&cat=${encodeURIComponent(BUSINESS)}`)}>{BUSINESS}</span>
            <span onClick={() => navigate(`/gigs/?id=9&cat=${encodeURIComponent(LIFESTYLE)}`)}>{LIFESTYLE}</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span onClick={() => navigate(`/gigs/?id=10&cat=${encodeURIComponent(PHOTOGRAPHY)}`)}>Photography</span>
            <span onClick={() => navigate(`/gigs?id=11&status=${encodeURIComponent(OPEN_BID)}`)}>All</span>
          </div>
          <div className="item">
            <h2>Support</h2>
            <span>Help & Support</span>
            <span>Trust & Safety</span>
            <span>Posting on Ejobs</span>
            <span>Bidding on Ejobs</span>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>Ejobs</h2>
            <span>© Ejobs International Ltd. 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
