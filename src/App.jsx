import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBarTop from './components/NavBarTop'
import Profile from './components/Profile'
import { PostsFBContextProvider } from './context/PostsFBContext'
import { db } from './firebase'
import Home from './Home'


function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));    

  return (
    <>
      <PostsFBContextProvider>
      <Router>
        <NavBarTop isAuth={isAuth} setIsAuth={setIsAuth} /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path={`/profile/:iduser`} element={<Profile />} />
        </Routes>
      </Router>
      </PostsFBContextProvider>
    </>
  )
}

export default App

