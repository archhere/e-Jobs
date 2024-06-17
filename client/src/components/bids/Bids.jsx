import React from "react";
import "./Bids.scss";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import { WIP } from "../../utils/constants";

function Bids({bids, gigId, bidCompleted}) {

  const queryClient = useQueryClient();

    // const { isLoading, error, data } = useQuery ({
    //     queryKey: ["user"],
    //     queryFn: () => 
    //       newRequest.get(`users/${bid}`).then((res) => {
    //         return res.data;
    //       }),
    //     enabled: !!userId  
    // });

    const combinedQueries = useQueries({
      queries: bids.map((bid) => ({
        queryKey: ['post', bid],
        queryFn: () => 
          newRequest.get(`users/${bid}`).then((res) => {
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
                      <th>Rating</th>
                      <th>Action</th>
                  </tr>
                  {combinedQueries.data.map(val => (
                    <tr key={val}>
                        <td>{val.username}</td>
                        <td>{val.skills.join(" , ")}</td>
                        <td>{val.star}</td>
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
