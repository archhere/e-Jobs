import React, { useReducer } from "react";
import "./Add.scss";
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducer";
import { CHANGE_INPUT, ADD_FEATURE, REMOVE_FEATURE} from "../../utils/constants";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  GRAPHICS_AND_DESIGN, VIDEO_AND_ANIMATION, LIFESTYLE, WRITING_AND_TRANSLATION,
  DIGITAL_MARKETING, MUSIC_AND_AUDIO, PROGRAMMING_AND_TECH, BUSINESS, AI_SERVICES, ERROR_GENERIC
} from "../../utils/constants";
import { toast } from 'react-custom-alert';

const Add = () => {
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
      mutationFn: (gig) => {
          return newRequest.post("/gigs", gig)
      },
      onSuccess: () => {
          queryClient.invalidateQueries(["myGigs"]);
          navigate("/mygigs");
      },
      onError: (err) => {
        handleError(err?.response?.data || ERROR_GENERIC)
      }
  })  

  const handleError = (err) => {
    return toast.error(err, {toastId: err});
  }

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
              <option value={GRAPHICS_AND_DESIGN}>{GRAPHICS_AND_DESIGN}</option>
              <option value={VIDEO_AND_ANIMATION}>{VIDEO_AND_ANIMATION}</option>
              <option value={LIFESTYLE}>{LIFESTYLE}</option>
              <option value={WRITING_AND_TRANSLATION}>{WRITING_AND_TRANSLATION}</option>
              <option value={DIGITAL_MARKETING}>{DIGITAL_MARKETING}</option>
              <option value={MUSIC_AND_AUDIO}>{MUSIC_AND_AUDIO}</option>
              <option value={PROGRAMMING_AND_TECH}>{PROGRAMMING_AND_TECH}</option>
              <option value={BUSINESS}>{BUSINESS}</option>
              <option value={AI_SERVICES}>{AI_SERVICES}</option>
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
            <input type="datetime-local" min="{{today()}}" name="projectDeliveryDate" onChange={handleChange} />
            <label htmlFor="">Last day to bid</label>
            <input type="datetime-local"  min="{{today()}}" name="bidLastDate" onChange={handleChange} />
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
            <label htmlFor="">Max Price</label>
            <input type="number" min={0} onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
