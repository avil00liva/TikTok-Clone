import { deleteDoc, doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

const CommentsProfileModal = ({comment, defaultAvatar, FaRegHeart, AiFillDelete, BsThreeDots, post }) => {
    const [showModal, SetShowModal]=useState(false)

    const showOn = ()=>{
        SetShowModal(!showModal)
    }

    const deleteComments = async ()=> {
        if(comment){
            await deleteDoc(doc(db, "posts", post.id, "comments", comment.id))
        }
    }

  return (
        <div className='flex flex-row items-start mb-4 relative w-full min-h-[60px] p-4'>
            <Link to={ "/profile/" + comment.iduser } onClick={()=>{window.location.href=`/profile/${comment.iduser}`}} className='flex-[0 0 40px] mr-3'>
                <span className='w-10 h-10 inline-block m-0 p-0 relative overflow-hidden whitespace-nowrap rounded-full text-center leading-8 bg-[rgba(136,136,136,0.5)]'>
                    <img src={comment.userImg ? comment.userImg : defaultAvatar} alt="Avatar default" className='w-full h-full object-cover'/>
                </span>
            </Link>
            <div className='flex-[1]'>
                <Link to={ "/profile/" + comment.iduser } onClick={()=>{window.location.href=`/profile/${comment.iduser}`}} className='font-bold text-lg leading-[25px]'>
                    <span>@{comment.username}</span>
                    
                    <span className='hidden text-base text-[rgb(254,44,85)]'>Creador</span>
                </Link>
                <p className='text-base leading-[22px] whitespace-pre-line break-words mb-[6px]'>
                    <span>
                        {comment.comment}
                    </span>
                </p>
                <p className='text-[rgba(22,24,35,0.5)] text-sm leading-5'>
                    <span>2021-10-29</span>
                    <span className='ml-6 cursor-pointer'>Responder</span>
                </p>
                <div className=''>
                    <div className='flex flex-row justify-between relative'>
                        <p className='hidden text-[rgba(22,24,35,0.5)] font-semibold text-sm leading-5 cursor-pointer'>Ver más respuestas (2)
                        </p>
                    </div>
                </div>
            </div>
            <div className='text-[rgba(22,24,35,0.5)] text-xs leading-[17px] w-5 flex flex-col items-center cursor-pointer self-center relative'>
                <div className='text-gray-900 mb-2 relative'>
                    <BsThreeDots className='w-5 h-5 cursor-pointer' onClick={showOn}/>
                    <div className={showModal ? 'navbarTopModal top-4 r-0 absolute flex justify-center items-center' : 'hidden'}>
                        <span className='flex gap-1 items-center font-bold cursor-pointer hover:bg-gray-200 transition-colors duration-200 text-base text-center py-2 px-4' onClick={deleteComments}>
                            <AiFillDelete /> Eliminar
                        </span>
                    </div>
                </div>
                <div>
                    <FaRegHeart className='w-5 h-5 fill-current' />  
                </div>
                <span className='text-xs leading-[17px]'></span>
            </div>
        </div>
    )
};

export default CommentsProfileModal;
