import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import newRequest from "../../utils/newRequest";
import { useQuery } from "@tanstack/react-query";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery ({
    queryKey: ["myGigs"],
    queryFn: () => 
      newRequest.get(`/gigs?bidder=${currentUser._id}`).then((res) => {
        return res.data;
      })
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;
    try {
      const res = await newRequest.get(`conversations/single/${id}`)
      navigate(`/message/${res.data.id}`);
    } catch(error) {
      if(error.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {to: currentUser.seller ? buyerId : sellerId});
        navigate(`/message/${res.data.id}`);
      }
    }
  }

  return (
    <div className="myGigs">
      {isLoading ? "Loading" : error ? "Something went wrong" : (
        <div className="container">
          <div className="title">
            <h1>My Bids</h1>
          </div>
          <table>
            <tr>
              <th>Title</th>
              <th>BidLastDate</th>
              <th>ProjectLastDate</th>
              <th>Status</th>
              <th>Total bids</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
            {data.map(gig => (
              <tr key={gig._id}>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{gig.title}</td>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{new Date(gig?.bidLastDate)?.toLocaleString("en-US", {timeZone: "PST"})}</td>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{new Date(gig?.projectDeliveryDate)?.toLocaleString("en-US", {timeZone: "PST"})}</td>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{gig.status}</td>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{gig.bids.length}</td>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{gig.cat}</td>
                <td onClick={() => navigate(`/gig/${gig._id}`)}>{gig.price}</td>
                {gig.bidder === "" ? <td>
                  <img 
                    className="delete" 
                    src="./img/delete.png" 
                    disabled = {gig.bidder === ""}
                    alt="" onClick={() => handleDelete(gig._id)}
                  />
                </td> : 
                <td>
                  You cannot withdraw this bid
                </td>}
              </tr>
            ))
            }
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
