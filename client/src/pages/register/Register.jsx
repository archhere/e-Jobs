import React, { useState, useMemo } from "react"
import "./Register.scss";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { SKILL_OPTIONS } from "../../utils/constants";


function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    cat: [],
    skills: []
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
    console.log(selectedskills)
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
    console.log(body)
    try{
      await newRequest.post("auth/register", body)
      navigate("/");
    } catch(err) {
      console.log(err)
    }
  }

  console.log(selectedskills)

  return (
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
          <button type="submit">Register</button>
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
            placeholder="A short description of yourself"
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
  )
}

export default Register