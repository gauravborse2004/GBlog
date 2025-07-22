import React, { useState } from 'react'
import logo from '@/assets/images/logo-white.png'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { MdLogin } from "react-icons/md";
import SearchBox from './SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import usericon from '@/assets/images/user.png'
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline, IoSearch } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineMenu } from "react-icons/ai";
import { RouteBlog, RouteIndex, RouteSignIn, RouteProfile } from '@/helpers/RouteName';
import { logout } from '@/store/auth-slice/authSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSidebar } from './ui/sidebar';



const Topbar = () => {
  const {toggleSidebar} = useSidebar()
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.authUser);


  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logout());
      unwrapResult(resultAction);
      navigate(RouteIndex);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };
  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }



  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b'>
      <div className='flex justify-center items-center gap-2'>
        <button onClick={toggleSidebar} className='md:hidden cursor-pointer' type='button'>
          <AiOutlineMenu />
        </button>
        <Link to={RouteIndex}>
          <img src={logo} className='md:w-auto w-48' />
        </Link>
      </div>

      <div className='w-[500px]'>
        <div className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16 md:p-0 p-5 ${showSearch ? 'block' : 'hidden'}`}>
          <SearchBox />
        </div>
      </div>

      <div className='flex items-center  gap-5'>

        <button onClick={toggleSearch} type='button' className='md:hidden block'>
          <IoMdSearch size={25} />
        </button>

        {!user
          ?
          <Button asChild className="rounded-full">
            <Link to={RouteSignIn}  >
              <MdLogin />
              Sign In
            </Link>
          </Button>
          :
          <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img src={user.user.avatar || usericon} alt="profile-pic" className='w-8 rounded-full' />
            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-2 p-4'>

                <div className='text-black font-semibold flex flex-col border-b-2 border-black'>
                  <p >{user.user.name}</p>
                  <p >{user.user.email}</p>
                </div>

                <div className='flex gap-4 hover:text-black cursor-pointer items-center hover:font-semibold hover:bg-gray-200 hover:rounded-lg p-1'>
                  <FaRegUser />
                  <p className='' onClick={() => navigate(RouteProfile)}>My Profile</p>
                </div>

                <div className='flex gap-4 hover:text-black cursor-pointer items-center hover:font-semibold hover:bg-gray-200 hover:rounded-lg p-1'>
                  <FaPlus />
                  <p onClick={() => navigate(RouteBlog)}>Create Blog</p>
                </div>

                <div className='flex gap-4 hover:text-red-700 cursor-pointer items-center hover:font-semibold hover:bg-gray-200 hover:rounded-lg p-1'>
                  <IoLogOutOutline />
                  <p onClick={handleLogout}>Logout</p>
                </div>

              </div>
            </div>
          </div>

        }



      </div>



    </div >
  )
}

export default Topbar