import React from 'react';
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import DetailCard from "../Components/DetailCard.jsx";
import { useLocation } from 'react-router-dom';
function DetailPage(props) {
    const { project } = useLocation().state;
    // const detailData = {
    //     title: "Artisanal Hand Painted Canvas Art",
    //     description: "Elevate your space with unique hand-painted canvas art pieces crafted by talented artists.",
    //     images: [
    //         "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2145&q=80",
    //         "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2145&q=80",
    //         "https://images.unsplash.com/photo-1579783902850-c21d3a5cc5d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2145&q=80"
    //     ],
    //     pledged: 53000,
    //     goal: 800,
    //     backers: 5,
    //     daysToGo: -89,
    //     deadline: "2024-12-31"
    // };
    return (
        <>
            <Header/>
            <DetailCard  detail={project} />
            <Footer/>
        </>
    );
}

export default DetailPage;