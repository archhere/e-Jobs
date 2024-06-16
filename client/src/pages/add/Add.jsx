import React, { useReducer, useState } from "react";
import "./Add.scss";
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducer";
import { CHANGE_INPUT, ADD_FEATURE, REMOVE_FEATURE} from "../../utils/constants";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Add = () => {
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
      mutationFn: (gig) => {
          return newRequest.post("/gigs", gig)
      },
      onSuccess: () => {
          queryClient.invalidateQueries(["myGigs"])
      }
  })  

  const handleChange = (e) => {
    dispatch({
      type: CHANGE_INPUT, 
      payload: {name: e.target.name, value: e.target.value}})
  }

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: ADD_FEATURE, 
      payload: e.target[0].value
    })
    e.target[0].value = "";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
    navigate("/mygigs");
  }

  return (
    <div className="add">
      <div className="container">
        <h1>Add New job posting</h1>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Looking for .."
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>
            <label htmlFor="">Description</label>
            <textarea 
              name="desc" 
              id="" 
              placeholder="Brief descriptions about the job requirement" 
              cols="0" 
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Delivery Date</label>
            <input type="datetime-local" name="projectDeliveryDate" onChange={handleChange} />
            <label htmlFor="">Last day to bid</label>
            <input type="datetime-local" name="bidLastDate" onChange={handleChange} />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g Node JS"/>
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f)=>(

                <div className="item" key={f}>
                  <button onClick={()=>dispatch({type: REMOVE_FEATURE, payload: f})}>
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" min={0} onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
