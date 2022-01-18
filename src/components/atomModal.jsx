import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Comment from './Comment'
import avatarDefault from "../assets/10.png"
import { FaRegHeart } from "react-icons/fa"

const AtomModal = ({isOpen, setIsOpen}) => {

    return (
        <>
            <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={()=>setIsOpen(false)}>
                <div className='flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
                    </Transition.Child>
    
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                    <div className='inline-block align-bottom bg-[#eee] rounded-2xl text-left overflow-hidden shadow-md shadow-gray-400 transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full'>
                        <div className='flex items-center px-1.5 py-2 border-b border-gray-700'>
                            <div className='w-[550px] h-[550px] bg-[#eee] rounded-lg relative'>
                                <h1 className='p-2 text-xl text-gray-800 flex justify-center items-center text-center'>Comments ✍🏼</h1>
                                <div className='w-full min-h-[calc(500px-55px)] h-[calc(500px-55px)] p-2 bg-gray-200 overflow-auto'>
                                    <div className='flex flex-row items-start mb-4 relative w-full min-h-[60px] p-4'>
                                        <a href="#" className='flex-[0 0 40px] mr-3'>
                                            <span className='w-10 h-10 inline-block m-0 p-0 relative overflow-hidden whitespace-nowrap rounded-full text-center leading-8 bg-[rgba(136,136,136,0.5)]'>
                                                <img src={avatarDefault} alt="Avatar default" className='w-full h-full object-cover'/>
                                            </span>
                                        </a>
                                        <div className='flex-[1]'>
                                            <a href="#" className='font-bold text-lg leading-[25px]'>
                                                <span>Juan Bonora</span>
                                                .
                                                <span className='text-base text-[rgb(254,44,85)]'>Creador</span>
                                            </a>
                                            <p className='text-base leading-[22px] whitespace-pre-line break-words mb-[6px]'>
                                                <span>Insta: juanbonoraa👈🏼🔥</span>
                                            </p>
                                            <p className='text-[rgba(22,24,35,0.5)] text-sm leading-5'>
                                                <span>2021-10-29</span>
                                                <span className='ml-6 cursor-pointer'>Responder</span>
                                            </p>
                                            <div className=''>
                                                <div className='flex flex-row justify-between relative'>
                                                    <p className='text-[rgba(22,24,35,0.5)] font-semibold text-sm leading-5 cursor-pointer'>Ver más respuestas (2)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-[rgba(22,24,35,0.5)] text-xs leading-[17px] w-5 flex flex-col items-center cursor-pointer self-center'>
                                            <div>
                                                <FaRegHeart className='w-5 h-5 fill-current' />  
                                            </div>
                                            <span className='text-xs leading-[17px]'>94</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full h-[50px] bg-[#eee] relative p-4 flex items-center '>
                                    <input type="text" className='w-full h-[30px] rounded-lg border-4 border-gray-700 outline-none px-2 text-sm' />
                                </div>
                            </div>
                        </div>
                    </div>
                    </Transition.Child>
                </div>
            </Dialog>
            </Transition.Root>
        </> 
    )
}

export default AtomModal
