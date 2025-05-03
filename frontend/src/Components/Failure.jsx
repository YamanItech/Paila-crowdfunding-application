import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";

const Failure = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const token = queryParams.get("data");
    const decoded = token ? base64Decode(token) : null;
    const UUID =
        decoded?.transaction_uuid ||
        queryParams.get("purchase_order_id") ||
        sessionStorage.getItem("current_transaction_id");

    useEffect(() => {
        if (UUID) {
            markPaymentAsFailed(UUID);
        }
    }, [UUID]);

    const markPaymentAsFailed = async (product_id) => {
        try {
            await axios.post("http://localhost:8000/api/payment-status", {
                product_id,
                status: "FAILED",
            });
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full backdrop-blur-sm bg-white/90 shadow-2xl rounded-2xl overflow-hidden border border-red-100">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-600/10 backdrop-blur-sm z-0"></div>
                    <div className="h-3 bg-gradient-to-r from-red-500 to-red-600"></div>
                    <div className="p-8 relative z-10">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-white p-3 shadow-lg">
                                <div className="rounded-full bg-red-100 p-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-red-500"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-2">
                    <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-2">Payment Failed</h1>
                    <p className="text-center text-gray-500 mb-8">There was an issue processing your payment</p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-10 bg-red-400 rounded-full mr-3"></div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Transaction ID</p>
                                <p className="text-gray-700 font-mono">{UUID || "Not available"}</p>
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                            <p className="text-sm text-gray-600">
                                If the amount was deducted from your account, it will be refunded
                                within 3-5 business days.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Return to Home
                        </button>
                        <button
                            onClick={() => navigate("/contact-support")}
                            className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Failure;