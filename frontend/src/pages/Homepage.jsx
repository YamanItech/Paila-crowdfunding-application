import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import getAxios from "../hooks/getAxios.jsx";
import Card from "../Components/Card.jsx";
import FeaturedProduct from "../Components/FeaturedProduct.jsx";

function Homepage() {
    const { data, loading } = getAxios(`${import.meta.env.VITE_BACKEND}/api/v1/company/allprojects`);

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
          <div>
            <FeaturedProduct/>
          </div>
          <div className=" p-5 container mx-auto">
            <h2 className="text-4xl font-bold mb-4">All Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.data.map((projectData) => (
                <Card key={projectData._id} project={projectData} />
              ))}
            </div>
          </div>


            <Footer />
        </>
    );
}

export default Homepage;
