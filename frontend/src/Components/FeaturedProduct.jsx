import React, { useState, useEffect, useRef } from 'react';
import getAxios from '../hooks/getAxios.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from "react-router-dom";
import Card from "./Card.jsx";

const CarouselCard = ({ image, title, isSelected, index, onSelect }) => (
  <div
    className={`<div className={\`relative h-36 w-56 cursor-pointer transition-all duration-300 rounded-lg ${
      isSelected ? 'border-2 border-coral-500 scale-105' : 'opacity-70 hover:opacity-90'
    }`}
    onClick={() => onSelect(index)}
  >
    <img src={image} alt={title} className="h-full w-full object-cover" />
    {isSelected && <div className="absolute bottom-0 left-0 w-full h-1 bg-coral-500"></div>}
  </div>
);

const FeaturedProduct = () => {
  const { data, error, loading } = getAxios(`${import.meta.env.VITE_BACKEND}/api/v1/company/allProjects`);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(false);
  const pauseTimerRef = useRef(null);
  const autoplayRef = useRef(null);

  const shuffleArray = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    if (data?.data?.length > 0) {
      const verifiedProjects = data.data.filter(
        project => project.verified === true && project.status === "Active"
      );
      const randomized = shuffleArray(verifiedProjects);
      setShuffledCards(randomized);
      setSelectedIndex(0);
    }
  }, [data]);



  const handleSelect = (index) => {
    setFade(true);
    setTimeout(() => {
      setSelectedIndex(index);
      setFade(false);
    }, 150);
    setIsPaused(true);
    clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), 10000);
  };

  const handleNext = () => handleSelect((selectedIndex + 1) % shuffledCards.length);
  const handlePrev = () => handleSelect((selectedIndex - 1 + shuffledCards.length) % shuffledCards.length);

  useEffect(() => {
    if (selectedIndex < visibleStartIndex) {
      setVisibleStartIndex(selectedIndex);
    } else if (selectedIndex >= visibleStartIndex + 4) {
      setVisibleStartIndex(selectedIndex - 3);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isPaused && shuffledCards.length > 0) {
      autoplayRef.current = setInterval(() => {
        setSelectedIndex((prev) => {
          const newIndex = (prev + 1) % shuffledCards.length;
          if (newIndex >= visibleStartIndex + 4) {
            setVisibleStartIndex(Math.min(newIndex - 3, shuffledCards.length - 4));
          } else if (newIndex < visibleStartIndex) {
            setVisibleStartIndex(newIndex);
          }
          return newIndex;
        });
      }, 5000);
    }
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, shuffledCards.length, visibleStartIndex]);

  if (loading) return <div className="w-full h-screen flex items-center justify-center text-white">Loading...</div>;
  if (error) return <div className="w-full h-screen flex items-center justify-center text-red-500">Failed to load cards.</div>;
  if (!shuffledCards.length) return <div className="w-full h-screen flex items-center justify-center text-white">No cards found.</div>;

  const currentCard = shuffledCards[selectedIndex];
  const visibleCards = shuffledCards.slice(visibleStartIndex, visibleStartIndex + 4);

  return (
    <div className="w-full h-screen bg-main-bg relative">
      {/* Main Carousel Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 flex items-center justify-center bg-card-bg hover:bg-card-hover text-coral-900 h-16 w-16 rounded-full transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 flex items-center justify-center bg-card-bg hover:bg-card-hover text-coral-900 h-16 w-16 rounded-full transition-colors duration-300"
        aria-label="Next slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Background Image */}
      <div
        className={`w-full h-full transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
        key={currentCard.Images[0]}
      >
        <img src={currentCard.Images[0]} alt={currentCard.project_name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-coral-900 bg-opacity-30"></div>
      </div>

      {/* Foreground Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 mt-24 sm:mt-36">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">{currentCard.project_name}</h1>

            <Link
              to={`/project/detail/${currentCard._id}`}
              state={{ project: currentCard }}
              className="block w-full"
            >
              <button className="mt-6 bg-coral-500 hover:bg-coral-400 font-semibold px-8 py-3 rounded-md transition duration-300 ease-in-out" >
                SEE CAMPAIGN
              </button>
            </Link>
          </div>
        </div>

        <div className="w-auto mx-auto bg-gray-900 bg-opacity-80 p-6 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="flex items-center gap-4 px-4 py-2 overflow-hidden">
              {visibleCards.map((card, index) => (
                <CarouselCard
                  key={card._id}
                  id={card._id}
                  image={card.Images?.[0]}
                  title={card.project_name}
                  isSelected={visibleStartIndex + index === selectedIndex}
                  index={visibleStartIndex + index}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
