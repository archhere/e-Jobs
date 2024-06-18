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
  queryKey: ["gigUser", item.userId],
  queryFn: () => 
    newRequest.get(`/users/${item.userId}`).then((res) => {
      return res.data;
    })
});

const stars = data?.totalStars / data?.star;
console.log(item?.desc.substring(150))
  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
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
          <h3>{item.title}</h3>
          <p>{item?.desc.substring(0,200)}...</p>
          <div className="star">
            <img id ="starimg" src="/img/star.png" alt="" />
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
          <div className="price">
            <span>BIDS</span>
            <h2>
              {item.totalBids}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
