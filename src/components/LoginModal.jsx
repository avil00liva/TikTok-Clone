import React, { useRef, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { MdSend } from "react-icons/md"
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../firebase';
import { usePosts } from '../context/PostsFBContext';
import logo from "../assets/toctocLogo.png"
import { FiLogIn } from "react-icons/fi"
import { AiOutlineVideoCameraAdd } from 'react-icons/ai';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';


const LoginModal = ({setOpenLog, openLog}) => {
    const filePickerRef = useRef(null)
    const {isAuth, setIsAuth, signInWithGoogle, signUserOut, signUpWEmailPassword, logInWEmailPassword} = usePosts()
    const [registrar, setRegistrar] = useState(false)
    const [iniciarEmailPass, setIniciarEmailPass] = useState(false)
    const [loading, setLoading]= useState(false)
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [username, setUsername]=useState("")
    const [photoURL, setPhotoURL]=useState(null)
    const [selectedFile, setSelectedFile]=useState(null)
 
    const handleRegistro = ()=> {
        setRegistrar(true)
    }

    const handleInicioEmailPass = ()=> {
        setIniciarEmailPass(true)
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

    const sendAuthPost = async (e)=>{
        e.preventDefault()

        if (loading) return
        setLoading(true)
        try {
            await signUpWEmailPassword(email, password).then( async ()=>{
                async ()=>{
                    const docId = auth?.currentUser?.uid;
                    await setDoc(doc(db, "usuarios", docId), {
                      iduser: auth?.currentUser?.uid,
                    });
                }
                const docRef = await addDoc(collection(db, "usuarios"), {
                    username: username,
                    email: email,
                    password: password
                })
                const imageRef = ref(storage, `usuarios/${docRef.id}/photourl`)
                if (selectedFile){
                    await uploadString(imageRef, selectedFile,"data_url").then(async ()=>{
                        const downloadUrl= await getDownloadURL(imageRef)
                        await updateDoc(doc(db, "usuarios", docRef.id), {
                            photoURL: downloadUrl,
                        }) .then( updateProfile(auth.currentUser, {
                            displayName: username,
                            photoURL: downloadUrl,
                        }))
                    })
                }
            })
        }
        catch(err) {
            console.log(err);
        }
        setLoading(false)
        setEmail("")
        setPassword("")
        setUsername("")
        setPhotoURL(null)
        setRegistrar(false)
    }

    const handleLogin = async (e)=> {
        e.preventDefault()
        try {
            await logInWEmailPassword(email, password)
            setOpenLog(false)
        } catch(err) {
            console.log(err);
        }
        setIniciarEmailPass(false)
    }
    const handleLogInWGoogle = async (e)=> {
        e.preventDefault()
        try {
            await signInWithGoogle()
            setOpenLog(false)
        } catch(err) {
            console.log(err);
        }
    }

  return (
        <Transition.Root show={openLog} as={Fragment}>
        <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={()=>setOpenLog(false)}>
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
                    <div className='w-[500px] min-h-[600px] bg-gray-100 inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-md shadow-gray-400 transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full p-2'>
                    <div className='w-[5px] h-[5px] bg-transparent cursor-pointer'></div>
                    {!registrar 
                        ?
                        <>   
                        <div className='px-2 w-full min-h-[50px] flex justify-between items-center'>
                            <h1 className='mt-9 mb-6 text-2xl text-center'>Ingresa con tu cuenta!!</h1>
                            <img src={logo} alt="Logo de la App" className='w-[50px] h-[50px] rounded-full' />
                        </div>
                        <div className='w-full min-h-[300px] bg-transparent rounded-t-3xl flex items-center justify-center flex-col'>
                            {!iniciarEmailPass
                                ?
                                <>
                                    <button className='cursor-pointer bg-blue-600 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-blue-700 mb-4' onClick={handleInicioEmailPass}>
                                    <FiLogIn className='text-white w-8 h-8' /> 
                                    <span className='text-white font-bold text-lg'>
                                        Iniciar sesión con tu cuenta 
                                    </span>
                                    </button>
                                    <button className='cursor-pointer bg-pink-700 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-pink-800 mb-4' onClick={handleLogInWGoogle}>
                                        <FiLogIn className='text-white w-8 h-8' /> 
                                        <span className='text-white font-bold text-lg'>
                                            Iniciar sesión con Google 
                                        </span>
                                    </button>
                                    <div className="w-full h-[10px] border-b border-gray-900 text-center flex items-center justify-center my-4">
                                        <span className="text-[24px] bg-[#F3F5F6] py-0 px-[10px]">
                                            Crea una cuenta
                                        </span>
                                    </div>
                                    <button className='cursor-pointer bg-green-500 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-green-600 mt-4' onClick={handleRegistro}>
                                        <FiLogIn className='text-white w-8 h-8' /> 
                                        <span className='text-white font-bold text-lg'>
                                        Crear nueva cuenta
                                        </span>
                                    </button>
                                    </>
                                :
                                <div className='w-full min-h-[100px] flex flex-col items-center gap-2'>
                                    <span className='cursor-pointer border-b-2 border-b-blue-600 font-bold text-lg text-gray-900 self-start' onClick={()=> setIniciarEmailPass(false)}>
                                        ⬅ Atras
                                    </span>
                                    <input type="email" placeholder='Introduce tu correo' className='my-4 w-[70%] py-2 px-2 outline-none border-0 border-transparent' autoComplete='off' onChange={(e)=>{setEmail(e.target.value)}}/>
                                    <input type="password" placeholder='Introduce tu contraseña' className='my-4 w-[70%] py-2 px-2 outline-none border-0 border-transparent' autoComplete='off' onChange={(e)=>{setPassword(e.target.value)}}/>
                                    <button className='cursor-pointer bg-blue-600 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-blue-700 mt-14' onClick={handleLogin}>
                                        <FiLogIn className='text-white w-8 h-8' /> 
                                        <span className='text-white font-bold text-lg'>
                                            Iniciar sesión
                                        </span>
                                    </button>
                                </div>
                        }
                        </div>
                        </>
                        :
                        <>
                            <div className='w-full min-h-[100px] flex flex-col items-center gap-2'>
                                <span className='cursor-pointer border-b-2 border-b-green-600 font-bold text-lg text-gray-900 self-start' onClick={()=> setRegistrar(false)}>
                                    ⬅ Atras
                                </span>
                                <input type="email" placeholder='Introduce tu correo' className='my-4 w-[70%] py-2 px-2 outline-none border-0 border-transparent' autoComplete='off' onChange={(e)=>{setEmail(e.target.value)}}/>
                                <input type="password" placeholder='Introduce tu contraseña' className='my-4 w-[70%] py-2 px-2 outline-none border-0 border-transparent' autoComplete='off' onChange={(e)=>{setPassword(e.target.value)}}/>
                                <input type="text" placeholder='Introduce tu nickname' className='my-4 w-[70%] py-2 px-2 outline-none border-0 border-transparent' autoComplete='off' onChange={(e)=>{setUsername(e.target.value)}}/>

                                <div className='addTiktokInput flex items-start w-full pt-8 pl-20 cursor-default'>
                                    <AiOutlineVideoCameraAdd className='self-start text-5xl text-green-500 cursor-pointer'  onClick={()=> filePickerRef.current.click()} />
                                    <input type="file" hidden onChange={addImageToPost} ref={filePickerRef} />
                                </div>

                                <button className='cursor-pointer bg-green-500 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-green-600 mt-14' onClick={sendAuthPost}>
                                    <FiLogIn className='text-white w-8 h-8' /> 
                                    <span className='text-white font-bold text-lg'>
                                        Crear cuenta
                                    </span>
                                </button>
                            </div>
                            {loading && <div className='w-[50px] h-[50px] border-4 border-pink-600 border-l-transparent m-auto rounded-full animate-spin' />}
                        </>
                    }
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>   
  );
};

export default LoginModal;
