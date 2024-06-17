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
                <Link className="link" to="/orders">
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
              <Link to="/login" className="links">Sign in</Link>
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
            <Link className="link menuLink" to="/">
              {GRAPHICS_AND_DESIGN}
            </Link>
            <Link className="link menuLink" to="/">
              {VIDEO_AND_ANIMATION}
            </Link>
            <Link className="link menuLink" to="/">
              {WRITING_AND_TRANSLATION}
            </Link>
            <Link className="link menuLink" to="/">
              {AI_SERVICES}
            </Link>
            <Link className="link menuLink" to="/">
              {DIGITAL_MARKETING}
            </Link>
            <Link className="link menuLink" to="/">
              {MUSIC_AND_AUDIO}
            </Link>
            <Link className="link menuLink" to="/">
              {PROGRAMMING_AND_TECH}
            </Link>
            <Link className="link menuLink" to="/">
              {BUSINESS}
            </Link>
            <Link className="link menuLink" to="/">
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
