import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React from 'react';
import { FiLogIn } from "react-icons/fi"
import logo from "../assets/toctocLogo.png"
import { auth, db, provider } from '../firebase';

const ProfileLogin = ({setIsAuth, isAuth}) => {

    const signInWithGoogle = ()=>{
        signInWithPopup(auth, provider).then((result)=>{
            localStorage.setItem("isAuth", true);
            setIsAuth(true);
        })
        .then( async ()=>{
            const userId = auth.currentUser.uid
            await setDoc(doc(db, "usuarios",userId), {
                iduser: auth.currentUser.uid,
                username: auth.currentUser.displayName,
                photoURL: auth.currentUser.photoURL
            })
        }) .catch((error)=> console.log(error))
    }


  return (
    <div className='w-full min-h-[40%] bg-[#1B1B1B] inset-0 z-20 overflow-none fixed flex items-center justify-between gap-4 text-white flex-col'>
        <h1 className='mt-9 mb-6 text-2xl'>Ingresa con tu cuenta!!</h1>
        <img src={logo} alt="Logo de la App" className='w-[80%] h-[40%] tablet:object-contain' />
        <div className='w-full min-h-[300px] bg-transparent rounded-t-3xl flex items-center justify-center flex-col'>
            <button className='cursor-pointer bg-pink-700 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-pink-800 mb-4' onClick={signInWithGoogle}>
                <FiLogIn className='text-white w-8 h-8' /> 
                <span className='text-white font-bold text-lg'>
                    Iniciar sesión
                </span>
            </button>
        </div>
    </div>
    );
};

export default ProfileLogin;
