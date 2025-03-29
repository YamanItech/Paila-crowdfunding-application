import React from 'react';
import logo from "../assets/paila-logo-dark.svg";
import { useNavigate } from "react-router-dom"; 
const Header = () => {
    const navigate = useNavigate();
  return (
    <header className="bg-white p-4 shadow-md flex justify-between items-center">
      {/* Logo on the left */}
      <div className="text-xl font-bold text-gray-800">
        <img src={logo} alt="Paila Logo" className='size-25'/>
      </div>
      
      {/* Button on the right */}
      <div>
        <button className="bg-black py-2 px-6 rounded-lg hover:brightness-110 transition duration-200 text-white text-xl"     onClick={() => navigate("/login")}>
          Try Paila
        </button>
      </div>
    </header>
  );
};

export default Header;
