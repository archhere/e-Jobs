import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import { 
  LOADING, ERROR_GENERIC
} from "../../utils/constants";

const GigCard = ({ item }) => {
const { isLoading, error, data } = useQuery({
  queryKey: ["gigUser"],
  queryFn: () => 
    newRequest.get(`/users/${item.userId}`).then((res) => {
      return res.data;
    })
});

const stars = item.totalStars / item.starNumber;
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt="" />
        <div className="info">
          {isLoading ? (
            LOADING
          ) : error ? (
            ERROR_GENERIC
          ) : (
          <div className="user">
            <img src={data.img || "/img/noavatar.jpg"} alt="" />
            <span>{data.username}</span>
          </div>
          )}
          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{!isNaN(stars) && Math.round(stars)}</span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="price">
            <span>EARN UPTO</span>
            <h2>
              $ {item.price}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
