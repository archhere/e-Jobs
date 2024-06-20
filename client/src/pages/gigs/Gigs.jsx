import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";
import { 
  LOADING, ERROR_GENERIC
} from "../../utils/constants";


function Gigs() {
  const [sort, setSort] = useState("bid");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
 

  const {search} = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(); // Using this to refresh page without unmount
  const id = searchParams.get("id");
  const params =  new URLSearchParams(search)
  const category = params.get("cat");
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs"],
    queryFn: () => 
      newRequest.get(`/gigs${search || "?"}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`).then((res) => {
        return res.data;
      })
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [id], [sort])

  const apply = ()=>{
    refetch();
  }

  return (
    <div className="gigs">
      <div className="container">
        <h1>Postings in {category}</h1>
        <p>
          Find the latest and hottest jobs in Ejobs
        </p>
        <div className="menu">
          <div className="left">
            <span>Payment in $</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "bid" ? "Most Active" : "Newest"}
            </span>
            <img src="/img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "bid" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("totalBids")}>Most Active</span>
                  )}
                  <span onClick={() => reSort("totalBids")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading ? LOADING : error ? ERROR_GENERIC : data.map((gig) => (
            <GigCard key={gig._id} item={gig} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
