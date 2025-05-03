import { useState } from "react";
import khalti from "../assets/khalti-logo.png";
import esewa from "../assets/esewa.png";

export default function Trial() {
    const [open, setOpen] = useState(false);

    const handlePayment = (gateway) => {
        console.log(`${gateway} selected`);
        setOpen(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-md hover:bg-blue-700 transition"
            >
                Pay Now
            </button>

            {open && (
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
                                <img
                                    src={khalti}
                                    alt="Khalti"
                                    className="h-10 w-auto"
                                />
                                <span className="text-purple-700 font-medium text-lg">Pay with Khalti</span>
                            </button>

                            <button
                                onClick={() => handlePayment("Esewa")}
                                className="flex flex-col items-center justify-center gap-4 border border-gray-300 rounded-xl p-6 hover:bg-green-50 transition"
                            >
                                <img
                                    src={esewa}
                                    alt="eSewa"
                                    className="h-10 w-auto"
                                />
                                <span className="text-green-600 font-medium text-lg">Pay with eSewa</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
