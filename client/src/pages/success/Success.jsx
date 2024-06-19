import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { PAYMENT_SUCCESS } from "../../utils/constants";
import { toast } from 'react-custom-alert';

const Success = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(search)
    const payment_intent = params.get("payment_intent");

    const handleError = (err) => {
        return toast.error(err, {toastId: err});
      }

    useEffect(() => {
        const makeRequest = async () => {
            try {
                await newRequest.put("/gigs", {payment_intent})
                setTimeout(() => {
                    navigate("/mygigs")
                }, 5000)
            } catch(err) {
                handleError(err?.response?.data || ERROR_GENERIC)

            }
        };
        makeRequest();
    }, [])
    return (
        <div>{PAYMENT_SUCCESS}</div>
    )
}

export default Success;