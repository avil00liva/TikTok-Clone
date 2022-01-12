import React from 'react'
import { AiOutlineUser } from "react-icons/ai"
import { BiCommentMinus } from "react-icons/bi"
import { MdAdd } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import { GoHome } from "react-icons/go"



const NavbarBottom = ({ addTik, newTiktok }) => {
    const menuI = [
        {
            item: "Inicio",
            icon: <a href="/" className='flex items-center justify-center'> <GoHome className='self-center text-2xl'/> </a> 
        },
        {
            item: "Tendencias",
            icon: <FiSearch className='self-center text-2xl'/>
        },
        {
            item: "",
            icon: <div className='self-center flex items-center justify-center text-3xl w-[50px] h-[40px] border border-pink-500  bg-gray-200 rounded-lg text-gray-900' onClick={newTiktok}> <MdAdd /> </div>
        },
        {
            item: "Bandeja de entrada",
            icon: <BiCommentMinus className='self-center text-2xl'/>
        },
        {
            item: "Perfil",
            icon: <AiOutlineUser className='self-center text-2xl'/>
        }
    ]
    return (
        <div className={addTik ? "addTextTrue" : "addTextFalse"}>
            {menuI.map((elm, index)=>{
                return (
                    <div key={index} className='transition hover:text-gray-400 w-14 h-14 flex flex-col gap-1 justify-center cursor-pointer'>
                        {elm.icon}
                        <p className='font-bold text-sm truncate whitespace-nowrap text-center'>{elm.item}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default NavbarBottom
