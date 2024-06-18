import React from "react";
import "./Home.scss";
import Slide from "../../components/slide/Slide";
import CatCard from "../../components/catCard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";
import Featured from "../../components/featured/Featured";
import { cards, projects } from "../../data";
import GigCard from "../../components/gigCard/GigCard";
import { useNavigate } from "react-router-dom";
import { GRAPHICS_AND_DESIGN, DIGITAL_MARKETING, WRITING_AND_TRANSLATION, 
  VIDEO_AND_ANIMATION, MUSIC_AND_AUDIO, PROGRAMMING_AND_TECH, BUSINESS,
  LIFESTYLE, AI_SERVICES, PHOTOGRAPHY, LOADING, ERROR_GENERIC
} from "../../utils/constants";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

function Home() {

  const navigate = useNavigate();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () => 
      newRequest.get("/gigs?sort=totalBids").then((res) => {
        return res.data;
      })
  });

  return (
    <div className="home">
      <Featured />
      <div className="gigContainer">
        <h1 className="topBidHeader">Explore our active postings</h1>
        <div id="cards">
            {isLoading ? LOADING : error ? ERROR_GENERIC : data.map((gig) => (
              <GigCard key={gig._id} item={gig} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
