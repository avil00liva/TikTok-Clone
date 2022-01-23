import { useState, useEffect } from 'react'
import NavbarBottom from './components/NavbarBottom'
import VideoPlayer from './components/VideoPlayer'
import { HiMusicNote } from "react-icons/hi"
import AddVideo from './components/AddVideo'

/************************************************************/

import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage'
import {  db,storage } from './firebase'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, getDocs } from "firebase/firestore"
import photoDefault from "./assets/10.png"
import NavBarTop from './components/NavBarTop'
import SidebarLeft from './components/SidebarLeft'
import ContentFeed from './components/ContentFeed'
import { signOut } from 'firebase/auth'
import { auth } from './firebase'


/************************************************************/


const TIKTOKS = [
  {
      author: "jesi.chef",
      description: "#frappe #frappuccino #bebida #receta",
      song: "sonido original - Yesi",
      icon: <HiMusicNote />,
      likes: 267.3,
      comments: 650,
      pic: "https://p77-sign-va.tiktokcdn.com/tos-maliva-avt-0068/c273e296566165bb89ed6719d6378772~c5_100x100.jpeg?x-expires=1641762000&x-signature=DDNsmMDDwxHEIo8UbNUgL7GXPS0%3D",
      src: "https://v16-webapp.tiktok.com/786fd01cbb361194545dc33e8dc2c7fb/61da5c2d/video/tos/useast2a/tos-useast2a-ve-0068c003/b62e11564cf24ee5bef2c34c0f491bdf/?a=1988&br=1794&bt=897&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=Yu12_FIrkag3-I&l=2022010821524701022308414310F3154E&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M206d2c6Zjw3ODMzNzczM0ApOGc4ODw2Zzw0Nzo6ZmgzNGduamZwcjRvZ2ZgLS1kMTZzc19jX2JhLy0vNTAzYl8tYGA6Yw%3D%3D&vl=&vr="
  },
  {
      author: "houseofdogos",
      description: "Llegamos a Peru!!!!!!!! #dogoargentino #mascotas #perrostiktokers #adiestramientoenpositivo #adiestramientocanino",
      likes: 123,
      shares: 60,
      comments: 33,
      songTitle: "sonido original - houseofdogos",
      albumCover: "https://p16-sign-va.tiktokcdn.com/obj/tos-maliva-p-0068/113162c67f3149ac8fb038735afbce2b_1641398778?x-expires=1641668400&x-signature=hrS0bSkFeLAmXjW8zFWhw8NgGOM%3D",
      src: "https://v16-webapp.tiktok.com/8482677b479a185b3c3a022a1c050ac7/61d9e142/video/tos/useast2a/tos-useast2a-ve-0068c003/f39c319eb4ae48ed8b8bcf8cdca07435/?a=1988&br=4030&bt=2015&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=Yu12_FIrkag3-I&l=202201081307520102230711610FA7EF5E&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=anZ1ODw6ZjV3OTMzNzczM0ApNWQ3aDNnOGUzNzpoZDY1OGc1aXJlcjRfczZgLS1kMTZzc2I1XjRiLS0tMGIvY2NiXzQ6Yw%3D%3D&vl=&vr="
  },
  {
    author: "brutacocina",
    description: "COCINADO CON SOBRAS DE QUESO #cheese #QUESO #cheddar #food #receta #foodporn",
    song: "Índigo - Camilo & Evaluna Montaner",
    icon: <HiMusicNote />,
    likes: 106.4,
    comments: 172,
    pic: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/f544cf8953971b644e538407097c70d6~c5_100x100.jpeg?x-expires=1641769200&x-signature=pGUwpI7GYe40PQzfeP4Yd%2BfnG1M%3D",
    src: "https://v16-webapp.tiktok.com/a61302936d7ce738d9117993da94033c/61db1ee4/video/tos/useast2a/tos-useast2a-pve-0068/d4fb58633d2c4a8baedb89a76d663563/?a=1988&br=5910&bt=2955&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=Yu12_FIrkag3-I&l=20220109114309010223128230243866CD&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=MzV5bGU6ZmltODMzNzczM0ApOGRoaDRpNjw1N2hoPDRmaGdmZDJscjQwc29gLS1kMTZzczJeYy5gXl4wYy4wLy8yMWI6Yw%3D%3D&vl=&vr="
  },
  {
    author: "lavikingacocina",
    description: "El mejor Sándwich #picada #pan #fyp #parati",
    song: "Bar - TINI & L-Gante",
    icon: <HiMusicNote />,
    likes: 62.0,
    comments: 198,
    pic: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/76cda3cb97bb319281dbb0952a2fe69d~c5_100x100.jpeg?x-expires=1641812400&x-signature=SfjcslC33mJNZH0FM7X0xGEK2d0%3D",
    src: "https://v16-webapp.tiktok.com/d5e71a77ef9ea6e3fc2f99d3d17f7a8a/61db1cb6/video/tos/useast2a/tos-useast2a-pve-0068/5079e78ea67840a782ac81f42cd9fe3b/?a=1988&br=3744&bt=1872&cd=0%7C0%7C1&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=Yu12_FIrkag3-I&l=202201091133470102230861342234BACC&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=MzY1O2VmaG1xMzMzNzczM0ApaGg6OGdnMzxlNzw7aWU2Z2dhMTRzLXNgMnJgLS1iMTZzczJjNC00MjUzYmExMWFhYl46Yw%3D%3D&vl=&vr="
  },
  {
    author: "brutacocina",
    description: "SUPERVIVENCIA DE DEPARTAMENTO #supervivencia #food #chef #recetas",
    song: "sonido original - BRUTA COCINA",
    icon: <HiMusicNote />,
    likes: 1.7,
    comments: 3630,
    pic: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/f544cf8953971b644e538407097c70d6~c5_100x100.jpeg?x-expires=1641769200&x-signature=pGUwpI7GYe40PQzfeP4Yd%2BfnG1M%3D",
    src: "https://v16-webapp.tiktok.com/8a17e06d454119a019dee8e2844406fc/61da7335/video/tos/useast2a/tos-useast2a-pve-0068/edb44bc07a3b4c60adf50ed7595c7dcd/?a=1988&br=832&bt=416&cd=0%7C0%7C0&ch=0&cr=0&cs=0&dr=0&ds=1&er=&ft=Yu12_FIrkag3-I&l=2022010823312201018907203420FEA99F&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=M285Njo6ZjU3OTMzNzczM0ApODRpM2Y4OTs2NztmZjdlNGdlb3IwcjRvZ2VgLS1kMTZzc14uYS5eNGJhNjYxXy5gNC46Yw%3D%3D&vl=&vr="
  },
]

