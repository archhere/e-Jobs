import React from "react";
import "./Reviews.scss";
import Review from "../review/Review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Reviews = ({userId, selfProfile}) => {
    
    const queryClient = useQueryClient();
    const { isLoading, error, data } = useQuery ({
        queryKey: ["reviews"],
        queryFn: () => 
          newRequest.get(`/reviews/${userId}`).then((res) => {
            return res.data;
          })
    });
    const mutation = useMutation({
        mutationFn: (review) => {
            return newRequest.post('reviews', review)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["reviews"])
        }
    })  

    const handleSubmit = (e) => {
        e.preventDefault();
        const desc = e.target[0].value;
        const star = e.target[1].value;
        mutation.mutate({userId, desc, star});
    }  

    return (
        <div className="reviews">
            <h2>Reviews</h2>
            {isLoading ? "loading" : error ? "Something happened" : data.map((review) => <Review key={review._id} review={review} />)}
            {(!selfProfile) &&  <div className="add">
                <h3>Add a new review</h3>
                <form action="" className="addForm" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Write your opinion" />
                    <select name="" id=""> 
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                    <button>Send</button>
                </form>
            </div>}
        </div>
    )}

export default Reviews;