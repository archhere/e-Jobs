import React, { useState, useMemo } from "react"
import "./Register.scss";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate, Link } from "react-router-dom";
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { SKILL_OPTIONS, POSTER_PLACEHOLDER, BIDDER_PLACEHOLDER, ERROR_GENERIC } from "../../utils/constants";
import { toast } from 'react-custom-alert';
import { ToastContainer } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';


function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    isSeller: false,
    desc: "",
    cat: []
  });
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [country, setCountry] = useState('')
  const [selectedskills, setSelectedskills] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser(prev => {
      return {...prev, [e.target.name]: e.target.value};
    })
  }

  const handleDeletion = (e) => {
    setSelectedskills(() => {
      return [...e];
    })
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
    const url = await upload(file);
    const body = {
      ...user,
        img: url,
        country: country.label,
        skills: updateSkills()
    }

    try{
      await newRequest.post("auth/register", body)
      //to-do handle login after registration
      navigate("/");
    } catch(err) {
      handleError(err?.response?.data || ERROR_GENERIC)
    }
  }

  const handleError = (err) => {
    return toast.error(err, {toastId: err});
  }

  const descPlaceHolder = user?.isSeller ? POSTER_PLACEHOLDER : POSTER_PLACEHOLDER + BIDDER_PLACEHOLDER


  return (
    <div className="mainContainer">
      <ToastContainer position="top-center" limit={1} floatingTime={8000} />
      <Link to="/login" className="linkBack">Sign in</Link>
      <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input name="username" type="text" placeholder="name" onChange={handleChange}/>
          <label htmlFor="">Email</label>
          <input name="email" type="email" placeholder="email" onChange={handleChange}/>
          <label htmlFor="">Password</label>
          <input name="password" type="password" onChange={handleChange}/>
          <label htmlFor="">Profile Picture</label>
          <input type="file" onChange={e=>setFile(e.target.files[0])}/>
          <div className="countrySelector">
            <label className="countryLabel" htmlFor="">Country</label>
            <Select options={countryOptions} value={country} onChange={setCountry} />
          </div>
          <button 
            disabled = {!user.username.length || !user.password.length || !user.email.length || !country?.label?.length} 
            type="submit"
          >
            Register
          </button>
        </div>
        <div className="right">
        <h1>I want to become a job poster</h1>
          <div className="toggle">
            <label htmlFor="">Activate the job poster account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder={descPlaceHolder}
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
          {!user?.isSeller && (
            <div className="multiSelect">
              <label htmlFor="">Skill Categories</label>
              <Multiselect
                name="selectedSkills"
                options={SKILL_OPTIONS} 
                selectedValues={selectedskills} 
                onSelect={setSelectedskills} 
                onRemove={handleDeletion} 
                displayValue="label" 
                placeholder=""
              />
            </div>
          )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register