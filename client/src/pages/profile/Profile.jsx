import getCurrentUser from "../../utils/getCurrentUser";
import "./Profile.scss";
import React  from "react";
import { useParams, useNavigate } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";
import { useQuery  } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";


function Profile() {
    const params = useParams();
    const { userId } = params;
    const selfProfile = userId === getCurrentUser()._id;
    let isLoadingUser = false;
    let errorUser = false;
    let user;

    const navigate = useNavigate();

    if (selfProfile) {
       user = getCurrentUser();
    } else {
        ({ isLoading: isLoadingUser, error: errorUser, data: user } = useQuery ({
            queryKey: ["user", userId],
            queryFn: () => 
                newRequest.get(`users/${userId}`).then((res) => {
                return res.data;
                }),
            enabled: !!userId  
        }));
    }

    const contactMe = () => {
        return (
            <div className="info">
                <span>{user.username}</span>
                <button onClick={handleContact}>Contact Me</button>
            </div> 
        )
    }

    const handleContact = async () => {
        const contactFrom = getCurrentUser()?._id;
        const contactTo = userId;
        try {
          const res = await newRequest.get(`conversations/single/${contactFrom}/${contactTo}`);
          navigate(`/message/${res?.data?._id}/${user?._id}`);
        } catch(error) {
          if(error?.response?.status === 404) {
            const res = await newRequest.post(`/conversations/`, {user1: contactFrom, user2: contactTo});
            navigate(`/message/${res?.data?._id}/${user?._id}`);
          }
        }
      }

    return (
        <div className="profile">
            {isLoadingUser ? "Loading" : errorUser ? "Something went wrong" : (
                <div className="container">
                    <div className="left">
                        <div className="seller">
                            <div className="box">
                                <h2>Profile Details</h2>
                                <div className="user">
                                    <img
                                        src={user.img || "/img/noavatar.jpg"}
                                        alt=""
                                    />
                                   {selfProfile  ? "" :  contactMe()}
                                </div>
                                <div className="features">
                                    {user.skills.map((feature) => (
                                    <div className="item">
                                        <img src="/img/greencheck.png" alt="" />
                                        <span>{feature}</span>
                                    </div>
                                    ))}
                                </div>
                                <hr />
                                <p>
                                    {user.desc}
                                </p>
                            </div>
                            {<Reviews userId={userId} selfProfile={selfProfile}/>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile;