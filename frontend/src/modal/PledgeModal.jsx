import { X } from 'lucide-react';
import Perk from "../Components/perk.jsx";
import Payment from "../modal/Payment.jsx"
import {useState} from "react";

export default function PledgeModal({ open, onClose, amount, setAmount, data }) {
    const [paymentOpen, setPaymentOpen] = useState(false);
    let selectedPerk;
    if (!open) return null;
    const handleNext = async () => {
        const amountValue = parseFloat(amount);

        if (isNaN(amountValue) || amountValue <= 0) {
            console.log("Enter a valid amount");
            return;
        }

        const perks = data?.data;
        let selectedPerkId = null;

        if (perks) {
            const benefit1 = perks.benefit1?.[0];
            const benefit2 = perks.benefit2?.[0];
            const benefit3 = perks.benefit3?.[0];

            if (benefit3 && amountValue >= benefit3.price) {
                // selectedPerkId = benefit3._id;
                selectedPerkId = 3;
            } else if (benefit2 && amountValue >= benefit2.price) {
                // selectedPerkId = benefit2._id;
                selectedPerkId = 2;
            } else if (benefit1 && amountValue >= benefit1.price) {
                // selectedPerkId = benefit1._id;
                selectedPerkId = 1;
            }
        }
        selectedPerk=selectedPerkId;
        console.log("Selected Perk ID:", selectedPerkId);
        setPaymentOpen(true);

    };



    return (
        <>

        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-2xl font-semibold text-coral-800">Select your reward</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-800 font-medium mb-4">Select an option below</p>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="flex-grow">
                            <div className="flex rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500">
                                <span className="flex items-center justify-center px-4 bg-gray-50 border-r border-gray-300 text-gray-700 font-medium">रू</span>
                                <input
                                    type="number"
                                    className="w-full py-3 px-4 outline-none"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min="1"
                                />
                            </div>
                            {amount && parseFloat(amount) <= 0 && (
                                <p className="text-coral-800 text-sm mt-1">Please enter a positive amount</p>
                            )}
                        </div>

                        <button
                            className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
                                amount && !isNaN(amount) && parseFloat(amount) > 0
                                    ? 'bg-coral-600 hover:bg-coral-800'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            onClick={handleNext}
                            disabled={!amount || isNaN(amount) || parseFloat(amount) <= 0}
                        >
                            Pledge {amount && !isNaN(amount) && parseFloat(amount) > 0 ? `रू${amount}` : ""}
                        </button>
                    </div>

                    <div className="mt-8">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Available Perks</h4>
                        <div className="grid grid-cols-1 gap-4">
                            {data && <Perk perkData={data} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <Payment
                open={paymentOpen}
                setOpen={setPaymentOpen}
                amount={amount}
                data={data}
                selectedPerkId={selectedPerk}
            />
        </>
    );
}
