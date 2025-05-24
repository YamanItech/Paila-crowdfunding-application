import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { base64Decode } from "../utils/helpers";

const Success = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [verificationError, setVerificationError] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);

    // For eSewa: Decode the data parameter
    const token = queryParams.get("data");
    const decoded = token ? base64Decode(token) : null;
    const UUID =
        decoded?.transaction_uuid || queryParams.get("purchase_order_id");

    const isKhalti = queryParams.get("pidx") !== null;
    const rawAmount =
        decoded?.total_amount ||
        queryParams.get("total_amount") ||
        queryParams.get("amount");
    const total_amount = isKhalti ? rawAmount / 100 : rawAmount;

    useEffect(() => {
        verifyPaymentAndUpdateStatus();
    }, [UUID]);

    const verifyPaymentAndUpdateStatus = async () => {
        if (!UUID) {
            setIsLoading(false);
            setVerificationError(true);
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND}/api/payment-status`,
                {
                    UUID, // Send the UUID to find the transaction
                    pidx: queryParams.get("pidx"), // Send the pidx for Khalti verification
                }
            );

            if (response.status === 200) {
                setIsLoading(false);

                if (response.data.status === "COMPLETED") {
                    setPaymentStatus("COMPLETED");
                } else {
                    navigate("/payment-failure", {
                        search: `?purchase_order_id=${UUID}`,
                    });
                    return;
                }
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            setIsLoading(false);
            setVerificationError(true);
            if (error.response && error.response.status === 400) {
                navigate("/payment-failure", {
                    search: `?purchase_order_id=${UUID}`,
                });
            }
        }
    };

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-emerald-800 font-medium">Loading</p>
                    </div>
                </div>
            </div>
        );

    // System error state - when can't verify the payment status
    if (verificationError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full backdrop-blur-sm bg-white/90 shadow-2xl rounded-2xl overflow-hidden border border-amber-100">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-600/10 backdrop-blur-sm z-0"></div>
                        <div className="h-3 bg-gradient-to-r from-amber-500 to-amber-600"></div>
                        <div className="p-8 relative z-10">
                            <div className="flex justify-center">
                                <div className="rounded-full bg-white p-3 shadow-lg">
                                    <div className="rounded-full bg-amber-100 p-3">
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
                                            className="text-amber-500"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-2">
                        <h1 className="text-center text-2xl font-extrabold text-gray-800 mb-2">Verification Error</h1>
                        <p className="text-center text-gray-500 mb-6">We couldn't confirm your payment status</p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                            <p className="text-gray-700 mb-3">
                                Your transaction is being processed, but we couldn't verify its status.
                            </p>
                            <p className="text-gray-700 mb-3">
                                If the amount was deducted from your account, please contact our support team.
                            </p>

                            <div className="flex items-center mt-4">
                                <div className="w-2 h-10 bg-amber-400 rounded-full mr-3"></div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Reference ID</p>
                                    <p className="text-gray-700 font-mono">{UUID || queryParams.get("pidx") || "Unknown"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Go to Homepage
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state - only shown for confirmed successful payments
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full backdrop-blur-sm bg-white/90 shadow-2xl rounded-2xl overflow-hidden border border-emerald-100">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-600/10 backdrop-blur-sm z-0"></div>
                    <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    <div className="p-8 relative z-10">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-white p-3 shadow-lg">
                                <div className="rounded-full bg-emerald-100 p-3">
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
                                        className="text-emerald-500"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-2">
                    <h1 className="text-center text-3xl font-extrabold text-gray-800 mb-2">Payment Successful</h1>
                    <p className="text-center text-gray-500 mb-8">Thank you for your payment. Your transaction was successful.</p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-emerald-400 rounded mr-2"></span>
                            Transaction Details
                        </h3>

                        <div className="space-y-4">
                            <div className="flex">
                                <div className="w-1/2">
                                    <p className="text-sm text-gray-500 font-medium">Amount Paid</p>
                                    <p className="text-lg font-semibold text-gray-800">NPR {total_amount}</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-sm text-gray-500 font-medium">Transaction ID</p>
                                    <p className="text-sm font-mono text-gray-800 truncate">{UUID}</p>
                                </div>
                            </div>

                            {paymentStatus === "COMPLETED" && (
                                <div className="flex">
                                    <div className="w-1/2">
                                        <p className="text-sm text-gray-500 font-medium">Payment Method</p>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                                {isKhalti ? (
                                                    <div className="h-6 w-6 bg-purple-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">K</span>
                                                    </div>
                                                ) : (
                                                    <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">e</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-800">{isKhalti ? "Khalti" : "eSewa"}</p>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <p className="text-sm text-gray-500 font-medium">Status</p>
                                        <div className="flex items-center">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                                            <p className="text-emerald-700 font-medium">Completed</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => navigate("/backer/projects")}
                            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                            </svg>
                            Print Receipt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Success;