import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import newRequest from "../../utils/newRequest";
import { 
  GRAPHICS_AND_DESIGN, VIDEO_AND_ANIMATION, LIFESTYLE, WRITING_AND_TRANSLATION,
  DIGITAL_MARKETING, MUSIC_AND_AUDIO, PROGRAMMING_AND_TECH, BUSINESS, AI_SERVICES
} from "../../utils/constants";
import getCurrentUser from "../../utils/getCurrentUser";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/")
    } catch (err) {

    }
  }

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Ejobs</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <span>Ejobs Business</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && <span>Become a Job Poster</span>}
          {currentUser ? (
            <div className="user" onClick={()=>setOpen(!open)}>
              <img
                src={currentUser.img || "../../../public/img/noavatar.jpg"}
                alt=""
              />
              <span>{currentUser?.username}</span>
              {open && <div className="options">
                {currentUser.isSeller && (
                  <>
                    <Link className="link" to="/mygigs">
                      My Job Postings
                    </Link>
                    <Link className="link" to="/add">
                      Add job posting
                    </Link>
                  </>
                )}
                <Link className="link" to={`/profile/${getCurrentUser()._id}`}>
                  My Profile
                </Link>
                <Link className="link" to="/MyAcceptedBids">
                  My Bids
                </Link>
                <Link className="link" to="/messages">
                  Messages
                </Link>
                <Link className="link" onClick={handleLogout}>
                  Logout
                </Link>
              </div>}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Sign in</Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
          <Link className="link menuLink" to={`/gigs?`}>
              All Categories
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(GRAPHICS_AND_DESIGN)}`}>
              {GRAPHICS_AND_DESIGN}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(VIDEO_AND_ANIMATION)}`}>
              {VIDEO_AND_ANIMATION}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(WRITING_AND_TRANSLATION)}`}>
              {WRITING_AND_TRANSLATION}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(AI_SERVICES)}`}>
              {AI_SERVICES}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(DIGITAL_MARKETING)}`}>
              {DIGITAL_MARKETING}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(MUSIC_AND_AUDIO)}`}>
              {MUSIC_AND_AUDIO}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(PROGRAMMING_AND_TECH)}`}>
              {PROGRAMMING_AND_TECH}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(BUSINESS)}`}>
              {BUSINESS}
            </Link>
            <Link className="link menuLink" to={`/gigs/?cat=${encodeURIComponent(LIFESTYLE)}`}>
              {LIFESTYLE}
            </Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;
