import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/paila-logo-white.svg"
import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import { MdAddCall } from "react-icons/md";
import { BsLinkedin } from "react-icons/bs";
import { MdHome } from "react-icons/md";
import { IoMail } from "react-icons/io5";

function Footer() {
  return (
    <footer className="bg-black text-white">
      <section>
        <div className="flex justify-center p-5">
          <div className="w-full lg:w-10/12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-left">
             <img src={logo} alt="" srcset="" />
                <hr className="mb-4 mt-0 inline-block w-16 border-t-2 border-coral" />
                <p>
                  Fuel dreams, support innovation, and drive
                  positive <br />change with our empowering crowdfunding
                  platform. <br />Join us today to make an impact and 
                  bring impactful<br /> projects to life!
                </p>
              </div>
              <div className="lg:text-center">
                <h6 className="uppercase font-bold">Contact</h6>
                <hr className="mb-4 mt-0 inline-block w-16 border-t-2 border-coral" />
                <p className="flex items-center lg:justify-center mb-2">
                  <MdHome size={23} className="mr-2" /> Naxal, Kathmandu
                </p>
                <p className="flex items-center lg:justify-center mb-2">
                  <IoMail className="mr-2" /> heraldcollege@gmail.com
                </p>
                <p className="flex items-center lg:justify-center mb-2">
                  <MdAddCall size={23} className="mr-2" /> 01 234 567 88
                </p>
                <p className="flex items-center lg:justify-center">
                  <MdAddCall size={23} className="mr-2" /> 01 234 567 89
                </p>
              </div>
              <div className="lg:text-right">
                <h6 className="uppercase font-bold">Company</h6>
                <hr className="mb-4 mt-0 inline-block w-16 border-t-2 border-coral lg:ml-auto" />
                {/* <Link to="/" className="no-underline text-gray-400 hover:text-white"> */}
                  <p className="mb-2">Homepage</p>
                {/* </Link> */}
                {/* <Link to="/aboutus" className="no-underline text-gray-400 hover:text-white"> */}
                  <p>About Us</p>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <section className="p-4 border-t border-gray-800 border-opacity-25">
          <div>
            <div className="flex justify-center text-center mb-4">
              <div>
                <span>
                  <h6 className="uppercase font-medium">
                    Get connected with us on social networks:
                  </h6>
                </span>
              </div>
            </div>
            <div className="text-center">
              <div>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="text-gray-400 hover:text-white mr-4 inline-block"
                >
                  <FaFacebook className="hover:text-coral transition-colors" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  className="text-gray-400 hover:text-white mr-4 inline-block"
                >
                  <FaInstagram className="hover:text-coral transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="text-gray-400 hover:text-white mr-4 inline-block"
                >
                  <BsLinkedin className="hover:text-coral transition-colors" />
                </a>
                <a
                  href="https://github.com/"
                  target="_blank"
                  className="text-gray-400 hover:text-white mr-4 inline-block"
                >
                  <FaGithub className="hover:text-coral transition-colors" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-sm font-semibold pt-4 text-gray-400">
            © 2025 Copyright: Paila
          </div>
        </section>
      </section>
    </footer>
  );
}

export default Footer;