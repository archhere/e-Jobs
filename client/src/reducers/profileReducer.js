import { CHANGE_USER_INPUT, ADD_USER_IMAGE, ADD_SKILL, REMOVE_SKILL } from "../utils/constants";

export const INITIAL_STATE = {
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    isSeller: false,
    desc: "",
    cat: "",
    skills: [],
  };

  export const profileReducer = (state,action) => {
    switch (action.type) {
        case CHANGE_USER_INPUT:
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case ADD_USER_IMAGE:
            return {
                ...state,
                cover: action.payload.cover,
                images: action.payload.images
            }    
        case ADD_SKILL:
            return {
                ...state,
                features: [...state.features, action.payload],
            };    
        case REMOVE_SKILL:
            return {
                ...state,
                features: state.features.filter(
                    (feature) => feature !== action.payload
                )
            }   
        default:
            return state;     
    }
  };