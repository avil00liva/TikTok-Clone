import { Dialog, Transition } from '@headlessui/react';
import React, { useRef, useState, Fragment, useEffect } from 'react'
import { FaPlay, FaCommentDots, FaRegHeart } from "react-icons/fa"
import { HiBadgeCheck, HiOutlineCode } from "react-icons/hi"
import { AiFillHeart, AiOutlineWhatsApp, AiFillDelete } from "react-icons/ai"
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs"
import diskDefault from "../assets/default-disk.png"
import defaultAvatar from "../assets/10.png"
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, provider } from '../firebase';
import CommentsProfileModal from './CommentsProfileModal';
import { signInWithPopup } from 'firebase/auth';


const ViewModalVideo = ({isOpen, setIsOpen, post}) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [likesDoc, setLikesDoc] = useState([])
    const [liked, setLiked] = useState(false)
    const [Statecomments, setStateComments]=useState([])
    const [commented, setCommented]=useState("")
    const [content, setContent]=useState("")
    const [isAuth, setIsAuth]=useState(localStorage.getItem("isAuth"))
    const video=useRef()

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
              collection(db, "posts", post.id, "comments"),
              orderBy("timestamp", "desc")
            ),
            (snapshot) => {setStateComments(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))}
          ),
        [db, post.id]
      );
    
      useEffect(()=>{
        setCommented(Statecomments.findIndex((comment)=> comment.id === auth?.currentUser?.uid) !== -1)
    },[Statecomments])

    const sendComment = async (e) => {
        e.preventDefault();
    
        await addDoc(collection(db, "posts", post.id, "comments"), {
          comment: content,
          username: auth.currentUser.displayName.split(" ").join("").toLocaleLowerCase(),
          userImg: auth.currentUser.photoURL,
          postId: post?.iduser,
          iduser: auth.currentUser.uid,
          timestamp: serverTimestamp(),
        });
    
        setContent("")
    };

    useEffect(
        () =>
          onSnapshot(collection(db, "posts", post.id, "likes"), (snapshot) =>
            setLikesDoc(snapshot.docs)
          ),
        [db, post.id]
      );

    useEffect(()=>{
        setLiked(likesDoc.findIndex((like)=> like.id === auth?.currentUser?.uid) !== -1)
    },[likesDoc])

    const likePost = async ()=> {
        if(isAuth){
            if(liked){
                await deleteDoc(doc(db, "posts",post.id,"likes", auth.currentUser.uid))
            } else {
                await setDoc(doc(db, "posts",post.id,"likes", auth.currentUser.uid), {
                    username: auth.currentUser.displayName.split(" ").join("").toLocaleLowerCase(),
                    iduser: auth.currentUser.uid,
                    postId: post?.iduser,
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
    <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={()=>setIsOpen(false)}>
            <div className='flex items-start justify-center min-h-[800px] sm:min-h-screen tablet:pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
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
                    <div className='quini:w-[90%] quini:min-h-[90vh] laptop:w-[90%] bg-gray-200 inline-block align-bottom tablet:rounded-2xl text-left overflow-hidden shadow-md shadow-gray-400 transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full'>
                        <div className='w-full h-[90vh] flex relative flex-wrap tablet:flex-nowrap overflow-y-auto'>
                            <div className='w-full h-full border-r border-gray-500 relative overflow-hidden bg-[#26262699]'>
                                <video 
                                    src={post.src}
                                    loop
                                    controls={false}
                                    ref={video}
                                    onClick={handlePlay}
                                    className='w-full h-full max-h-full z-[1] cursor-pointer top-0 left-0 object-contain absolute'
                                />
                                <FaPlay className={`${isPlaying ? "hidden" : "absolute text-5xl z-[7] self-center left-[45%] top-[40%] text-pink-500 opacity-80 "} `} onClick={handlePlay}/>
                            </div>
                            <div className='w-full h-full bg-white px-4 flex flex-col'>
                                <div className='w-full min-h-[50px] mt-6 flex justify-start items-center'>
                                    <img src={post.userImg} alt="Avatar user" className='w-[50px] h-[50px] rounded-full mr-2' />
                                    <div className='flex flex-row items-center justify-between w-full'>
                                        <div className='flex flex-col justify-start items-start'>
                                            <h3 className='flex items-center text-ellipsis overflow-hidden whitespace-nowrap mr-1 font-bold text-lg'>
                                                {post.username} <HiBadgeCheck className="text-[#29b6f6] ml-1" />
                                            </h3>
                                            <h4 className='block leading-5 text-ellipsis overflow-hidden whitespace-nowrap font-normal text-sm'>
                                                @{post.username}
                                            </h4>
                                        </div>
                                        <button className='outline-none border rounded-[4px] text-[rgba(254,44,85,1.0)] border-[rgba(254,44,85,1.0)] bg-white text-base leading-[22px] font-semibold cursor-pointer px-4 text-center py-[6px] transition-colors duration-200 hover:bg-[rgba(254,44,85,1.0)] hover:text-white'>Seguir</button>
                                    </div>
                                </div>
                                <p className='my-2 mb-4 font-bold cursor-pointer'>
                                    {post.description}
                                </p>
                                <h4 className='quini:max-w-[250px] laptop:w-full text-ellipsis laptop:overflow-visible overflow-hidden whitespace-nowrap w-full font-semibold leading-[22px] mt-1 mb-4 flex items-center gap-1'>
                                    <a href="#" className='font-bold hover:border-b hover:border-b-gray-900'>
                                        {post.song}
                                    </a>
                                    <img src={diskDefault} alt="picture" className='w-[20px] h-[20px] rounded-full animate-spin' />
                                </h4>
                                <div className='w-full min-h-[30px] flex flex-row items-center mt-2'>
                                    <div className='w-full h-full flex flex-row items-center justify-start'>
                                        <button className='border-0 solid border-transparent bg-none outline-none p-0 relative flex items-center cursor-pointer flex-row' onClick={(e) => {
                                            e.stopPropagation();
                                            likePost()
                                        }}>
                                            <span className='flex justify-center items-center w-[32px] h-[32px] rounded-full transition-all duration-300 bg-[rgba(22,24,35,0.06)] p-[6px] mr-[6px] hover:bg-[rgba(22,24,35,0.28)]'>
                                                <AiFillHeart className={liked ? 'text-pink-400 w-5 h-5' : 'w-5 h-5'} />
                                            </span>
                                            {likesDoc.length > 0 && 
                                                <strong className='text-[rgba(22,24,35,0.75)] text-xs text-center'>
                                                    {likesDoc.length}
                                                </strong>
                                            }
                                        </button>
                                        <button className='border-0 solid border-transparent bg-none outline-none p-0 relative flex items-center cursor-pointer flex-row ml-5'>
                                            <span className='flex justify-center items-center w-[32px] h-[32px] rounded-full transition-all duration-300 bg-[rgba(22,24,35,0.06)] p-[6px] mr-[6px]'>
                                                <FaCommentDots className='w-5 h-5' />
                                            </span>
                                            {Statecomments.length > 0 && (
                                                    <strong className='text-[rgba(22,24,35,0.75)] text-xs text-center'>
                                                        {Statecomments.length}
                                                    </strong>
                                                )}
                                        </button>
                                    </div>
                                    <div className='flex items-center flex-row w-full text-sm'>
                                        <p className='block'>Compartir en</p>
                                        <a href="#" className='flex items-center justify-center ml-2 w-[30px] h-[30px] bg-green-500 text-white rounded-full '>
                                            <AiOutlineWhatsApp className='w-[20px] h-[20px]' />
                                        </a>
                                        <a href="#" className='flex items-center justify-center ml-2 w-[30px] h-[30px] bg-gray-700 text-white rounded-full '>
                                            <HiOutlineCode className='w-[20px] h-[20px]' />
                                        </a>
                                    </div>
                                </div>
                                <div className='text-[rgba(22,24,35,0.75)] text-sm leading-5 flex flex-row mt-4 box-border border border-[rgba(22,24,35,0.12)] rounded-sm mb-4'>
                                    <p className='text-ellipsis overflow-hidden whitespace-nowrap pt-[7px] pr-0 pb-[5px] pl-3 bg-[rgba(22,24,35,0.06)]'>
                                        http://localhost:3000/profile/SmKZX4zfgXMmdBzwpXdRNlIMkOp2
                                    </p>
                                    <button className='border-none bg-none outline-none text-[rgba(22,24,35)] font-bold flex-[auto] cursor-pointer py-[7px] px-[18px] flexauto'>
                                        Copiar enlace
                                    </button>
                                </div>
                                <div className='w-full min-h-[100px] border-y border-gray-400 py-4 flex-grow justify-start items-start overflow-auto relative h-[250px]'>

                                    <div className='flex flex-row items-start mb-4 relative w-full min-h-[60px] p-4'>
                                        <a href="#" className='flex-[0 0 40px] mr-3'>
                                            <span className='w-10 h-10 inline-block m-0 p-0 relative overflow-hidden whitespace-nowrap rounded-full text-center leading-8 bg-[rgba(136,136,136,0.5)]'>
                                                <img src={post.userImg} alt="Avatar default" className='w-full h-full object-cover'/>
                                            </span>
                                        </a>
                                        <div className='flex-[1]'>
                                            <a href="#" className='font-bold text-lg leading-[25px]'>
                                                <span>@{post.username}</span>
                                                .
                                                <span className='text-base text-[rgb(254,44,85)]'>Creador</span>
                                            </a>
                                            <p className='text-base leading-[22px] whitespace-pre-line break-words mb-[6px]'>
                                                <span>Insta: agustinnoliva👈🏼🔥</span>
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


                                    {Statecomments.map((comment, index)=>{
                                        return (
                                            <CommentsProfileModal comment={comment} index={index} FaRegHeart={FaRegHeart} AiFillDelete={AiFillDelete} defaultAvatar={defaultAvatar} BsThreeDots={BsThreeDots} key={index,comment.username,comment.timestamp} post={post}/>
                                        )
                                    })}
                                    
                                </div>
                                <div className='flexauto bg-white tablet:mx-[30px] px-0 py-[21px]'>
                                    <div className='flex flex-row items-end'>
                                        <div className='flexauto1'>
                                            <div className='relative flex flex-row items-end bg-[rgba(22,24,35,0.06)] box-border border solid border-transparent rounded-lg py-0 px-[9px]'>
                                                <div className='flexauto1 h-auto my-[10px] mr-2 ml-0'>
                                                    <input type="text" 
                                                            placeholder='Añadir comentario...' 
                                                            onChange={(e)=>{setContent(e.target.value)}}
                                                            maxLength={150} 
                                                            value={content ? content : ""} 
                                                            className='flex-1 w-full text-sm outline-none border-0 solid border-transparent bg-transparent block overflowinput' 
                                                        />
                                                </div>
                                                <div className='flexcustomcomment w-8 h-8 p-[5px] m-[3px] cursor-pointer bg-transparent rounded-lg transition-colors duration-200 hover:bg-gray-400'>
                                                    <BsEmojiSmile className='w-full h-full' />
                                                </div>
                                            </div>
                                        </div>
                                        <button className='text-[rgba(22,24,35,0.34)] text-sm flexbtn text-center mr-1 leading-[39px]outline-none border-0 solid border-transparent bg-gray-200 px-5 py-3 rounded-tr-lg rounded-br-lg transition-colors duration-200 hover:bg-gray-300' onClick={sendComment}>Publicar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>
    );
};

export default ViewModalVideo;
