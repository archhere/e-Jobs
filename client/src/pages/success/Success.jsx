import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { PAYMENT_SUCCESS } from "../../utils/constants";

const Success = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search)
    const payment_intent = params.get("payment_intent");

    useEffect(() => {
        const makeRequest = async () => {
            try {
                await newRequest.put("/gigs", {payment_intent})
                setTimeout(() => {
                    navigate("/mygigs")
                }, 5000)
            } catch(err) {
                console.log(err)
            }
        };
        makeRequest();
    }, [])
    return (
        <div>{PAYMENT_SUCCESS}</div>
    )
}

export default Success;