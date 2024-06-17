import React from "react";
import { Link } from "react-router-dom";
import "./Messages.scss";
import newRequest from "../../utils/newRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";

const Messages = () => {
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => 
      newRequest.get(`/conversations`).then((res) => {
        return res.data;
      })
  });

  const mutation = useMutation({
    mutationFn: (id) => {
        return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["conversations"])
    }
})  

  const handleRead = (id) => {
    mutation.mutate(id);
  }


  return (
    <div className="messages">
      {isLoading ? "Loading" : error ? "Something happened" : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <tr>
              <th>Conversation with</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
            {data.map((c)=> (
              <tr 
                className={
                  ((currentUser._id === c.user1 && !c.readByUser1) || (currentUser._id === c.user2 && !c.readByUser2)) &&
                  "active"
                }
                key={c.id}
              >
                <td>{currentUser._id === c.user1 ? c.user2 : c.user1}</td>
                <td>
                  <Link to={`/message/${c._id}/${currentUser._id === c.user1 ? c.user2 : c.user1}`} className="link">
                    {c?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>{
                    ((currentUser._id === c.user1 && !c.readByUser1) || (currentUser._id === c.user2 && !c.readByUser2)) &&
                    (<button onClick={() => handleRead(c.id)}>Mark as Read</button>)
                  }
                </td>
              </tr>
            ))}
            
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
