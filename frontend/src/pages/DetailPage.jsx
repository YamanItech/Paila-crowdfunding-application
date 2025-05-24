import React from 'react';
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import DetailCard from "../Components/DetailCard.jsx";
import { useLocation } from 'react-router-dom';
function DetailPage(props) {
    const { project } = useLocation().state;
    return (
        <>
            <Header/>
            <DetailCard  detail={project} />
            <Footer/>
        </>
    );
}

export default DetailPage;