import React, { useState } from 'react'
import toctocLogo from "../assets/toctocLogo.png"
import { BsThreeDotsVertical, BsQuestionCircle } from "react-icons/bs"
import { AiOutlineEdit,AiOutlineUser } from "react-icons/ai"
import { GrLanguage } from "react-icons/gr"
import { RiKeyboardFill } from "react-icons/ri"
import { auth, db, provider } from "../firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import CargarModal from './CargarModal'
import { addDoc, collection, doc, Firestore, setDoc } from 'firebase/firestore'
import EditProfileModal from './EditProfileModal'
import { Link } from 'react-router-dom'
import { usePosts } from "../context/PostsFBContext"
import LoginModal from './LoginModal'

const NavBarTop = () => {
    const [showModal, SetShowModal]=useState(false)
    const [isOpen, setIsOpen]=useState(false)
    const [isOpenEdit, setIsOpenEdit]=useState(false)
    const [openLog, setOpenLog]=useState(false)
    const {isAuth, setIsAuth, signInWithGoogle, signUserOut} = usePosts()

    const iduser = !auth ? "" : auth?.currentUser?.uid

    const handleModal=()=>{
        setIsOpen(!isOpen)
    }
    const handleModalEdit=()=>{
        setIsOpenEdit(!isOpenEdit)
    }
    const handleLog=()=>{
        setOpenLog(true)
    }
    const showOn = ()=>{
        SetShowModal(true)
    }
    const showOff = ()=> {
        SetShowModal(false)
    }



    return (
        <div className='hidden quini:block w-full h-[60px] z-10 bg-white border-b border-gray-300 fixed top-0 left-0'>
            <nav className='w-full h-full px-4 py-4 flex justify-between items-center'>
                <Link to="/">
                    <img src={toctocLogo} alt="TocToc Logo" className='max-w-[40px] max-h-[40px] rounded-xl cursor-pointer'/>
                </Link>
                <div className='px2 flex items-center '>
                    {!isAuth ? <strong className='cursor-pointer border-b-gray-900 hover:border-b' onClick={handleLog}>Cargar</strong> : <strong className='cursor-pointer border-b-gray-900 hover:border-b' onClick={handleModal}>Cargar</strong>}

                    {!isAuth ? (<button className='mx-4 outline-none rounded-[4px] font-bold border-0 border-transparent text-white bg-[rgba(254,44,85,1.0)] hover:bg-[#ce193d] px-2 py-[6px]' onClick={handleLog}>Iniciar sesión</button>) : (
                        <>
                        <button className='mx-4 outline-none rounded-[4px] font-bold border-0 border-transparent text-white bg-[rgba(254,44,85,1.0)] hover:bg-[#ce193d] px-2 py-[6px]' onClick={signUserOut}>Cerrar sesión</button>
                        </>
                    )}

                    <BsThreeDotsVertical onClick={showOn} className='cursor-pointer text-xl'/>
                </div>
            </nav>
            <div className={showModal ? 'navbarTopModal' : "hidden"} onMouseEnter={showOn} onMouseLeave={showOff}>
                <ul className='w-full h-full'>
                    <li className='flex py-2 px-4 gap-1 items-center font-bold text-bg-900 cursor-pointer hover:bg-gray-300 transition-colors duration-200'>
                        <GrLanguage /> Español
                    </li>
                    <li className='flex py-2 px-4 gap-1 items-center font-bold text-bg-900 cursor-pointer hover:bg-gray-300 transition-colors duration-200'>
                        <BsQuestionCircle /> Comentarios y ayuda
                    </li>
                    <li className='flex py-2 px-4 gap-1 items-center font-bold text-bg-900 cursor-pointer hover:bg-gray-300 transition-colors duration-200'>
                        <RiKeyboardFill/> Atajos de teclado
                    </li>
                    {isAuth ? <> 
                        <li className='flex py-2 px-4 gap-1 items-center font-bold text-bg-900 cursor-pointer hover:bg-gray-300 transition-colors duration-200'>
                            <Link to={ "/profile/" + iduser } className='flex items-center gap-1 w-full'>
                                <AiOutlineUser/> Ver perfil
                            </Link> 
                        </li> 
                        <li className='flex py-2 px-4 gap-1 items-center font-bold text-bg-900 cursor-pointer hover:bg-gray-300 transition-colors duration-200' onClick={handleModalEdit}>
                            <AiOutlineEdit/> Editar perfil 
                        </li> 
                    </> : "" }
                </ul>
            </div>
            <EditProfileModal isOpenEdit={isOpenEdit} setIsOpenEdit={setIsOpenEdit} />
            <CargarModal isOpen={isOpen} setIsOpen={setIsOpen} />
            <LoginModal openLog={openLog} setOpenLog={setOpenLog}/>
        </div>
    )
}

export default NavBarTop
