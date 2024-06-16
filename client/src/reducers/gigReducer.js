import { CHANGE_INPUT, ADD_FEATURE, REMOVE_FEATURE } from "../utils/constants";

export const INITIAL_STATE = {
    userId: JSON.parse(localStorage.getItem("currentUser"))?._id,
    title: "",
    cat: "",
    desc: "",
    projectDeliveryDate: "",
    bidLastDate: "",
    features: [],
    price: 0,
    bids: []
  };

  export const gigReducer = (state,action) => {
    switch (action.type) {
        case CHANGE_INPUT:
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case ADD_FEATURE:
            return {
                ...state,
                features: [...state.features, action.payload],
            };    
        case REMOVE_FEATURE:
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