import React, { useState } from 'react'
import toctocLogo from "../assets/toctocLogo.png"
import { BsThreeDotsVertical, BsQuestionCircle } from "react-icons/bs"
import { GrLanguage } from "react-icons/gr"
import { RiKeyboardFill } from "react-icons/ri"

const NavBarTop = () => {
    const [showModal, SetShowModal]=useState(false)
    const showOn = ()=>{
        SetShowModal(true)
    }
    const showOff = ()=> {
        SetShowModal(false)
    }

    return (
        <div className='hidden quini:block w-full h-[60px] z-10 bg-white border-b border-gray-300 fixed top-0 left-0'>
            <nav className='w-full h-full px-4 py-4 flex justify-between items-center'>
                <img src={toctocLogo} alt="TocToc Logo" className='max-w-[40px] max-h-[40px] rounded-xl cursor-pointer'/>
                <div className='px2 flex items-center '>
                    <strong className='cursor-pointer border-b-gray-900 hover:border-b'>Cargar</strong>

                    <button className='mx-4 outline-none rounded-[4px] font-bold border-0 border-transparent text-white bg-[rgba(254,44,85,1.0)] hover:bg-[#ce193d] px-2 py-[6px]'>Iniciar sesión</button>

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
                </ul>
            </div>
        </div>
    )
}

export default NavBarTop
