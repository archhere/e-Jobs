import "./Pay.scss";
import React, { useEffect,  useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

// This is a public key
const stripePromise = loadStripe("pk_test_51PQZB2RpaVBjHw875fOVpiG4IMMAviSDeKjjX8X9IqJotmJzXCd1EajExukw5lwsOXogBFLmma3ZD3rw2wYAKkKL008JeW9Z2e");


const Pay = () => {
    const [clientSecret, setClientSecret] = useState("");

    const { id } = useParams();

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await newRequest.post(`/orders/create-payment-intent/${id}`)
                setClientSecret(res.data.clientSecret);
            } catch(err) {
                console.log(err)
            }
        }
        makeRequest();
    }, [])

    const appearance = {
        theme: 'stripe',
      };
      const options = {
        clientSecret,
        appearance,
      };

    return (
        <div className="pay">
            {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
            )}
      </div>
    )
}

export default Pay