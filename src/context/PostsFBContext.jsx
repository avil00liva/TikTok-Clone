import { createContext, useContext, useEffect, useState } from "react"
import { collection, doc, documentId, limit, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore"
import { auth, db, provider } from "../firebase" 
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const postsFBContext = createContext()

export function PostsFBContextProvider({children}) {
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
    const [posts, setPosts] = useState([])
    const [usuarios, setUsuarios]=useState([])
    const [usuario, setUsuario]=useState([])
    const [documentId, setDocumentId]=useState([])
    const [usuarioOn, setUsuarioOn] = useState(isAuth ? auth?.currentUser?.uid : "")


    useEffect( ()=>{
        const getPost = async ()=> { onSnapshot(
          query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(4)),
          (snapshot)=>{
            setPosts(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
          }
          )}
          getPost()
        }, [db])

    useEffect( ()=>{
        const getUsuarios = async ()=> { onSnapshot(
          query(collection(db, "usuarios")),
          (snapshot)=>{
            setUsuarios(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
          }
          )}
          getUsuarios()
        }, [db])

      useEffect(()=>{
        const usuarioEmailPass = async ()=> { onSnapshot(
          query(collection(db, "usuarios"), where("iduser", "==", !usuarioOn ? "" : usuarioOn)),
          (snapshot)=>{
            setUsuario(snapshot.docs.map((doc)=> ({ ...doc.data(), id: doc.id})))
          }
        )}
          usuarioEmailPass()
        },[db, auth?.currentUser])

        function signInWithGoogle () {
          signInWithPopup(auth, provider).then((result) => {
              localStorage.setItem("isAuth", true);
              setIsAuth(true);
              //prueba
          }) .then(()=>{location.reload()})
          
          .then( async ()=>{
              const userId = auth.currentUser.uid
              await setDoc(doc(db, "usuarios",userId), {
                  iduser: auth.currentUser.uid,
                  username: auth.currentUser.displayName,
                  photoURL: auth.currentUser.photoURL
              })
          }) .catch((error)=> console.log(error))
      };
      const signUserOut = () => {
        signOut(auth).then(()=> {
            localStorage.clear()
            setIsAuth(false)
        }) .then(()=>{location.reload()})
      }

    function signUpWEmailPassword(email, password) {
      return createUserWithEmailAndPassword( auth, email, password)
    }

    function logInWEmailPassword (email, password) {
      signInWithEmailAndPassword(auth, email, password).then((result) => {
          localStorage.setItem("isAuth", true);
          setIsAuth(true);
          //prueba
      }) .then(()=>{location.reload()})
      
      .then( async ()=>{
        const docId = auth.currentUser.uid;          
        await setDoc(doc(db, "usuarios",docId), {
              iduser: auth.currentUser.uid,
              username: auth.currentUser.displayName,
              photoURL: auth.currentUser.photoURL
          })
      }) .catch((error)=> console.log(error))
  };

    useEffect( async ()=>{
        const documentMap = usuarios.map((usuario)=>{return usuario.id})
        setDocumentId(documentMap)
    },[db, usuarios])


    return (
        <postsFBContext.Provider value={{
            posts, 
            setPosts, 
            usuarios, 
            setUsuarios,
            usuario,
            setUsuario,
            isAuth, 
            setIsAuth, 
            signInWithGoogle, 
            signUserOut, 
            signUpWEmailPassword, 
            logInWEmailPassword,
        }}>
            {children}
        </postsFBContext.Provider>
    )
}

export function usePosts() {
  return useContext(postsFBContext)
}