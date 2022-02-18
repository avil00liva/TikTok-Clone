import React, { useEffect, useState } from 'react'
import { AiFillDelete, AiFillCloseCircle } from "react-icons/ai"
import { MdSend } from "react-icons/md"
import { BsFillPlusCircleFill } from "react-icons/bs"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db,auth } from '../firebase'

const Comment = ({mostrarComment, showComments, id, comments, deleteComments, iduser}) => {
    const [user, setUser]=useState("")
    const [content, setContent]=useState("")
    const [display, setDisplay]=useState(false)

    const desplegar = ()=> {
        setDisplay(!display)
    }

    const sendComment = async (e) => {
        e.preventDefault();
    
        await addDoc(collection(db, "posts", id, "comments"), {
          comment: content,
          username: auth.currentUser.displayName.split(" ").join("").toLocaleLowerCase(),
          userImg: auth.currentUser.photoURL,
          iduser: auth.currentUser.uid,
          postId: iduser,
          timestamp: serverTimestamp(),
        });
    

        setContent("");
        setUser("")
        setDisplay(false)
      };

    return (
        <div className={showComments ? 'addComment' : 'addCommentFalse'} >
            <h1 className='p-4 text-xl mb-2 text-gray-200 flex justify-between items-center'>Comments ✍🏼 <AiFillCloseCircle className='text-pink-500 cursor-pointer mr-3 text-3xl' onClick={mostrarComment} /> </h1>
            <div className='bg-gray-900 w-full h-[400px] overflow-auto p-2'>
            {comments.map((comment, index)=>{
                return (
                    <div className='toggleComment' key={index}>
                        <h3 className='text-pink-500'>@{comment.username}</h3>
                        <p className='text-gray-200'>{comment.comment}</p>
                        <AiFillDelete className='text-red-600 text-2xl m-2 cursor-pointer self-end'/>
                    </div>
                    )
                })
            }
            </div>
            <BsFillPlusCircleFill className='text-pink-500 text-3xl m-2 mt-8 float-right cursor-pointer transition-colors duration-200 hover:text-pink-700' onClick={desplegar}/>

            <form className={display ? 'toggleAddComment' : 'toggleAddCommentFalse'}>
                {/*<input type="text" placeholder='Nickname' className='outline-none border-0 py-1 w-[80%] indent-1 my-3' value={user ? user : ""} onChange={(e)=>{setUser(e.target.value)}}/>*/}
                <textarea className='outline-none border border-transparent w-[80%] min-h-[150px] indent-1 py-1 my-3' placeholder='Add a comment...' value={content ? content : ""} onChange={(e)=>{setContent(e.target.value)}}></textarea>
                <div className='w-full min-h-[80px] flex justify-around py-4 items-center'>
                    <button type='submit' className='flex px-5 py-2 bg-pink-500 transition-colors hover:bg-pink-700 items-center gap-2 text-xl text-white rounded-lg cursor-pointer' onClick={sendComment}>Cargar <MdSend className='self-end'/> </button>
                </div>
            </form>
        </div>
    )
}

export default Comment