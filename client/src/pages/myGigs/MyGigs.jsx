import React from "react";
import { Link, useNavigate  } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      {isLoading ? 
        <ClipLoader
          color={"#1dbf73"}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> : error ? "Something went wrong" : (
        <div className="container">
          <div className="title">
            <h1>My job postings</h1>
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
                  <img 
                    className="delete" 
                    src="./img/coin.png"
                    onClick={() => navigate(`/pay/${gig._id}`)}
                    alt=""
                  />
                </td>}
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
