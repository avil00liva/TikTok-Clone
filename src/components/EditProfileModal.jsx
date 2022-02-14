import React, { useRef, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { MdSend } from "react-icons/md"
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const EditProfileModal = ({isOpenEdit,setIsOpenEdit}) => {
    const [displayName, setDisplayName]=useState("")
    
    const updateProfileUser = async (e)=> {
        e.preventDefault()
        await updateProfile(auth.currentUser, {
            displayName: displayName
        }).then(()=>{
            console.log("Profile updated!");
        }).catch((err)=>console.log(err))
    }

  return (
    <Transition.Root show={isOpenEdit} as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={()=>setIsOpenEdit(false)}>
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
                    <div className='w-[500px] min-h-[500px] bg-gray-200 inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-md shadow-gray-400 transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full p-2'>
                        <div className='w-full h-full p-4 text-center flex justify-center flex-col'>
                            <h1 className='text-2xl mb-2 border-b py-4'>Editar perfil ✍🏼</h1>
                            <form>
                                <input type="text" placeholder='Display name' className='outline-none border-0 py-1 w-[80%] indent-1 my-3' value={displayName ? displayName : ""} onChange={(e)=>{setDisplayName(e.target.value)}}/>
                                <div className='w-full min-h-[80px] flex justify-around py-4 items-center'>
                                    <button type='submit' className='flex px-5 py-2 bg-pink-500 transition-colors hover:bg-pink-700 items-center gap-2 text-xl text-white rounded-lg cursor-pointer' onClick={updateProfileUser}>Editar <MdSend className='self-end'/> </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>    
  );
};

export default EditProfileModal;
