import React, { useEffect, useRef, useState } from 'react'
import avatarUser from "../assets/10.png"
import { HiBadgeCheck } from "react-icons/hi"
import { BsMusicNoteBeamed } from "react-icons/bs"
import { FaPlay,FaCommentDots, FaPause } from "react-icons/fa"
import { AiFillHeart } from "react-icons/ai"
import { RiShareForwardFill } from "react-icons/ri"
import AtomModal from './atomModal'
import diskDefault from "../assets/default-disk.png"
import { db, auth, provider } from "../firebase"
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { signInWithPopup } from 'firebase/auth'
import { Link } from 'react-router-dom'
import ViewModalVideo from './ViewModalVideo'
import { usePosts } from '../context/PostsFBContext'


const ContentFeed = ({isAuth, setIsAuth, id, iduser, timestamp, src, image, song, description, userImg, username, comments, shares}) => {
    const video=useRef()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isOpen, setIsOpen]=useState(false)
    const [likesDoc, setLikesDoc] = useState([])
    const [liked, setLiked] = useState(false)
    const [Statecomments, setStateComments]=useState([])
    const [commented, setCommented]=useState("")
    const [isFollowed, setIsFollowed] = useState(false)
    const [followUser, setFollowUser] = useState([])

    const handleModal=()=>{
        setIsOpen(!isOpen)
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
        setCommented(Statecomments.findIndex((comment)=> comment.id === auth?.currentUser?.uid) !== -1)
    },[Statecomments])

    const deleteComments = async ()=> {
        if(Statecomments){
            await deleteDoc(doc(db, "posts", id, "comments", auth?.currentUser?.uid))
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
        setLiked(likesDoc.findIndex((like)=> like.id === auth?.currentUser?.uid) !== -1)
    },[likesDoc])

    const likePost = async ()=> {
        if(isAuth){
            if(liked){
                await deleteDoc(doc(db, "posts",id,"likes", auth?.currentUser?.uid))
            } else {
                await setDoc(doc(db, "posts",id,"likes", auth?.currentUser?.uid), {
                    username: auth.currentUser.displayName.split(" ").join("").toLocaleLowerCase(),
                    iduser: auth.currentUser.uid,
                    postId: iduser,
                    userImg: auth.currentUser.photoURL,
                    timestamp: serverTimestamp()             
                })
            }}
        else {
            return signInWithGoogle()
        }
    }

    useEffect(
        () =>
          onSnapshot(collection(db, "usuarios", iduser, "followers"), (snapshot) =>
            setFollowUser(snapshot.docs)
          ),
        [db, iduser]
      );
    
      useEffect(()=>{
          setIsFollowed(followUser.findIndex((follow)=> follow.id === auth?.currentUser?.uid) !== -1)
      },[followUser])
    
    const followUserAction = async ()=> {
        if(isAuth){
            if(isFollowed){
                await deleteDoc(doc(db, "usuarios",iduser,"followers", auth.currentUser.uid))
            } else {
                await setDoc(doc(db, "usuarios",iduser,"followers", auth.currentUser.uid), {
                    username: auth.currentUser.displayName.split("").join("").toLocaleLowerCase(),
                    iduser: auth.currentUser.uid,
                    followId: iduser,
                    userImg: auth.currentUser.photoURL,
                    timestamp: serverTimestamp()
                })
            }}
        else {
            return signInWithGoogle()
        }
    }


    const signInWithGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
          localStorage.setItem("isAuth", true);
          setIsAuth(true);
        });
      };

    return (
        <div className='w-[692px] quini:max-w-[398px] laptop:max-w-[692px] min-h-screen flex flex-col justify-start items-center py-6 relative mr-4 ml-4' key={username, id }>
            <div className='w-full max-w-[592px] flex flex-row items-start py-5 relative after:content-[""] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[1px] after:transform after:scale-y-50 after:bg-[rgba(22,24,35,0.2)]'>
                <a href="#" className='flex-[0 0 auto]'>
                    <div className='w-[56px] h-[56px] relative bg-[rgba(136,136,136,0.5)] rounded-full overflow-hidden'>
                        <img src={userImg ? userImg  : avatarUser} alt="Avatar de usuario" referrerPolicy='no-referrer' className='w-full h-full cursor-pointer object-cover'/>
                    </div>
                </a>
                <div className='ml-3 w-full'>
                    <div className='laptop:mr-[110px] quini:mr-0'>
                        <div className='flex flex-row items-center justify-between'>
                            <Link to={ "/profile/" + iduser } className='block flex-grow flex-1 laptop:flex laptop:items-center'>
                                <h3 className='flex items-center text-ellipsis overflow-hidden whitespace-nowrap mr-1 font-bold text-lg'>
                                    {username} <HiBadgeCheck className="text-[#29b6f6] ml-1" />
                                </h3>
                                <h4 className='block leading-5 text-ellipsis overflow-hidden whitespace-nowrap font-normal text-sm'>@{username}</h4>
                            </Link>
                            {iduser === auth?.currentUser?.uid 
                                ? 
                                ""
                                : 
                                  <>
                                  {isFollowed 
                                    ?
                                    <> 
                                    {isAuth 
                                        ?
                                            <button className='outline-none border rounded-[4px] bg-[rgba(254,44,85,1.0)] border-[rgba(254,44,85,1.0)] text-white text-base leading-[22px] font-semibold cursor-pointer px-2 py-[6px] transition-colors duration-200 hover:bg-[#d43152] hover:text-white' onClick={followUserAction}>
                                                Siguiendo
                                            </button>
                                        :
                                            <button className='outline-none border rounded-[4px] text-[rgba(254,44,85,1.0)] border-[rgba(254,44,85,1.0)] bg-white text-base leading-[22px] font-semibold cursor-pointer px-2 py-[6px] transition-colors duration-200 hover:bg-[rgba(254,44,85,1.0)] hover:text-white' onClick={followUserAction}>
                                                Seguir
                                            </button>
                                    }
                                    </>
                                    : 
                                    
                                    <button className='outline-none border rounded-[4px] text-[rgba(254,44,85,1.0)] border-[rgba(254,44,85,1.0)] bg-white text-base leading-[22px] font-semibold cursor-pointer px-2 py-[6px] transition-colors duration-200 hover:bg-[rgba(254,44,85,1.0)] hover:text-white' onClick={followUserAction}>
                                        Seguir
                                    </button>
                                  }
                                  </>
                                }
                        </div>
                        <div className='text-base leading-[22px] flex flex-wrap'>
                            <span className='font-normal mx-1 quini:w-full laptop:w-auto'>
                                {description}
                            </span>
                            <a href="#" className='font-bold text-gray-900 hover:border-b hover:border-b-gray-900 mx-1'></a>
                            <span></span>
                            <a href="#" className='font-bold text-gray-900 hover:border-b hover:border-b-gray-900 mx-1'></a>
                            <span></span>
                            <a href="#" className='font-bold text-gray-900 hover:border-b hover:border-b-gray-900 mx-1'></a>
                            <span></span>
                        </div>
                        <h4 className='quini:max-w-[250px] laptop:w-full text-ellipsis laptop:overflow-visible overflow-hidden whitespace-nowrap w-full font-semibold leading-[22px] mt-1 mb-3 flex items-center gap-1'>
                            <a href="#" className='font-bold hover:border-b hover:border-b-gray-900'>
                                {song}
                            </a>
                            <img src={diskDefault} alt="picture" className='w-[20px] h-[20px] rounded-full animate-spin' />
                        </h4>
                    </div>
                    <div className='flex items-end flex-row'>
                        <div className='quini:h-[calc(380px+(100vw-480px)/288*20)] laptop:w-[281px] quini:w-[230px] laptop:h-[calc(450px+(100vw-768px)/1152*100)] relative bg-[#eee] cursor-pointer rounded-lg overflow-hidden mr-5 '> 
                            <video src={image || src} controls={false} loop className='w-full h-full object-fill absolute top-0 left-0' ref={video} onClick={handlePlay}/>
                            {isPlaying ? <FaPause className="absolute text-3xl z-[7] self-center left-[10%] bottom-[5%] text-[#eeeeee99]" onClick={handlePlay}/> : <FaPlay className={`${isPlaying ? "hidden" : "absolute text-3xl z-[7] self-center left-[10%] bottom-[5%] text-[#eeeeee99] "} `} onClick={handlePlay}/>}
                        </div>
                        <div className='flex flex-col'>
                            <button className='border-0 outline-none bg-none p-0 flex relative items-center flex-col cursor-pointer' onClick={(e) => {
                                e.stopPropagation();
                                likePost();
                                }}>
                                <span className={liked ? "text-pink-500 quini:w-[32px] quini:h-[32px] laptop:w-[48px] laptop:h-[48px] laptop:p-0 p-[6px] flex justify-center items-center rounded-full mt-2 mb-[6px] bg-[rgba(22,24,35,0.06)] transition-colors duration-200 hover:bg-[rgba(22,24,35,0.08)]" : 'quini:w-[32px] quini:h-[32px] laptop:w-[48px] laptop:h-[48px] laptop:p-0 p-[6px] flex justify-center items-center rounded-full mt-2 mb-[6px] bg-[rgba(22,24,35,0.06)] transition-colors duration-200 hover:bg-[rgba(22,24,35,0.08)]'}>
                                    <AiFillHeart className='w-[20px] h-[20px]'/>
                                </span>
                                {likesDoc.length > 0 && (<strong className='text-[rgba(22,24,35,0.75) text-[12px] leading-4 text-center'>{likesDoc.length}</strong>)}
                            </button>
                            <button className='border-0 outline-none bg-none p-0 flex relative items-center flex-col cursor-pointer'>
                                <span className='quini:w-[32px] quini:h-[32px] laptop:w-[48px] laptop:h-[48px] laptop:p-0 p-[6px] flex justify-center items-center rounded-full mt-2 mb-[6px] bg-[rgba(22,24,35,0.06)] transition-colors duration-200 hover:bg-[rgba(22,24,35,0.08)]'>
                                    <FaCommentDots className='w-[20px] h-[20px]' onClick={handleModal} />
                                </span>
                                {Statecomments.length > 0 && (<strong className='text-[rgba(22,24,35,0.75) text-[12px] leading-4 text-center'>{Statecomments.length}</strong>)}
                            </button>
                            <button className='border-0 outline-none bg-none p-0 flex relative items-center flex-col cursor-pointer'>
                                <span className='quini:w-[32px] quini:h-[32px] laptop:w-[48px] laptop:h-[48px] laptop:p-0 p-[6px] flex justify-center items-center rounded-full mt-2 mb-[6px] bg-[rgba(22,24,35,0.06)] transition-colors duration-200 hover:bg-[rgba(22,24,35,0.08)]'>
                                    <RiShareForwardFill className='w-[20px] h-[20px]'/>
                                </span>
                                <strong className='text-[rgba(22,24,35,0.75) text-[12px] leading-4 text-center'>1.2K</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AtomModal isOpen={isOpen} setIsOpen={setIsOpen} id={id} Statecomments={Statecomments}/>

        </div>
    )
}

export default ContentFeed
