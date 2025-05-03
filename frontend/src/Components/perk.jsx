import React from "react";

function Perk({ perkData }) {
    // Extract benefits from the data
    const benefit1 = perkData?.data?.benefit1 || [];
    const benefit2 = perkData?.data?.benefit2 || [];
    const benefit3 = perkData?.data?.benefit3 || [];

    // Combine all benefits into a single array for easier rendering
    const allBenefits = [
        ...benefit1,
        ...benefit2,
        ...benefit3
    ];

    return (
        <div className="mx-6 my-8 bg-[#FAF9F5] rounded-xl p-6 shadow-lg border border-[#E3DACC]">
            <div className="flex items-center mb-4">
                <div className="bg-[#C85C3D] rounded-full p-2 mr-3">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-[#A04831]">Available Perk</h3>
            </div>

            <div className="mt-6 space-y-5">
                {allBenefits.length > 0 ? (
                    allBenefits.map((benefit) => (
                        <div
                            key={benefit._id}
                            className="bg-[#E3DACC] rounded-lg p-4 shadow-sm border-l-4 border-[#C85C3D] hover:bg-[#CDC5B9] transition duration-300"
                        >
                            <h4 className="text-lg font-semibold text-[#783525] mb-2">{benefit.name}</h4>
                            <p className="text-[#502319] mb-3">{benefit.description}</p>
                            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#A04831]">
                  Value: रू {benefit.price}
                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#E3DACC] rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-[#CDC5B9] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-[#502319]">No benefits available at the moment</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Perk;