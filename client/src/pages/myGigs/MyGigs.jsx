import React from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery ({
      queryKey: ["myGigs"],
      queryFn: () => 
        newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => {
          return res.data;
        })
    });

  const mutation = useMutation({
      mutationFn: (id) => {
          return newRequest.delete(`/gigs/${id}`)
      },
      onSuccess: () => {
          queryClient.invalidateQueries(["myGigs"])
      }
  })  

  const handleDelete = (id) => {
    mutation.mutate(id);
  }

  const date = new Date()

  return (
    <div className="myGigs">
      {isLoading ? "Loading" : error ? "Something went wrong" : (
        <div className="container">
          <div className="title">
            <h1>Gigs</h1>
            {currentUser.isSeller && (
              <Link to="/add">
                <button>Add New job posting</button>
              </Link>
            )}
          </div>
          <table>
            <tr>
              <th>Title</th>
              <th>BidLastDate</th>
              <th>Total bids</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
            {data.map(gig => (
              <tr key={gig._id}>
                <td>{gig.title}</td>
                <td>{new Date(gig?.bidLastDate)?.toLocaleString("en-US", {timeZone: "PST"})}</td>
                <td>{gig.bids.length}</td>
                <td>{gig.cat}</td>
                <td>{gig.price}</td>
                <td>
                  <img 
                    className="delete" 
                    src="./img/delete.png" 
                    alt="" onClick={() => handleDelete(gig._id)}
                  />
                </td>
              </tr>
            ))
            }
          </table>
        </div>
      )}
    </div>
  );
}

export default MyGigs;
