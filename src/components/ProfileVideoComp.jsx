import React, { useRef, useState } from 'react';
import TiktokLoading from './TiktokLoading';
import ViewModalVideo from './ViewModalVideo';

const ProfileVideoComp = ({ post, isPlaying}) => {
    const [isOpen, setIsOpen]=useState(false)
    const video=useRef()
    

    const handlePlay = ()=>{
        if(!isPlaying) {
            video.current.play()
            //console.log("Playing");
        }
    }
    const handleStop = ()=>{
        if(!isPlaying) {
            video.current.pause()
            //console.log("Pause");
        }
    }

    const handleModal=()=>{
        setIsOpen(!isOpen)
    }

  return (
    <div className='min-w-[116px] w-[32%] h-[175px] quini:w-[208px] quini:h-[275px] quini:rounded-lg overflow-hidden z-[2] mx-[1px]' onClick={handleModal} key={post.id,post.timestamp}>
        <video 
        src={post.src}
        loop
        controls={false}
        ref={video}
        muted
        onMouseEnter={handlePlay}
        onMouseLeave={handleStop}
        className='w-full min-h-full z-[1] cursor-pointer transition-opacity duration-200 hover:opacity-80'
        />
        <ViewModalVideo isOpen={isOpen} setIsOpen={setIsOpen} post={post} />
    </div>
    );
};

export default ProfileVideoComp;
