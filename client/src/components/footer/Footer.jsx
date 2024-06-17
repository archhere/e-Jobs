import React from "react";
import "./Footer.scss";
import { 
  GRAPHICS_AND_DESIGN, VIDEO_AND_ANIMATION, LIFESTYLE, WRITING_AND_TRANSLATION,
  DIGITAL_MARKETING, MUSIC_AND_AUDIO, PROGRAMMING_AND_TECH, BUSINESS, AI_SERVICES
} from "../../utils/constants";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <span>{GRAPHICS_AND_DESIGN}</span>
            <span>{DIGITAL_MARKETING}</span>
            <span>{WRITING_AND_TRANSLATION}</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span>{VIDEO_AND_ANIMATION}</span>
            <span>{MUSIC_AND_AUDIO}</span>
            <span>{PROGRAMMING_AND_TECH}</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span>{AI_SERVICES}</span>
            <span>{BUSINESS}</span>
            <span>{LIFESTYLE}</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span>Photography</span>
            <span>Sitemap</span>
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
