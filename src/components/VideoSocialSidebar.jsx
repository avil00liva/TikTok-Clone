import React from 'react'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { FaCommentDots } from "react-icons/fa"
import { RiShareForwardFill } from "react-icons/ri"

const VideoSocialSidebar = () => {
    const socialList = [
        {
            item: <AiFillHeart />,
            value: 123
        },
        {
            item: <FaCommentDots />,
            value: 666
        },
        {
            item: <RiShareForwardFill />,
        },
    ]



    return (
        <ul className='fixed text-3xl flex flex-col items-center
        py-8 top-[30%] gap-8 right-0 mr-1'>
            {socialList.map((social)=>{
                return (
                    <li key={social.id} className='flex flex-col items-center justify-between text-xl text-gray-200 gap-1'>
                       <strong className='text-4xl cursor-pointer text-gray-200 transition-colors duration-200 hover:text-gray-400'>
                            {social.item}
                       </strong> 

                        {social.value}
                    </li>
                )
            })}
        </ul>
    )
}

export default VideoSocialSidebar
