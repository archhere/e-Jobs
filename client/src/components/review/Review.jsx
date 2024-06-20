import React from "react";
import "./Review.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Review = ({review}) => {
    const { desc, star, reviewerId, revieweeId } = review;
    const { isLoading, error, data } = useQuery ({
        queryKey: [review.reviewerId],
        queryFn: () => 
          newRequest.get(`/users/${reviewerId}`).then((res) => {
            return res.data;
          })
      });

    
    return (
        <div className="review">
            {isLoading ? "Loading" : error ? "Something went wrong" : (
                <div className="user">
                    <img
                    className="pp"
                    src={data.img || "/img/noavatar.jpg"}
                    alt=""
                    />
                    <div className="info">
                    <span>{data.username}</span>
                    <div className="country">
                        <span>{data.country}</span>
                    </div>
                    </div>
                </div>
            )}
            <div className="stars">
                {Array(review.star).fill().map((item,i) => (
                    <img id ="starimg" src="/img/star.png" alt="" key={i} />
                ))}
                <span>{star}</span>
            </div>
            <p>
                {desc}
            </p>
        </div>
    )
}

export default Review;