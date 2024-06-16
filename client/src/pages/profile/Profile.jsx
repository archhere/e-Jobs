import getCurrentUser from "../../utils/getCurrentUser";
import "./Profile.scss";
import React  from "react";
import { useParams } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";
import { useMutation, useQuery , useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";


function Profile() {
    const params = useParams();
    const { id, userId } = params;
    const selfProfile = userId === getCurrentUser()._id;
    let isLoadingUser = false;
    let errorUser = false;
    let user;

    if (selfProfile) {
       user = getCurrentUser();
    } else {
        ({ isLoading: isLoadingUser, error: errorUser, data: user } = useQuery ({
            queryKey: ["user"],
            queryFn: () => 
                newRequest.get(`users/${userId}`).then((res) => {
                return res.data;
                }),
            enabled: !!userId  
        }));
    }

    const editProfile = () => {
        return (
            <div className="info">
                <span>{user.username}</span>
                <button>Edit Profile</button>
            </div> 
        )
    }

    const contactMe = () => {
        return (
            <div className="info">
                <span>{user.username}</span>
                <button>Contact Me</button>
            </div> 
        )
    }

    return (
        <div className="gig">
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
                                   {selfProfile ? editProfile() : contactMe()}
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
                            {!selfProfile && <Reviews gigId={id}/>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile;