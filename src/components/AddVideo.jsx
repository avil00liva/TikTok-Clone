import React, { useRef, useState } from 'react'
import { AiOutlineVideoCameraAdd, AiOutlineClear } from "react-icons/ai"
import { MdSend } from "react-icons/md"


/************************************************************/

import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage'
import {  db,storage,auth } from '../firebase'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, getDocs } from "firebase/firestore"
import photoDefault from "../assets/10.png"
import { usePosts } from '../context/PostsFBContext'


/************************************************************/


const AddVideo = ({ addTik }) => {
    const filePickerRef = useRef(null)
    const [input, setInput]=useState("")
    const [description, setDescription]=useState("")
    const [selectedFile, setSelectedFile]=useState(null)
    const [userImg, setUserImg] = useState(photoDefault)
    const [song, setSong]=useState(`original sound - Unknow`)
    const [loading, setLoading]= useState(false)
    const {usuario} = usePosts()

    /*const sendPost = async (e)=>{
        e.preventDefault()

        if (loading) return
        setLoading(true)

        const docRef = await addDoc(collection(db, "posts"), {
            username: input,
            userImg: userImg,
            description: description,
            song: song,
            timestamp: serverTimestamp()
        })
        const imageRef = ref(storage, `posts/${docRef.id}/video`)
        if (selectedFile){
            await uploadString(imageRef, selectedFile,"data_url").then(async ()=>{
                const downloadUrl= await getDownloadURL(imageRef)
                await updateDoc(doc(db, "posts", docRef.id), {
                    src: downloadUrl,
                })
            })
        }
        setLoading(false)
        setInput("")
        setDescription("")
        setSong(`original sound - ${input}`)
        setSelectedFile(null)

    }*/


    const sendAuthPost = async (e)=>{
        e.preventDefault()

        if (loading) return
        setLoading(true)

        const docRef = await addDoc(collection(db, "posts"), {
            idDocUser: usuario[0]?.id,
            iduser: auth.currentUser.uid,
            username: auth.currentUser.displayName.split(" ").join("").toLocaleLowerCase(),
            userImg: auth.currentUser.photoURL,
            description: description,
            song: song,
            timestamp: serverTimestamp()
        })
        const imageRef = ref(storage, `posts/${docRef.id}/video`)
        if (selectedFile){
            await uploadString(imageRef, selectedFile,"data_url").then(async ()=>{
                const downloadUrl= await getDownloadURL(imageRef)
                await updateDoc(doc(db, "posts", docRef.id), {
                    src: downloadUrl,
                })
            })
        }
        setLoading(false)
        setInput("")
        setDescription("")
        setSong(`original sound - ${input}`)
        setSelectedFile(null)

    }

    const addImageToPost = (e)=>{
        const reader = new FileReader()
        if(e.target.files[0]){
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        }
    }

    const clearValue = ()=> {
        setInput("")
        setDescription("")
        setSelectedFile(null)
    }


    return (
        <div className={addTik ? "addTrue" : "addFalse"}>
            <div className='w-full min-h-full p-4 text-center'>
                <h1 className='font-medium text-xl py-4'>Holaaa carga tus datos aquí!! 👋🏼</h1>
                <div className='flex gap-1 px-4 pb-1'>
                    <div className='w-[40px] h-[40px] bg-pink-500 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-500 hover:bg-pink-700' onClick={clearValue}>
                        <AiOutlineClear className='text-2xl text-white'/>
                    </div>
                    <div className='bg-pink-500 text-white px-2 rounded-full self-center'>Clear fields!</div>
                </div>
                <form>
                    <input type="text" placeholder='Nickname' className='outline-none border-0 py-1 w-[80%] indent-1 my-3' value={input ? input : ""} onChange={(e)=>{setInput(e.target.value)}}/>
                    {/*<input type="text" placeholder='Description' className='outline-none border-0 py-1 w-[80%] indent-1 my-3' onChange={(e)=>{setInput(e.target.value)}}/>*/}
                    <textarea className='outline-none border border-transparent w-[80%] min-h-[150px] indent-1 py-1 my-3' placeholder='Description' value={description ? description : ""} onChange={(e)=>{setDescription(e.target.value)}}></textarea>
                    <div className='w-full min-h-[80px] flex justify-around py-4 items-center'>
                        <div className='addTiktokInput' onClick={()=> filePickerRef.current.click()}>
                            <AiOutlineVideoCameraAdd className='text-5xl text-pink-500' />
                            <input type="file" hidden onChange={addImageToPost} ref={filePickerRef} />
                        </div>
                        <button type='submit' className='flex px-5 py-2 bg-pink-500 transition-colors hover:bg-pink-700 items-center gap-2 text-xl text-white rounded-lg cursor-pointer' onClick={sendAuthPost}>Cargar <MdSend className='self-end'/> </button>
                    </div>
                </form>
            </div>
            {loading && <div className='w-[50px] h-[50px] border-4 border-pink-600 border-l-transparent m-auto rounded-full animate-spin' />}
        </div>
    )
}

export default AddVideo


/* 

<div className='icon' onClick={()=> filePickerRef.current.click()}>
    <HiOutlinePhotograph className='h-[22px] text-[#1d9bf0]'/>
    <input type="file" hidden onChange={addImageToPost} ref={filePickerRef}/>
</div>

*/