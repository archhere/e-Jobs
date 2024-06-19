import React, { useState } from "react"
import "./Profile.scss";
import newRequest from "../../utils/newRequest";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Multiselect from 'multiselect-react-dropdown';
import { SKILL_OPTIONS, ERROR_GENERIC } from "../../utils/constants";
import { toast } from 'react-custom-alert';
import getCurrentUser from "../../utils/getCurrentUser";

function EditProfile() { 
  // We can edit profile from top nav or while bidding for a GIG
  // We differentiate bidder with the gigId query param

  const userDetails = getCurrentUser();
  const {search} = useLocation();
  const params =  new URLSearchParams(search)
  const gigId = params?.get("gigId");
  const maxPrice = params?.get("max");
  let headerText = "Update your description and skills";
  let buttonName = "Confirm Changes";
  const isBidder = gigId?.length;
  if (isBidder?.length) {
    headerText = "Review your skills before bidding";
    buttonName = "Confirm Bid"
  }
  const [user, setUser] = useState({
  });
  const [userChangedSkills, setuserChangedSkills] = useState(false);
  const [bidPrice, setbidPrice] = useState(0);

  const userCurrentSkills = [];
  userDetails?.skills.forEach(skill => userCurrentSkills.push({label: skill, value: skill}));
  const [selectedskills, setSelectedskills] = useState(userCurrentSkills);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser(prev => {
      return {...prev, [e.target.name]: e.target.value};
    })
  }

  const handlebidPrice = (e) => {
    setbidPrice(() => {
      return e.target.value;
    })
  }

  const handleDeletion = (e) => {
    setSelectedskills(() => {
      return [...e];
    }, setuserChangedSkills(() => {
        return true;
    }))
    
  }

  const handleSelectedSkills = (e) => {
    setSelectedskills(() => {
      return [...e];
    }, setuserChangedSkills(() => {
        return true;
    }))
  }

  const handleSeller = e => {
    setUser(prev => {
      return {...prev, isSeller: e.target.checked};
    })
  }

  const updateSkills = () => {
    const arr = [];
    selectedskills.forEach((skill) => {
      arr.push(skill.value);
    })
    return arr;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      ...user,
        skills: updateSkills()
    }

    try{
      if(user?.desc || userChangedSkills || user?.isSeller === true) {
        const response = await newRequest.put("users/update/", body);
        await localStorage.setItem("currentUser", JSON.stringify(response.data));
      }
      if (isBidder) {
        await newRequest.put(`gigs/${gigId}?isBid=true&bidPrice=${bidPrice}`, {});
        navigate(`/gig/${gigId}`);
      } else {
        navigate(`/profile/${userDetails._id}`);
      }
    } catch(err) {
      handleError(err?.response?.data || ERROR_GENERIC)
    }
  }

  const handleError = (err) => {
    return toast.error(err, {toastId: err});
  }


  return (
    <div className="mainContainer">
      <Link to="/login" className="linkBack">Sign in</Link>
      <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="right">
          <h1>{headerText}</h1>
          {!isBidder && !userDetails?.isSeller && (
            <div className="toggle">
                <label htmlFor="">Activate the job poster account</label>
                <label className="switch">
                <input type="checkbox" onChange={handleSeller} />
                <span className="slider round"></span>
                </label>
            </div>
          )}
          <label htmlFor="">Description</label>
          <textarea
            name="desc"
            id=""
            cols="30"
            rows="10"
            value = {user.desc || userDetails.desc}
            onChange={handleChange}
          ></textarea>
          {(
            <div className="multiSelect">
              <label htmlFor="">Skill Categories</label>
              <Multiselect
                name="selectedSkills"
                options={SKILL_OPTIONS} 
                selectedValues={selectedskills} 
                onSelect={handleSelectedSkills} 
                onRemove={handleDeletion} 
                displayValue="label" 
                placeholder=""
              />
            </div>
          )}
            {isBidder && (
                <div id="bidPrice">
                    <label htmlFor="">Bid Price</label>
                    <input type="number" min={0} max={maxPrice} onChange={handlebidPrice} name="price" />
                </div>
            )}
            <button id = "bidButton" type="submit">
                {buttonName}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile