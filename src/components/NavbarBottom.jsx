import React, { useState } from 'react'
import { AiOutlineUser } from "react-icons/ai"
import { BiCommentMinus } from "react-icons/bi"
import { MdAdd } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import { GoHome } from "react-icons/go"
import { auth, provider } from "../firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { Link } from 'react-router-dom'
import LoginModal from './LoginModal'



const NavbarBottom = ({ addTik, newTiktok, isAuth, setIsAuth, notifications, displayNotifications }) => {
    const [openLog, setOpenLog]=useState(false)
    const estadoSesion = localStorage.getItem("isAuth")

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
          localStorage.setItem("isAuth", true);
          setIsAuth(true);
        });
      };
    const signUserOut = () => {
        signOut(auth).then(()=> {
            localStorage.clear()
            setIsAuth(false)
        })
      }

    const handleLog=()=>{
        setOpenLog(true)
    }

    return (
        <>
        {isAuth === "true"
            ? (
            <div className={addTik || notifications  ? "addTextTrue" : "addTextFalse"}>
                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'>
                    <Link to="/" className='flex items-center justify-center'> 
                        <GoHome className='self-center text-2xl'/> 
                    </Link> 
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Inicio
                    </p>
                </div>

                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'>
                    <Link to="/" className='flex items-center justify-center'> 
                        <FiSearch className='self-center text-2xl'/>
                    </Link> 
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Tendencias
                    </p>
                </div>
                
                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'> 
                    <div className='self-center flex items-center justify-center text-3xl w-[50px] h-[40px] border border-pink-500  bg-gray-200 rounded-lg text-gray-900' onClick={newTiktok}> 
                        <MdAdd /> 
                    </div>
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                
                    </p>
                </div>

                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer' onClick={displayNotifications}>
                    <div className='flex items-center justify-center'> 
                        <BiCommentMinus className='self-center text-2xl'/>
                    </div> 
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Bandeja de entrada
                    </p>
                </div>

                <Link to={"/profile/" + auth?.currentUser?.uid} className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'>
                    <AiOutlineUser className='self-center text-2xl'/>
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Perfil
                    </p>
                </Link>
            </div>
            )
            :
            (
            <div className={addTik ? "addTextTrue" : "addTextFalse"}>
                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'>
                    <Link to="/" className='flex items-center justify-center'> 
                        <GoHome className='self-center text-2xl'/> 
                    </Link> 
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Inicio
                    </p>
                </div>

                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'>
                    <Link to="/" className='flex items-center justify-center'> 
                        <FiSearch className='self-center text-2xl'/>
                    </Link> 
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Tendencias
                    </p>
                </div>
                
                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'> 
                    <div className='self-center flex items-center justify-center text-3xl w-[50px] h-[40px] border border-pink-500  bg-gray-200 rounded-lg text-gray-900' onClick={handleLog}> 
                        <MdAdd /> 
                    </div>
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                
                    </p>
                </div>

                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer' onClick={handleLog}>
                    <div className='flex items-center justify-center'> 
                        <BiCommentMinus className='self-center text-2xl'/>
                    </div> 
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Bandeja de entrada
                    </p>
                </div>

                <div className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer' onClick={handleLog}>
                    <AiOutlineUser className='self-center text-2xl'/>
                    <p className='font-bold text-sm truncate whitespace-nowrap text-center'>
                        Perfil
                    </p>
                </div>
            </div>
            )
        }
        <LoginModal openLog={openLog} setOpenLog={setOpenLog}/>
        </>

    )
}

export default NavbarBottom