const mql = window.matchMedia('(max-width: 498px)')

const mobileView = mql.matches

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [luz, setLuz] = useState(false)
  const [addTik, setAddTik] = useState(false)
  const [posts, setPosts]=useState([])
  const newTiktok = ()=> {
    setAddTik(!addTik)
  }
  const encender = ()=> {
    setLuz(!luz)
  }
  {/*useEffect(()=>{
    const getPost = async ()=> {
      const data = await getDocs(collection(db, "posts"))
      setPosts(data.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
    }
    getPost()
    
  }, [])*/}
  useEffect( ()=>{
    const getPost = async ()=> { onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot)=>{
        setPosts(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
      }
      )}
      getPost()
    }, [db])
    

  return (
      <div className="w-full min-h-screen">
        {mobileView === true ?
        <>
          <div className='w-full min-h-screen block bg-gray-900'>
            {posts.map((tiktok)=>{
              return (
                <div className='snap-start overflow-hidden' key={tiktok.id}>
                  <VideoPlayer {...tiktok} isAuth={isAuth} setIsAuth={setIsAuth} />
                </div>
              )
            })}
          </div>


          <AddVideo addTik={addTik} />
          <NavbarBottom  addTik={addTik} newTiktok={newTiktok} isAuth={isAuth} setIsAuth={setIsAuth} />
        </>
        
        :
        
        <>
          <NavBarTop isAuth={isAuth} setIsAuth={setIsAuth}/>
          <div className='hidden mt-[60px] w-full quini:flex min-h-screen'>
            <SidebarLeft />
            <div className='w-full min-h-screen flex flex-col laptop:items-center'>
              {posts.map((tiktokWeb)=>{
                return (
                  <>
                    <ContentFeed {...tiktokWeb}/>
                  </>
                )
              })}
            </div>
          </div>
        </>
        }


      </div>
  )
}

export default App

