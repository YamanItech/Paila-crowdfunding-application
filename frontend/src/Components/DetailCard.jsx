import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import getAxios from "../hooks/getAxios.jsx";
import PledgeModal from "../modal/PledgeModal.jsx";

const DetailCard = ({ detail }) => {
    const navigate = useNavigate();
    const progress = (detail.pledged_amount / detail.fund_amount) * 100;
    const user = localStorage.getItem("userRole");
    const { data, loading } = getAxios(`${import.meta.env.VITE_BACKEND}/api/v1/project/perk/${detail._id}`);
    const pledged_amount = detail.pledged_amount;
    const backers = detail.noOfBacker;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        if (!detail?.Images?.length) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % detail.Images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [detail?.Images]);

    if (loading) {
        return <div className="text-center p-5">Loading perks...</div>;
    }

    let daysLeft = 0;
    if (detail && detail.end_date) {
        try {
            const today = new Date().getTime();
            const endDate = new Date(detail.end_date);
            if (!isNaN(endDate.getTime())) {
                const dayInMillis = 1000 * 60 * 60 * 24;
                const diff = endDate.getTime() - today;
                daysLeft = Math.max(0, Math.round(diff / dayInMillis));
            }
        } catch (error) {
            console.error("Error calculating days left:", error);
        }
    }

    const goToPreviousImage = () => {
        if (detail?.Images?.length > 0) {
            setCurrentImageIndex(prevIndex => (prevIndex === 0 ? detail.Images.length - 1 : prevIndex - 1));
        }
    };

    const goToNextImage = () => {
        if (detail?.Images?.length > 0) {
            setCurrentImageIndex(prevIndex => (prevIndex === detail.Images.length - 1 ? 0 : prevIndex + 1));
        }
    };

    const projectName = detail.project_name || "Projects";
    const projectDescription = detail.project_description || "";
    const fundAmount = detail.fund_amount || 0;
    const images = detail.Images || [];

    return (
      <>
          <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="mb-8">
                  <button
                    onClick={() => navigate(-1)}
                    className="text-coral-500 hover:text-coral-600 flex items-center gap-1"
                  >
                      <ChevronLeft size={20} />
                      <span>Go Back</span>
                  </button>
              </div>

              <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold font-mono text-gray-900 mb-4">{projectName}</h1>
                  <p className="text-lg text-gray-600 font-mono max-w-2xl mx-auto">{projectDescription}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card-bg rounded-xl p-4 relative">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          {images.length > 0 ? (
                            <img
                              src={images[currentImageIndex]}
                              alt={projectName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">No image available</span>
                            </div>
                          )}
                          {images.length > 1 && (
                            <>
                                <button onClick={goToPreviousImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={goToNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white">
                                    <ChevronRight size={24} />
                                </button>
                            </>
                          )}
                      </div>
                      {images.length > 1 && (
                        <div className="flex gap-2 mt-4">
                            {images.map((img, index) => (
                              <div
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer ${index === currentImageIndex ? 'ring-2 ring-coral-500' : ''}`}
                              >
                                  <img src={img} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                        </div>
                      )}
                  </div>

                  <div className="bg-card-bg rounded-xl p-6 w-5/6">
                      <div className="w-full h-2 bg-card-alt-bg rounded-full mt-4">
                          <div className="h-full bg-coral-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                      </div>

                      <div className="mb-6">
                          <div className="p-5">
                              <p className="text-3xl font-bold pb-4 text-gray-900">NRP₹ {pledged_amount.toLocaleString()}</p>
                              <p className="text-xl text-gray-600">Pledged of NRP₹ {fundAmount.toLocaleString()} goal</p>
                          </div>
                          <div className="p-5">
                              <p className="text-4xl font-bold pb-4 text-gray-900">{backers}</p>
                              <p className="text-xl text-gray-600">Backers</p>
                          </div>
                      </div>

                      <div className="p-5">
                          <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
                          <p className="text-xl text-gray-600">days to go</p>
                      </div>

                      {user === "backer" && (
                        <button
                          className="w-full py-4 bg-coral-500 text-white rounded-lg font-semibold hover:bg-coral-600 transition-colors"
                          onClick={openModal}
                        >
                            Back this Project
                        </button>
                      )}

                      <p className="text-1xl text-gray-600 text-center mt-4">
                          This project will only be funded if it reaches its goal by{" "}
                          {detail.end_date
                            ? new Date(detail.end_date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })
                            : "N/A"}
                      </p>
                  </div>
              </div>
          </div>

          <PledgeModal
            open={isOpen}
            onClose={closeModal}
            amount={amount}
            setAmount={setAmount}
            data={data}
          />
      </>
    );
};

export default DetailCard;
