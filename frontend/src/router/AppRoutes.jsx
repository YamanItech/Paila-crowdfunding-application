import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage.jsx";
import Auth from "../pages/Auth.jsx";
import DetailPage from "../pages/DetailPage.jsx";
import AddProject from "../pages/company/AddProject.jsx";
import AddPerk from "../pages/company/AddPerk.jsx";
import Perk from "../Components/perk.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminProfile from "../pages/admin/AdminProfile.jsx";
import AdminOverview from "../pages/admin/AdminOverview.jsx";
import CompanyProfile from "../pages/company/CompanyProfile.jsx";
import CompanyDashboard from "../pages/company/CompanyDashborad.jsx";
import CompanyOverview from "../pages/company/CompanyOverview.jsx";
import ManageCompanies from "../pages/admin/ManageCompanies.jsx";
import ManageProjects from "../pages/admin/ManageProjects.jsx";
import Trial from "../Components/Trial.jsx";
import Art from "../pages/category/Art.jsx";
import Technology from "../pages/category/Technology.jsx";
import Musics from "../pages/category/Musics.jsx";
import Food from "../pages/category/Food.jsx";
import Games from "../pages/category/Games.jsx";
import Publishing from "../pages/category/Publishing.jsx";
import Success from "../Components/Success.jsx";
import Failure from "../Components/Failure.jsx";
import PaymentForm from "../Components/PaymentForm.jsx";
import CompanyProjects from "../pages/company/CompanyProjects.jsx";
import BackerDashboard from "../pages/backer/BackerDashboard.jsx";
import BackerProfile from "../pages/backer/BackerProfile.jsx";
import FundedProject from "../pages/backer/FundedProject.jsx";
import Kyc from "../Components/Kyc.jsx";
import ExploreAll from "../pages/category/ExploreAll.jsx";

function AppRoutes(props) {
    const router = createBrowserRouter([
        {
            path:"/payment-success",
            element:<Success />
        },
        {
            path:"/payment-failure",
            element:<Failure />
        },
        {
            path:"/payment",
            element:<PaymentForm/>
        },
        {
            path: "/trial",
            element:<Trial/>,
        },
        {
            path: "/category/art",
            element: <Art/>
        },
        {
            path:"/category/music",
            element:<Musics/>,
        },
        {
            path:"/category/technology",
            element: <Technology/>,
        },
        {
            path:"/category/food",
            element:<Food/>
        },
        {
            path:"/category/publishing",
            element:<Publishing/>,
        },
        {
            path:"/category/games",
            element:<Games/>,
        },
        {
            path:"/allprojects",
            element:<ExploreAll/>
        },

        {
            path: "/login",
            element:<Auth/>
        },
        {
            path: "/project/detail/:projectId",
            element:<DetailPage/>
        },

        {
            path:"/perk",
            element:<Perk/>
        },
        {
            path: "/",
            element: (
              <PrivateRoute userTypeRequired={null}>
                  <Homepage />
              </PrivateRoute>
            )
        }
,

        {
            path:"/admin",
            element:
            <PrivateRoute userTypeRequired="admin">
                <AdminDashboard/>
            </PrivateRoute>,
            children:[
                {
                    path:"/admin",
                    element:<AdminOverview/>
                },
                {
                    path:"/admin/profile",
                    element:<AdminProfile/>

                },
                {
                    path:"/admin/companies",
                    element:<ManageCompanies/>
                },
                {
                    path:"/admin/products",
                    element:<ManageProjects/>
                }
            ]
        },
        {
            path:"/backer",
            element:
                <PrivateRoute userTypeRequired="backer">
                   <BackerDashboard/>
                </PrivateRoute>,
            children:[
                {
                    path:"/backer",
                    element:<FundedProject/>
                },
                {
                    path:"/backer/profile",
                    element:<BackerProfile/>

                }

            ]
        },
        {
            path:"/company",
            element:
            <PrivateRoute userTypeRequired="company">
                <CompanyDashboard/>
            </PrivateRoute>,
            children:[
                {
                    path:"/company",
                    element:<CompanyOverview/>
                },
                {
                    path: "/company/addProject",
                    element:<AddProject/>
                },
                {
                    path:"/company/addPerk",
                    element:<AddPerk/>
                },
                {
                    path:"/company/profile",
                    element:<CompanyProfile/>
                },
                {
                    path:"/company/projects",
                    element:<CompanyProjects/>
                },
                {
                    path:"/company/kyc",
                    element:<Kyc/>
                }

            ]
        }

    ])
    return (
        <RouterProvider router={router} />
    );
}

export default AppRoutes;