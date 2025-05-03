import React from 'react';
import khalti from "../assets/khalti-logo.png";
import esewa from "../assets/esewa.png";
import axios from "axios";
import { generateUniqueId } from "../utils/helpers.js";
function Payment({ open, setOpen, amount, data, selectedPerkId }) {

    const handlePayment = async (paymentGateway) => {
        try {
            const perks = data?.data;
            const uuid= generateUniqueId();
            sessionStorage.setItem("current_transaction_id", uuid);
            const payload = {
                // amount,
                // productId,
                // backerId,
                // paymentGateway,
                // customerName,
                // customerEmail,
                // perk
                customerName:localStorage.getItem("Name"),
                customerEmail:localStorage.getItem("email"),
                backerId:localStorage.getItem("id"),
                amount: parseFloat(amount),
                paymentGateway: paymentGateway.toLowerCase(),
                productId: perks?.projectId,
                perk: selectedPerkId,
                uuid
            };

            console.log("Initiating payment with payload:", payload);

            const response = await axios.post("http://localhost:8000/api/initiate-payment", payload);

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                console.error("Payment URL not returned from API.");
                alert("Payment initiation failed. Please try again.");
            }
        } catch (error) {
            console.error("Error initiating payment:", error);
            alert("Payment failed. Check the console for details.");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-lg relative">
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-3 right-5 text-gray-500 hover:text-black text-2xl"
                    aria-label="Close modal"
                >
                    ×
                </button>

                <h2 className="text-2xl font-semibold mb-8 text-center">Choose Payment Method</h2>

                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => handlePayment("Khalti")}
                        className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-xl p-6 hover:bg-purple-50 transition"
                    >
                        <img src={khalti} alt="Khalti" className="h-10 w-auto" />
                        <span className="text-purple-700 font-medium text-lg">Pay with Khalti</span>
                    </button>

                    <button
                        onClick={() => handlePayment("Esewa")}
                        className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-xl p-6 hover:bg-green-50 transition"
                    >
                        <img src={esewa} alt="eSewa" className="h-10 w-auto" />
                        <span className="text-green-600 font-medium text-lg">Pay with eSewa</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
