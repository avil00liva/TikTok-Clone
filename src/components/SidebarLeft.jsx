import React from 'react'
import { AiFillHome, AiOutlineVideoCamera } from "react-icons/ai"
import { FiUsers } from "react-icons/fi"


const SidebarLeft = () => {
    return (
        <div className='min-h-screen w-[72px] border-r border-gray-300 laptop:w-[356px] py-6 px-2'>
            <div className='w-full min-h-[100px] p-0 block mb-2'>
                <div>
                    <a href="#" className='flex justify-center items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer'>
                        <AiFillHome className='w-[32px] h-[32px] fill-[rgb(254,44,85)]'/>
                        <h2 className='hidden laptop:block laptop:text-[rgb(254,44,85)] font-bold text-lg leading-[25px] ml-2'>Para ti</h2>
                    </a>
                </div>
                <div>
                    <a href="#" className='flex justify-center items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer'>
                        <FiUsers className='w-[25px] h-[25px]'/>
                        <h2 className='hidden laptop:block text-gray-900 font-bold text-lg leading-[25px] ml-2'>Siguiendo</h2>
                    </a>
                </div>
                <div>
                    <a href="#" className='flex justify-center items-center p-2 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer'>
                        <AiOutlineVideoCamera className='w-[25px] h-[25px]'/>
                        <h2 className='hidden laptop:block text-gray-900 font-bold text-lg leading-[25px] ml-2 uppercase'>live</h2>
                    </a>
                </div>
            </div>
            <div className='py-8 text-[rgba(22,24,35,0.75)] font-semibold text-sm leading-5 relative before:content-[""] before:absolute before:top-0 before:left-2 before:right-2 before:h-[1px] before:bg-[rgba(22,24,35,0.12)] before:transform before:scale-y-50'>
                <p className='hidden laptop:block px-2 text-center text-sm leading-5 text-[rgba(22,24,35,0.75)]'>Cuentas recomendadas</p>
                <div className='p-2 flex flex-row items-center relative rounded-[4px] transition-colors quini:justify-center duration-200 hover:bg-gray-100'>
                    <div className='w-[32px] h-[32px] bg-[rgb(254,44,85)] cursor-pointer rounded-full'></div>
                </div>
                <div className='p-2 flex flex-row items-center relative rounded-[4px] transition-colors quini:justify-center duration-200 hover:bg-gray-100'>
                    <div className='w-[32px] h-[32px] bg-[rgb(44,254,107)] cursor-pointer rounded-full'></div>
                </div>
                <div className='p-2 flex flex-row items-center relative rounded-[4px] transition-colors quini:justify-center duration-200 hover:bg-gray-100'>
                    <div className='w-[32px] h-[32px] bg-[rgb(44,159,254)] cursor-pointer rounded-full'></div>
                </div>
            </div>
        </div>
    )
}

export default SidebarLeft
