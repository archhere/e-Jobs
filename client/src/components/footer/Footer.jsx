import React from "react";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Categories</h2>
            <span>Graphics & Design</span>
            <span>Digital Marketing</span>
            <span>Writing & Translation</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span>Video & Animation</span>
            <span>Music & Audio</span>
            <span>Programming & Tech</span>
          </div>
          <div className="item">
            <h2>Categories</h2>
            <span>Data</span>
            <span>Business</span>
            <span>Lifestyle</span>
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
            <span>Selling on Ejobs</span>
            <span>Buying on Ejobs</span>
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
