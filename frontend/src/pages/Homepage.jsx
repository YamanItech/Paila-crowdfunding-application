import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import getAxios from "../hooks/getAxios.jsx";
import Card from "../Components/Card.jsx";
import all from "../assets/all.jpg";

function Homepage() {
    const { data, loading } = getAxios(`http://localhost:8000/api/v1/company/allProjects`);

    // Handle loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Check if data is an array and handle any errors in case it's not
    if (!Array.isArray(data?.data)) {
        return <div>Error: Data is not an array or is in an unexpected format.</div>;
    }

    return (
        <>
            <Header />
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src={all} alt="All Categories" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                </div>
                <h1 className="relative text-white text-7xl font-bold tracking-wider">
                    All Projects
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5 bg-main-bg">
                {data.data.map((projectData) => (
                    <Card key={projectData._id} project={projectData} />
                ))}
            </div>
            <Footer />
        </>
    );
}

export default Homepage;
