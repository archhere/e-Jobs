import React from "react";
import "./Bids.scss";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import { WIP } from "../../utils/constants";
import {useNavigate } from "react-router-dom";

function Bids({bids, gigId, bidCompleted}) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const bidAmountMap = {}; //updating into a map to keep track of bid price
    bids?.forEach(bid => bidAmountMap[bid?.bidder] = bid?.bidAmount)

    const combinedQueries = useQueries({
      queries: bids.map((bid) => ({
        queryKey: ['post', bid?.bidder],
        queryFn: () => 
          newRequest.get(`users/${bid?.bidder}`).then((res) => {
            return res.data;
          }),
      })),
      combine: (results) => {
        return {
          data: results.map((result) => result.data),
          pending: results.some((result) => result.isPending),
          error: results.some((result) => result.isError)
        }
      },
    })

    const mutation = useMutation({
      mutationFn: (body) => {
          return newRequest.put(`gigs/${gigId}`, body)
      },
      onSuccess: () => {
          queryClient.invalidateQueries(["myBidder"])
      },
      onError: (err) => {
        console.log(err)
      }
    })  
  
    const handleSubmit = (body) => {
        mutation.mutate(body);
    }

    return (
        <div className="myBids">
          {combinedQueries.pending ? "Loading" : combinedQueries.error ? "Something went wrong" : (
            <div className="container">
                <div className="title">
                <h2>Bids</h2>
                </div>
                <table>
                  <tr>
                      <th>Username</th>
                      <th>Skills</th>
                      <th>Bid Amount</th>
                      <th>Rating</th>
                      <th>Action</th>
                  </tr>
                  {combinedQueries.data.map(val => (
                    <tr key={val}>
                        <td onClick={() => navigate(`/profile/${val._id}`)}>{val.username}</td>
                        <td onClick={() => navigate(`/profile/${val._id}`)}>{val.skills.join(" , ")}</td>
                        <td onClick={() => navigate(`/profile/${val._id}`)}>{bidAmountMap[val._id]}</td>
                        <td onClick={() => navigate(`/profile/${val._id}`)}>{val.star}</td>
                        <td>
                        <button
                          className="delete" 
                          alt="" 
                          disabled = {bidCompleted}
                          onClick={() => handleSubmit({status: WIP, bidder: val?._id})}
                          >
                          Select
                        </button>
                        </td>
                    </tr>
                  ))}
                </table>
            </div>
           )}
      </div>
    )
}

export default Bids;
