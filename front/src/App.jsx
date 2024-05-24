import {createContext, useEffect, useState }from "react";
import "./App.css";
import {BrowserRouter, Link, Route, Routes }from "react-router-dom";
import Home from "./pages/home";
import Inscription from "./pages/inscription.jsx";
import Connexion from "./pages/connexion";
import Profile from "./pages/profile";


export const UserContext= createContext()
function App() {
  const [user, setUser]= useState(null)
  useEffect(()=>{

    const token = localStorage.getItem('access_token')
    async function getUser(){
      if (!token) return
      const reponse = await fetch('/api/users/me',{
        headers:{
          Authorization:'Bearer ' + token
        }
      })
      const data = await reponse.json()
      console.log(data);
      setUser(data.user)
    }
    getUser()
  },[])
  function LogOut(){
    setUser(null)
    localStorage.removeItem('access_token')
  }LogOut
  return (
    <UserContext.Provider value={{user: user,setUser:setUser}}>
    <BrowserRouter>
      <nav>
        <Link to={"/"}>Accueil</Link>
        {
          // La condition est a changer plus tard
          !user ?
            <>
              <Link to={"/inscription"}>Inscription</Link>
              <Link to={"/connexion"}>Connexion</Link>
            </> :
            <div>
              <button>Déconnexion</button>
              <Link to={"/profile"}>Profile</Link>
            </div>
            
        }
      </nav>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/inscription" element={<Inscription />}/>
        <Route path="/connexion" element={<Connexion />}/>
        <Route path="/profile" element={<Profile />}/>

      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}
export default App;

// Implementer la déconnexion
// Ajouter un bouton dans la navbar, qui quand on clique dessus:
// Supprimer le token de localStorage
// Mettre la variable d'état user a nul

