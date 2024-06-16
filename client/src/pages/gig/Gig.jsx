import React from "react";
import "./Gig.scss";
import newRequest from "../../utils/newRequest";
import { useParams, Link } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";

function Gig() {

  const params = useParams();
  const queryClient = useQueryClient();
  const { id } = params;
  const { isLoading, error, data, refetch } = useQuery ({
    queryKey: ["gig"],
    queryFn: () => 
      newRequest.get(`gigs/single/${id}`).then((res) => {
        return res.data;
      })
  });

  const userId = data?.userId;

  const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery ({
    queryKey: ["user"],
    queryFn: () => 
      newRequest.get(`users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId  
  });
  const {country, desc} = dataUser || {country: "loading", desc: "loading"}; 
  
  const mutation = useMutation({
    mutationFn: () => {
        return newRequest.put(`gigs/${id}?isBid=true`, {userId: getCurrentUser()._id})
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["myBid"])
    },
    onError: (err) => {
      console.log(err)
    }
  })  

  const handleSubmit = () => {
      mutation.mutate();
  }

  const dayConverter = (dateToBid) => {
    const today = new Date().getTime();
    const timeinmilisec = dateToBid - today;
    return (timeinmilisec > 0) ? Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24)) : 0;
  }

  const fetchDaystoBid = () => {
    const dateToBid = new Date(data?.bidLastDate)?.getTime();
    return dayConverter(dateToBid);
  }

  const fetchDaystoComplete = () => {
    const dateToFinish = new Date(data?.projectDeliveryDate)?.getTime();
    return dayConverter(dateToFinish);
  }

  const daysToBid = fetchDaystoBid();

  return (
    <div className="gig">
      {isLoading ? "loading" : error ? "Something went wrong" : 
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Ejobs {">"} Graphics & Design {">"}</span>
          <h1>{data.title}</h1>
          {isLoadingUser ? "Loading" : errorUser ? "Something went wrong" : (
            <div className="seller">
              <div className="box">
              <h2>About the poster</h2>
                <div className="user">
                  <img
                    src={dataUser.img || "/img/noavatar.jpg"}
                    alt=""
                  />
                  <div className="info">
                    <span>{dataUser.username}</span>
                    <button>Contact Me</button>
                  </div>
                </div>
                <p>
                  {desc}
                </p>
              </div>
             </div>
          )}

            <div className="seller">
              <h2>Job Details</h2>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{country}</span>
                  </div>
                  <div className="item">
                    <span className="title">Last day to bid</span>
                    <span className="desc">{new Date(data?.bidLastDate)?.toLocaleString("en-US", {timeZone: "PST"})}</span>
                  </div>
                  <div className="item">
                    <span className="title">Payment</span>
                    <span className="desc">Fixed at ${data.price}</span>
                  </div>
                  <div className="item">
                    <span className="title">Expected date of completion</span>
                    <span className="desc">{new Date(data?.projectDeliveryDate)?.toLocaleString("en-US", {timeZone: "PST"})}</span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">English</span>
                  </div>
                  <div className="item">
                    <span className="title">Job Category</span>
                    <span className="desc">{data.cat}</span>
                  </div>
                  <div className="item">
                    <img src="/img/clock.png" alt="" />
                    <span>{daysToBid} Days Delivery</span>
                 </div>
                 <div className="item">
                    <span className="title">Job Status</span>
                    <span className="desc">{daysToBid > 0 ? "Open to bids" : fetchDaystoComplete() > 0 ? "Gig in progress" : "Completed"}</span>
                  </div>
                  <div className="item">
                    <span className="title">Bids Count</span>
                    <span className="desc">{data.bids.length}</span>
                  </div>
                </div>
                <hr />
                <p>
                  {data.desc}
                </p>
              </div>
            </div>
        
        </div>
        <div className="right">
          <p>
            Required skills
          </p>
          <div className="features">
            {data.features.map((feature) => (
              <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>{feature}</span>
            </div>
            ))}
          </div>
          {(
            userId !== getCurrentUser()._id !== userId) && 
            <button
              className="bid" 
              disabled = {data?.bids.includes(getCurrentUser()._id)}
              onClick={handleSubmit}
            > 
              Bid
            </button>
          }
        </div>
      </div>}
    </div>
  );
}

export default Gig;
