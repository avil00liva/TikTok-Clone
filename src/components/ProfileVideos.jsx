import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillLock, AiOutlineUser } from "react-icons/ai"
import { db } from '../firebase';
import ProfileVideoComp from './ProfileVideoComp';
import ViewModalVideo from './ViewModalVideo';
import { AiFillHeart } from "react-icons/ai"

const ProfileVideos = ({userid}) => {
    const [clickedVUpload, setClickedVUpload]=useState(true)
    const [clickedVLiked, setClickedVLiked]=useState(false)
    const [posts, setPosts] = useState([])
    const [isPlaying, setIsPlaying] = useState(false)
    const video=useRef()

    const handleVUClicked = ()=>{
        setClickedVUpload(true)
        setClickedVLiked(false)
    }
    const handleVLClicked = ()=>{
        setClickedVLiked(true)
        setClickedVUpload(false)
    }

    const handlePlay = ()=>{
        if(isPlaying) {
            video.current.pause()
        }
    }
    const handleStop = ()=>{
        if(isPlaying) {
            video.current.pause()
        }
    }


    useEffect( ()=>{
        const getPost = async ()=> { onSnapshot(
          query(collection(db, "posts"), where("iduser", "==" , userid.iduser) ,orderBy("timestamp", "desc")),
          (snapshot)=>{
            setPosts(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
          }
          )}
          getPost()
        }, [db])


    return (
        <div className='w-full quini:min-w-[520px] min-h-[500px]'>
            <div className='w-full h-[50px] bg-gray-900 quini:bg-white flex items-center border-b quini:border-gray-300 border-gray-600'>
                <div className={clickedVUpload ? 'flex-[0.5] text-center py-4 quini:py-2 cursor-pointer transition-colors duration-300 quini:hover:bg-gray-100 quini:rounded-md quini:text-black text-gray-200 border-b border-gray-200 quini:border-0 leading-[15px]' : 'flex-[0.5] text-center py-2 cursor-pointer transition-colors duration-300 quini:hover:bg-gray-100 quini:rounded-md text-gray-500'} onClick={handleVUClicked}>
                    <h2 className='font-bold flex items-center justify-center'>
                        Videos
                    </h2>
                </div>
                <div className={clickedVLiked ? 'flex-[0.5] text-center py-4 quini:py-2 cursor-pointer transition-colors duration-300 quini:hover:bg-gray-100 text-gray-200 quini:text-black quini:rounded-md border-b border-gray-200 quini:border-0' : 'flex-[0.5] text-center py-2 cursor-pointer transition-colors duration-300 quini:hover:bg-gray-100 quini:rounded-md text-gray-500'} onClick={handleVLClicked}>
                    <h2 className='hidden font-bold quini:flex items-center justify-center'> <AiFillLock className='mr-1' /> 
                        Ha dicho que le gusta
                    </h2>
                    <h2 className='quini:hidden font-bold flex items-center justify-center'>        
                        <AiFillHeart className='mr-1' /> 
                    </h2>
                </div>
            </div>
           {
            clickedVUpload 
            ?
                <>
                {posts.length === 0 ? 
                    <div className='w-full min-h-[500px] bg-gray-900 quini:bg-white flex items-center justify-center mt-[50px] quini:mt-0'>
                        <div className='flex flex-col items-center justify-center text-center m-auto'>
                            <span className='mb-[10px] text-gray-200 quini:text-gray-400'>
                                <AiOutlineUser className=' w-[120px] h-[120px]' />
                            </span>
                            <p className='block mt-[0.5em] text-gray-200 quini:text-black  font-bold'>Carga tu primer video</p>
                            <p className='block mt-[0.5em] text-gray-200 quini:text-black '>Tus videos aparecerán aquí</p>
                        </div> 
                    </div>
                        :
                        <div className='w-full min-h-[500px] bg-gray-900 quini:bg-white flex flex-wrap py-4 justify-start items-start'>
                            {posts.map((post)=>{
                                return (
                                    <ProfileVideoComp key={post.iduser,post.timestamp} handlePlay={handlePlay} post={post} setIsPlaying={setIsPlaying} handleStop={handleStop} isPlaying={isPlaying} />
                                )
                            }) 
                            }
                        </div> 
                
                }
                </>
            :
            (<div className='w-full min-h-[500px] bg-gray-900 tablet:bg-white flex items-center justify-center'>
                <div className='flex flex-col items-center justify-center text-center m-auto'>
                    <span className='mb-[10px] text-gray-400'>
                        <AiOutlineUser className=' w-[120px] h-[120px]' />
                    </span>
                    <p className='block mt-[0.5em] tablet:text-black text-gray-200 font-bold'>Aún no hay videos que hayan recibido me gusta</p>
                    <p className='block mt-[0.5em] tablet:text-black text-gray-200'>Aquí aparecerán los videos que te hayan gustado</p>
                </div>
            </div>)
           }
        </div>
    );
};

export default ProfileVideos;




/*           {posts.filter(post => post.id === posts[post.id]?.id).map(filteredPost =>{
    return (
        <ViewModalVideo isOpen={isOpen} setIsOpen={setIsOpen} {...filteredPost} />
    )
})}*/