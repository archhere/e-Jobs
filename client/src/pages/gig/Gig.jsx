import React from "react";
import "./Gig.scss";
import newRequest from "../../utils/newRequest";
import { useParams, Link } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";
import Bids from "../../components/bids/Bids";
import { 
  LOADING, ERROR_GENERIC, OPEN_BID, WIP, READY_FOR_REVIEW, APPROVED, COMPLETED, STEPPER, PAID
} from "../../utils/constants";
import Stepper from 'react-stepper-horizontal';
import { useNavigate } from "react-router-dom";


function Gig() {

  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = params;
  const { isLoading, error, data, refetch } = useQuery ({
    queryKey: ["gig"],
    queryFn: () => 
      newRequest.get(`gigs/single/${id}`).then((res) => {
        return res.data;
      })
  });

  const steps = [
    { title: OPEN_BID },
    { title: WIP },
    { title: READY_FOR_REVIEW },
    { title: APPROVED },
    { title: PAID },
    { title: COMPLETED },
  ];
  

  const userId = data?.userId;
  const status = data?.status;
  console.log(status)
  const isPoster = userId === getCurrentUser()._id;
  const isBidder = data?.bidder === getCurrentUser()._id;
  const activeStep = STEPPER[status];

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
    mutationFn: (payload) => {
        const { isBid, body } = payload;
        return newRequest.put(`gigs/${id}?isBid=${isBid}`, body)
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["myBid", activeStep])
    },
    onError: (err) => {
      console.log(err)
    }
  })  

  const handleSubmit = (isBid, body) => {
    mutation.mutate({isBid, body});
    if (body?.status === APPROVED) {
      navigate(`/pay/${id}`)
    }
    
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
  const daysToComplete = fetchDaystoComplete();

  return (
    <div className="gig">
      {isLoading ? LOADING : error ? ERROR_GENERIC : 
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Ejobs {">"} Graphics & Design {">"}</span>
          <h1>{data.title}</h1>
          <div className="stepper">
                  <Stepper
                    steps={steps}
                    activeStep={activeStep}/>
                </div>
          {isLoadingUser ? LOADING : errorUser ? ERROR_GENERIC : (
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
                    <span>{(daysToBid > 0  && data.bidder === "") ? `${daysToBid} days to bid` : daysToComplete > 0 ? `${daysToComplete} days to complete` : "Completed"}</span>
                 </div>
                 <div className="item">
                    <span className="title">Job Status</span>
                    <span className="desc">{(daysToBid > 0  && data.bidder === "")? "Open to bids" : daysToComplete > 0 ? "Gig in progress" : "Completed"}</span>
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
        <div>
          {isPoster && <Bids bids={data?.bids} gigId={id} bidCompleted={data?.bidder !== ""}/>}
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
        </div>
        <div className="new">
          {!isPoster && status === OPEN_BID && (
            <button
              className="bid" 
              disabled = {data?.bids.includes(getCurrentUser()._id)}
              onClick={() => handleSubmit(true, {})}
            > 
              Bid
            </button>
          )}
          {isBidder && status === WIP && (
            <div> 
              <p>
                Please click on the below button to update current job status
              </p>
              <button
                className="bid" 
                onClick={() => handleSubmit(false, {status: READY_FOR_REVIEW})}
              > 
                {READY_FOR_REVIEW}
              </button>
            </div>
          )}
          {isPoster && status === READY_FOR_REVIEW && (
            <button
              className="bid" 
              onClick={() => handleSubmit(false, {status: APPROVED})}
            > 
              APPROVE
            </button>
          )}
          {isPoster && status === APPROVED && (
            <button
              className="bid" 
              onClick={() => navigate(`/pay/${id}`)}
            > 
              PAY NOW
            </button>
          )}
          {isBidder && status === PAID && (
            <button
              className="bid" 
              onClick={() => handleSubmit(false, {status: COMPLETED})}
            > 
              COMPLETE TRANSACTION
            </button>
          )}
        </div>
      </div>}
    </div>
  );
}

export default Gig;
