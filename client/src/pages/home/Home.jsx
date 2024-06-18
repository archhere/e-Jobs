import React from "react";
import "./Home.scss";
import Featured from "../../components/featured/Featured";
import GigCard from "../../components/gigCard/GigCard";
import { LOADING, ERROR_GENERIC
} from "../../utils/constants";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

function Home() {

  const { isLoading, error, data } = useQuery({
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
