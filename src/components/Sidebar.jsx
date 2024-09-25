import React, { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAddModerator } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const yy = "https://backend1-96bk.onrender.com";

  const handleLogout = async () => {
    await axios
      .get(`${yy}/api/v1/user/admin/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const navigateTo = useNavigate();

  const gotoHomePage = () => {
    navigateTo("/");
    setShow(!show);
  };
  const gotoDoctorsPage = () => {
    navigateTo("/doctors");
    setShow(!show);
  };
  const gotoMessagesPage = () => {
    navigateTo("/messages");
    setShow(!show);
  };
  const gotoAddNewDoctor = () => {
    navigateTo("/doctor/addnew");
    setShow(!show);
  };
  const gotoAddNewAdmin = () => {
    navigateTo("/admin/addnew");
    setShow(!show);
  };
  const gotoDashboard = () => {
    navigateTo("/");
    setShow(!show);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white py-16 transition-transform transform ${
          show ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={!isAuthenticated ? { display: "none" } : {}}
      >
        <div className="flex flex-col items-center space-y-8">
          <div className="relative group">
            <MdDashboard
              onClick={gotoDashboard}
              className="w-12 h-12 text-3xl cursor-pointer hover:bg-white hover:text-blue-700 hover:rounded-full transition duration-300"
            />
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-sm text-white py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              Dashboard
            </div>
          </div>

          <div className="relative group">
            <MdAddModerator
              onClick={gotoAddNewAdmin}
              className="w-12 h-12 text-3xl cursor-pointer hover:bg-white hover:text-blue-700 hover:rounded-full transition duration-300"
            />
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-sm text-white py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              Add New Admin
            </div>
          </div>

          <div className="relative group">
            <IoPersonAddSharp
              onClick={gotoAddNewDoctor}
              className="w-12 h-12 text-3xl cursor-pointer hover:bg-white hover:text-blue-700 hover:rounded-full transition duration-300"
            />
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-sm text-white py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              Add New Doctor
            </div>
          </div>

          <div className="relative group">
            <RiLogoutBoxFill
              onClick={handleLogout}
              className="w-12 h-12 text-3xl cursor-pointer hover:bg-white hover:text-blue-700 hover:rounded-full transition duration-300"
            />
            <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-sm text-white py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              Logout
            </div>
          </div>
        </div>
      </nav>

      <div
        className="fixed top-8 left-10 z-10 md:hidden"
        style={!isAuthenticated ? { display: "none" } : {}}
      >
        <GiHamburgerMenu
          className="w-10 h-10 text-white bg-blue-700 p-2 rounded-full cursor-pointer hover:text-blue-400"
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
};

export default Sidebar;
