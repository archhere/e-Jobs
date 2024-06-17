import React, { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./Message.scss";
import newRequest from "../../utils/newRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  LOADING, ERROR_GENERIC
} from "../../utils/constants";


const Message = () => {

  const { id, userId } = useParams();
  const queryClient = useQueryClient();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: () => 
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      })
  });

  const { isLoading: isLoadingUser, error: errorUser, data: dataUser } = useQuery ({
    queryKey: ["user"],
    queryFn: () => 
      newRequest.get(`users/${userId}`).then((res) => {
        return res.data;
      }),
    enabled: !!userId  
  });

  const mutation = useMutation({
    mutationFn: (message) => {
        return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
        queryClient.invalidateQueries(["messages"])
    }
  })  

  useEffect(() => {
    refetch();
  }, [])

// const apply = ()=>{
//   refetch();
// }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value
    });
    e.target[0].value = "";
  }

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> > John Doe >
        </span>
        {(isLoading || isLoadingUser) ? LOADING : (error || errorUser) ? ERROR_GENERIC : (
          <div className="messages">
            {data.map((m) => (
              <div className={m.userId === currentUser._id ? "owner item" : "item"}  key={m._id}>
                {m.userId === currentUser._id ? currentUser?.username : dataUser?.username}
                <p>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="write a message" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
