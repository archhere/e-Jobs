import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";

function Gig() {

  const params = useParams();
  const { id } = params;
  console.log(id);
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

  return (
    <div className="gig">
      {isLoading ? "loading" : error ? "Something went wrong" : 
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Liverr {">"} Graphics & Design {">"}</span>
          <h1>{data.title}</h1>
          {isLoadingUser ? "Loading" : errorUser ? "Something went wrong" : (
            <div className="user">
              <img
                className="pp"
                src={dataUser.img || "/img/noavatar.jpg"}
                alt=""
              />
              <span>{dataUser.username}</span>
              {!isNaN(data.totalStars/data.starNumber) && (
                <div className="stars">
                  {Array(Math.round(data.totalStars/data.starNumber))
                    .fill()
                    .map((item, idx) => (
                    <img src="/img/star.png" alt="" key={idx}/>
                  ))}
                  <span>{Math.round(data.totalStars/data.starNumber)}</span>
                </div>
              )}
            </div>
          )}
          <Slider slidesToShow={1} arrowsScroll={1} className="slider">
            {data.images.map((img) => (
              <img key={img} src={img} alt = ""/>
            ))}
          </Slider>
          <h2>About This Gig</h2>
          <p>
            {data.desc}
          </p>
          {isLoadingUser ? "loading" : errorUser ? "Something happened" : (
            <div className="seller">
              <h2>About The Seller</h2>
              <div className="user">
                <img
                  src={dataUser.img || "/img/noavatar.jpg"}
                  alt=""
                />
                <div className="info">
                  <span>{dataUser.username}</span>
                  {!isNaN(data.totalStars/data.starNumber) && (
                    <div className="stars">
                      {Array(Math.round(data.totalStars/data.starNumber))
                        .fill()
                        .map((item,idx) => (
                          <img src="/img/star.png" alt=""  kay={idx}/>
                      ))}
                      <span>{Math.round(data.totalStars/data.starNumber)}</span>
                    </div>
                  )}
                  <button>Contact Me</button>
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{country}</span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    <span className="desc">Aug 2022</span>
                  </div>
                  <div className="item">
                    <span className="title">Avg. response time</span>
                    <span className="desc">4 hours</span>
                  </div>
                  <div className="item">
                    <span className="title">Last delivery</span>
                    <span className="desc">1 day</span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">English</span>
                  </div>
                </div>
                <hr />
                <p>
                  {desc}
                </p>
              </div>
            </div>
          )}
          <Reviews gigId={id}/>
        </div>
        <div className="right">
          <div className="price">
            <h3>{data.shortTitle}</h3>
            <h2>$ {data.price}</h2>
          </div>
          <p>
            {data.shortDesc}
          </p>
          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>{Date.deliveryDate} Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>{Date.revisionNumber} Revisions</span>
            </div>
          </div>
          <div className="features">
            {data.features.map((feature) => (
              <div className="item">
              <img src="/img/greencheck.png" alt="" />
              <span>{feature}</span>
            </div>
            ))}
          </div>
          <Link to={`/pay/${id}`}>
            <button>Continue</button>
          </Link>
        </div>
      </div>}
    </div>
  );
}

export default Gig;
