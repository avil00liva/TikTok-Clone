import React, { useEffect, useRef, useState } from 'react'
import avatarDefault from "../assets/10.png"
import diskDefault from "../assets/default-disk.png"
import { HiMusicNote } from "react-icons/hi"
import { FaPlay } from "react-icons/fa"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { FaCommentDots, FaUserCheck } from "react-icons/fa"
import { RiShareForwardFill } from "react-icons/ri"
import { BsThreeDots, BsFillTrashFill } from "react-icons/bs"
import { BiLogIn } from "react-icons/bi"
import { db } from '../firebase'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore'
import Comment from './Comment'
import { auth, provider } from "../firebase"
import { signInWithPopup, signOut } from "firebase/auth"


const VideoPlayer = ({isAuth,setIsAuth,id, timestamp, src, image, song, description, userImg, username, comments, shares}) => {
    const [menuTiktok, setMenuTiktok] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [likesDoc, setLikesDoc] = useState([])
    const [liked, setLiked] = useState(false)
    const [Statecomments, setStateComments]=useState([])
    const [commented, setCommented]=useState("")
    const video=useRef()

    //!user?.photoURL ? photoDefault : user?.photoURL
    
    const mostrarComment = ()=>{
        setShowComments(!showComments)
    }

    const showMenuTiktok = ()=> {
        setMenuTiktok(!menuTiktok)
    }

    const handlePlay = ()=> {
        if(isPlaying) {
            video.current.pause()
        } else {
            video.current.play()
        }

        setIsPlaying(!isPlaying)
    }

    useEffect(
        () =>
          onSnapshot(
            query(
              collection(db, "posts", id, "comments"),
              orderBy("timestamp", "desc")
            ),
            (snapshot) => {setStateComments(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))}
          ),
        [db, id]
      );

    useEffect(()=>{
        setCommented(Statecomments.findIndex((comment)=> comment.id === id) !== -1)
    },[Statecomments])

    const deleteComments = async ()=> {
        if(Statecomments){
            await deleteDoc(doc(db, "posts", id, "comments", id))
        }
    }
  
    useEffect(
        () =>
          onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
            setLikesDoc(snapshot.docs)
          ),
        [db, id]
      );

    useEffect(()=>{
        setLiked(likesDoc.findIndex((like)=> like.id === id) !== -1)
    },[likesDoc])

    const likePost = async ()=> {
        if(liked){
            await deleteDoc(doc(db, "posts",id,"likes", id))
        } else {
            await setDoc(doc(db, "posts",id,"likes", id), {
                username: id + timestamp,
            })
        }
    }
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

    return (
        <div className='w-full min-h-full relative' key={username, id }>
            <video 
            src={image || src} 
            loop
            controls={false}
            ref={video}
            onClick={handlePlay}
            className='w-full min-h-screen z-[1]'
            />
            <FaPlay className={`${isPlaying ? "hidden" : "absolute text-5xl z-[7] self-center left-[40%] top-[40%] text-pink-500 "} `} onClick={handlePlay}/>
            <ul className='absolute text-xl flex flex-col items-center
            py-8 top-[5%] right-0 mr-1 gap-2'>
                <div className='w-[50px] h-[50px] rounded-full border-1 border-pink-600 overflow-hidden mb-1'>
                    <img src={userImg ? userImg  : avatarDefault } alt="User avatar" />
                </div>
                <li className='flex flex-col items-center justify-between text-xl text-gray-200 font-bold' onClick={(e) => {
                    e.stopPropagation();
                    likePost();
                    }}>
                    <strong className='mt-2 text-2xl cursor-pointer text-gray-200 transition-colors duration-200 hover:text-gray-400'>
                        <AiFillHeart className={liked ? "text-pink-400" : "text-4xl cursor-pointer text-gray-200 transition-colors duration-200 hover:text-gray-400" } />
                    </strong> 
                    {likesDoc.length > 0 && ( <span
                        className={`group-hover:text-pink-600 text-xl ${
                        liked && "text-pink-500"
                        }`}
                    >
                        {likesDoc.length}
                    </span>
                    )}
                </li>
                <li className='flex flex-col items-center justify-between text-xl text-gray-200'>
                    <strong className='text-2xl cursor-pointer text-gray-200 transition-colors duration-200 hover:text-gray-400'>
                        <FaCommentDots onClick={mostrarComment}/>
                    </strong> 
                    {Statecomments.length > 0 && ( <span className='text-xl'>
                            {Statecomments.length}
                        </span>)}
                </li>
                <li className='flex flex-col items-center justify-between text-xl text-gray-200'>
                    <strong className='text-2xl cursor-pointer text-gray-200 transition-colors duration-200 hover:text-gray-400'>
                        <RiShareForwardFill />
                    </strong> 
                    {shares}
                </li>
            </ul>
            <div className='text-gray-200 w-full min-h-[60px] absolute z-[8] bottom-32 left-0 p-4'>
                @{username}
                <br />
                {description}
                <div className='w-full flex items-center justify-between py-2'>
                    <div className='flex-[0.8] flex items-center gap-3 text-gray-200 overflow-hidden'>
                       <HiMusicNote className='text-2xl' /> 
                       <p className='truncate text-lg'>
                        {song}
                       </p>
                    </div> 
                    <img src={diskDefault} alt="picture" className='w-[50px] h-[50px] rounded-full animate-spin' />
                </div>
            </div>
            <div className='top-0 left-0 w-full min-h-[30px] bg-transparent absolute z-[7] py-2 px-4'>
                <BsThreeDots className="transition-colors hover:text-blue-400 float-right text-white text-2xl cursor-pointer" onClick={showMenuTiktok} />
                <div className={menuTiktok ? "menuTiktokActive" : "menuTiktok"} onClick={showMenuTiktok}>
                    <p className='bg-gray-400 mb-2 text-lg rounded-full text-white cursor-pointer flex items-center justify-center' onClick={(e) => {
                        e.stopPropagation();
                        deleteDoc(doc(db, "posts", id))
                        setReLoad({})
                    }}>
                        Delete video <BsFillTrashFill className='ml-2 text-red-500' />
                    </p>
                    {!isAuth ? (
                        <p className='bg-gray-400 text-lg rounded-full text-white cursor-pointer flex items-center justify-center' onClick={signInWithGoogle}>
                            Iniciar sesión <FaUserCheck className='ml-2 text-pink-500' />
                        </p>) : (
                        
                        <p className='bg-gray-400 text-lg rounded-full text-white cursor-pointer flex items-center justify-center' onClick={signUserOut}>
                            Cerrar sesión <BiLogIn className='ml-2 text-pink-500' />
                        </p>
                    )}

                </div> 
            </div>
            <Comment showComments={showComments} deleteComments={deleteComments} comments={Statecomments} mostrarComment={mostrarComment} id={id} />          
        </div>
    )
}

export default VideoPlayer
