import { collection, collectionGroup, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db, provider } from "../firebase"
import SidebarLeft from './SidebarLeft';
import NavbarBottom from "./NavbarBottom"
import { BsShare } from "react-icons/bs"
import ProfileVideos from './ProfileVideos';
import { useParams } from 'react-router-dom';
import logo from "../assets/toctocLogo.png"
import defaultAvatar from "../assets/10.png"
import { FaBars } from "react-icons/fa"
import { IoIosArrowDown } from "react-icons/io"
import { FiLogOut } from "react-icons/fi"
import { AiFillCloseCircle } from "react-icons/ai"
import EditProfileModal from './EditProfileModal';
import ProfileLogin from './ProfileLogin';
import TiktokLoading from './TiktokLoading';
import { usePosts } from '../context/PostsFBContext';
import Notifications from './Notifications';

const Profile = () => {
  const userid = useParams()
  const {isAuth, setIsAuth, signInWithGoogle, signUserOut, posts} = usePosts()
  const [user, setUser]=useState([])
  const [usuario, setUsuario]=useState([])
  const [isOpenEdit, setIsOpenEdit]=useState(false)
  const [profileOpt, setProfileOpt] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [followUser, setFollowUser] = useState([])
  const [likesUser, setLikesUser] = useState([])
  const [likedUser, setLikedUser] = useState(false)
  const [siguiendo, setSiguiendo] = useState([])
  
  useEffect(()=>{
      const unsub = async ()=> { onSnapshot(doc(db, "usuarios", userid.iduser), (doc) => {
        setUser(doc.data())
      })
    }
    unsub()
  },[])

  useEffect(()=>{
    const usuarioEmailPass = async ()=> { onSnapshot(
      query(collection(db, "usuarios"), where("iduser", "==", userid?.iduser)),
      (snapshot)=>{
        setUsuario(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
      }
    )}
    usuarioEmailPass()
  },[db])

  const handleModalEdit=()=>{
    setIsOpenEdit(!isOpenEdit)
  }

  const showOpt=()=>{
    setProfileOpt(!profileOpt)
  }

  //const q = query(collection(db, "posts",posts?.id,"likes", where("iduser", "==", posts?.id)))

  useEffect(
      () =>
        onSnapshot(collection(db, "usuarios", userid?.iduser, "followers"), (snapshot) =>
          setFollowUser(snapshot.docs)
        ),
      [db, userid?.iduser]
    );
    useEffect(()=>{
      const followsDb = async ()=> { onSnapshot(
        query(collectionGroup(db, "followers"), where("followId", "!=", userid?.iduser), where("iduser", "==", userid?.iduser)),
        (snapshot)=>{
          setSiguiendo(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
        }
      )}
      followsDb()
    },[db, userid?.iduser])

  useEffect(()=>{
    const likesDb = async ()=> { onSnapshot(
      query(collectionGroup(db, "likes"), where("postId", "==", userid.iduser)),
      (snapshot)=>{
        setLikesUser(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
      }
    )}
    likesDb()
  },[db, userid?.iduser])

    useEffect(()=>{
        setIsFollowed(followUser.findIndex((follow)=> follow.id === auth?.currentUser?.uid) !== -1)
    },[followUser])

    /*useEffect(()=>{
      setLikedUser(likesUser.findIndex((like)=>like.id === auth.currentUser.uid) !== -1)
    },[likesUser])*/

  const followUserAction = async ()=> {
      if(isAuth){
          if(isFollowed){
              await deleteDoc(doc(db, "usuarios",userid?.iduser,"followers", auth?.currentUser.uid))
          } else {
              await setDoc(doc(db, "usuarios",userid?.iduser,"followers", auth?.currentUser.uid), {
                  username: auth?.currentUser.displayName.split(" ").join("").toLocaleLowerCase(),
                  iduser: auth?.currentUser.uid,
                  followId: userid?.iduser,
                  userImg: auth?.currentUser.photoURL,
                  timestamp: serverTimestamp()
              })
          }}
      else {
          return signInWithGoogle()
      }
  }
  
  return (
    <>
      <div className='hidden mt-16 w-full quini:flex min-h-screen'>
          <SidebarLeft/>
          <div className='w-full min-h-screen px-8'>
            <div className='w-full min-h-[200px] flex items-start'>
              <div className='w-full min-h-[200px] flex flex-col justify-center items-start px-2 flex-[0.9] pb-4 mt-4'>
                <div className='flex items-start gap-2'>
                  {user.length === 0 ? <TiktokLoading /> : 
                    <>
                      <img src={usuario.length >= 1 ? usuario[0]?.photoURL : user?.photoURL} alt="Avatar picture" className='w-[120px] h-[120px] rounded-full'/>
                      <div className='block'>
                        <h2 className='text-[28px] font-bold leading-[38px] pb-1 overflow-hidden text-ellipsis text-left '>
                          {usuario.length >= 1 ? usuario[0]?.username : user?.username}
                        </h2>
                        <h3 className='font-semibold text-lg leading-6 text-ellipsis h-[25px] overflow-hidden max-w-[450px] whitespace-nowrap flex items-end'>
                          @{usuario.length >= 1 && user.length === undefined ?  usuario[0]?.username.split(" ").join("").toLocaleLowerCase() : user?.username?.split(" ").join("").toLocaleLowerCase()}
                        </h3>
                        {user?.iduser === auth?.currentUser?.uid || usuario[0]?.iduser === auth?.currentUser?.uid 
                          ? 
                          ""
                          : 
                            <>
                            {isFollowed 
                              ?
                              <> 
                              <button className='outline-none border rounded-[4px] bg-[rgba(254,44,85,1.0)] border-[rgba(254,44,85,1.0)] text-white text-base leading-[22px] font-semibold cursor-pointer px-10 py-[4px] mt-4 transition-colors duration-200 hover:bg-[#d43152] hover:text-white' onClick={followUserAction}>
                                  Siguiendo
                              </button>
                              </>
                              : 
                              <button className='outline-none border rounded-[4px] text-[rgba(254,44,85,1.0)] border-[rgba(254,44,85,1.0)] bg-white text-base leading-[22px] font-semibold cursor-pointer px-10 py-[4px] mt-4 transition-colors duration-200 hover:bg-[rgba(254,44,85,1.0)] hover:text-white' onClick={followUserAction}>
                                  Seguir
                              </button>
                            }
                            </>
                          }
                      </div>
                    </>
                  }
                </div>
                <h2 className='flex items-center mt-[22px] text-[rgba(18,18,18,0.75)] gap-2'>
                  <div>
                    {siguiendo.length > 0 ?
                      <strong>
                        {siguiendo.length}
                      </strong> : <strong>0</strong>
                    }
                    <span className='font-normal text-base leading-[22px] ml-[5px] inline-block'>
                      Siguiendo
                    </span>
                  </div>
                  <div>
                    {followUser.length > 0 ?
                      <strong>
                        {followUser.length}
                      </strong> : <strong>0</strong>
                    }
                    <span className='font-normal text-base leading-[22px] ml-[5px] inline-block'>
                      Seguidores
                    </span>
                  </div>
                  <div>
                    {likesUser.length > 0 ?
                      <strong>
                        {likesUser.length}
                      </strong> : <strong>0</strong>
                    }
                    <span className='font-normal text-base leading-[22px] ml-[5px] inline-block'>
                      Me gusta
                    </span>
                  </div>
                </h2>
                <h2 className='text-[rgba(18,18,18,0.75)] text-left font-normal text-base leading-[22px] whitespace-pre-line mt-[10px]'>
                  No hay descripción corta.
                </h2>
              </div>
              <div className='min-h-[200px] flex-[0.1] flex items-start justify-center pt-14'>
                <span className='cursor-pointer w-[30px] h-[30px] transition-colors duration-300 hover:bg-gray-100 rounded-full text-gray-900 flex items-center text-center justify-center text-xl'>
                  <BsShare />
                </span>
              </div> 
            </div>
            <ProfileVideos userid={userid} />
          </div>
      </div>
      
      {isAuth 
        ?
          <div className='quini:hidden w-full flex flex-col min-h-screen'>
            <NavbarBottom />
            <div className='w-full min-h-screen bg-gray-900 overflow-hidden'>
                <nav className='min-h-[30px] w-full flex mb-4 items-center justify-between p-2 py-3 fixed top-0 left-0 bg-gray-900 z-[21]'>
                    <span className='w-[30px] h-full rounded-full ml-1'>
                        <img src={logo} alt="Logo App" className='w-full h-full rounded-full' />
                    </span>
                    <span className='text-white font-bold text-lg flex items-center gap-1'>
                      {usuario.length >= 1 ? usuario[0]?.username : user?.username } <IoIosArrowDown className='text-white font-bold w-[22px] h-[22px]' /> 
                    </span>
                    <FaBars className='text-white w-[30px] h-[30px] cursor-pointer' onClick={showOpt}/>
                </nav>
                <div className='min-h-[100px] mt-10 w-full border-b border-gray-600 flex flex-col items-center text-white'>
                  {user.length === 0 ? <TiktokLoading />  : <> <img src={usuario.length >= 1 ? usuario[0]?.photoURL : user?.photoURL} alt="Avatar User" className='w-[120px] h-[120px] rounded-full my-6'/>
                  <span className='text-lg font-bold mb-6'>
                      @{usuario.length >= 1 && user.length === undefined ? usuario[0]?.username?.split(" ").join("").toLocaleLowerCase() : user?.username?.split(" ").join("").toLocaleLowerCase()}
                  </span></>}
                  <div className='min-h-[50px] w-full flex items-center justify-center gap-4 mb-6'>
                      <div className='min-w-[50px] min-h-[50px] flex flex-col items-center'>
                        {siguiendo.length > 0 ?
                          <strong className='text-lg font-bold'>
                            {siguiendo.length}
                          </strong> : <strong className='text-lg font-bold'>0</strong>
                        }
                        <p className='text-gray-300'>Siguiendo</p>
                      </div>
                      <div className='min-w-[50px] min-h-[50px] flex flex-col items-center'>
                        {followUser.length > 0 ?
                          <strong className='text-lg font-bold'>
                            {followUser.length}
                          </strong> : <strong className='text-lg font-bold'>0</strong>
                        }
                        <p className='text-gray-300'>Seguidores</p>
                      </div>
                      <div className='min-w-[50px] min-h-[50px] flex flex-col items-center'>
                        {likesUser.length > 0 ?
                          <strong className='text-lg font-bold'>
                            {likesUser.length}
                          </strong> : <strong className='text-lg font-bold'>0</strong>
                        }
                        <p className='text-gray-300'>Me gusta</p>
                      </div>
                  </div>
                  {user?.iduser === auth?.currentUser?.uid || usuario[0]?.iduser === auth?.currentUser?.uid
                  ? 
                  <button className='mb-6 outline-none border border-gray-600 px-8 py-3 rounded-md font-bold' onClick={handleModalEdit}>
                    Editar perfil
                  </button> 
                  : 
                    <>
                    {isFollowed 
                      ?
                      <> 
                      <button className='mb-6 outline-none border bg-gray-200 text-gray-900 border-gray-600 px-8 py-3 rounded-md font-bold' onClick={followUserAction}>
                        Siguiendo
                      </button> 
                      </>
                      : 
                      <button className='mb-6 outline-none border border-gray-600 px-8 py-3 rounded-md font-bold' onClick={followUserAction}>
                        Seguir
                      </button> 
                    }
                    </>
                  }
                  <p className='mb-6'>Pulsa para añadir descripción corta</p>
                </div>
                <ProfileVideos userid={userid} usuario={usuario} setUsuario={setUsuario} />
                <div className={profileOpt ? 'w-full min-h-[40%] bg-transparent rounded-t-3xl inset-0 z-20 overflow-none fixed flex items-end' : 'hidden'}>
                  <div className='w-full min-h-[300px] bg-white rounded-t-3xl flex items-center justify-between flex-col'>
                      <AiFillCloseCircle className='self-end m-5 text-pink-600 w-[35px] h-[35px] cursor-pointer' onClick={()=>{setProfileOpt(false)}}/>
                      <button className='cursor-pointer bg-pink-700 py-5 px-8 flex items-center gap-2 rounded-md transition-colors duration-300 hover:bg-pink-800 mb-4' onClick={signUserOut}>
                        <FiLogOut className='text-white w-8 h-8' /> 
                        <span className='text-white font-bold text-lg'>Cerrar sesión</span>
                      </button>
                  </div>
                </div>
            </div>
              <EditProfileModal setIsOpenEdit={setIsOpenEdit} isOpenEdit={isOpenEdit} />
          </div> 
        : 
        <ProfileLogin setIsAuth={setIsAuth} isAuth={isAuth} />
      }
    </>
    );
};

export default Profile;
