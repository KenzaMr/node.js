import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import image from "../img/icon.png";
export default function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(function () {
    if (!user) {
      return navigate("/connexion");
    }
  }, []);
  const [modifuserName, setmodifuserName] = useState("");
  const [modifUserNameErr, setmodifUserNameErr] = useState("");
  const [avatar, setAvatar] = useState("");

  function modifUserName(e) {
    setmodifUserNameErr("");
    setmodifuserName(e.target.value);
    if (e.target.value === "") {
      return setmodifUserNameErr("Pseudo obligatoire");
    }
  }
  function enterAvatar(e) {
    setAvatar(e.target.value);
  }
  if (!user) {
    return <p>Chargement...</p>;
  }
  const [sub, setSub] = useState(null);
  async function Send(e) {
    e.preventDefault();
    if (!modifuserName === "" || avatar) {
      return;
    }
    const utilisateur = {
      username: modifuserName,
      avatarUrl: avatar,
    };
    const token = localStorage.getItem("access_token");
    const response = await fetch("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(utilisateur),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const transform = await response.json();
    setSub(transform.sub);
  }

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");

  function createPost(e) {
    titleErr("");
    setTitle(e.target.value);
    if (e.target.value === "") {
      return setTitleErr("Titre obligatoire");
    }
  }
  function descriptionPost(e) {
    descriptionErr("");
    setDescription(e.target.value);
    if (e.target.value === "") {
      return setDescriptionErr("Description obligatoire");
    }
  }
  const [modif, setModif] = useState(null);
  async function SendPost() {
    //Ici j'envoie une requete dans mon back avec les donnnées que j'ai insérer dans
    const userPublication = {
      title: title,
      description: description,
    };
    //Je dois aussi envoyer mon token
    const token = localStorage.getItem("access_token");
    const reponse = await fetch("/api/posts/", {
      method: "POST",
      body: JSON.stringify(userPublication),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    //Je vais transformer mon token en json
    const Transform = await reponse.json();
    setModif(Transform.modif);
  }
  const [publiArticle, setpubliArticle] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    async function post() {
      console.log("tets");
      const urlPost = await fetch("/api/users/posts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log(urlPost);
      const transform = await urlPost.json();
      console.log(transform);
      setpubliArticle(transform);
    }
    post();
  }, []);
  return (
    <div>
      <img src={user.avatarUrl ? user.avatarUrl : image}></img>
      <p>{user.email}</p>
      <p>{user.username}</p>
      <button onClick={modifUserName}>Modifier les informations</button>
      <div>
        <label htmlFor="username"></label>
        <input
          type="text"
          placeholder="entre ton pseudo"
          value={modifuserName}
          onChange={modifUserName}
          error={modifUserNameErr}
        />
      </div>
      <div>
        <label htmlFor="avatar"></label>
        <input
          type="text"
          placeholder="Avatar Url"
          value={avatar}
          onChange={enterAvatar}
        />
      </div>
      <button onClick={Send}>Envoyer les modifications</button>
      <div>
        <label htmlFor="titre">Titre</label>
        <input
          type="text"
          placeholder="Ton titre"
          value={title}
          onChange={createPost}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          placeholder="Ton post"
          value={description}
          onChange={descriptionPost}
        />
      </div>
      <button onClick={SendPost}>Envoyer le post</button>
      {
        publiArticle.map((post)=>{
          return <div>
            <p>{post.title}</p>
            <p>{post.description}</p>
          </div>
        })
      }
    </div>
  );
}
// Etape 11  : Page de profile
// [ ] Afficher les données de l'utilisateur (stockés dans le contexte) dans la page de profil.
// *Ici tous se passe dans le html
// [ ] Afficher conditionnellement une image avatar de l'utilisateur suivant si la propriété avatarUrl existe ou non. (Afficher une image par défaut si l'utilisateur n'a pas d'urll pour l'avatar
// Etape 12 : modification du profile
// [ ] Ajouter un formulaire pour modifier le username et l'avatar (Donne un URL vers une image)
// [ ]  Lors de la soumission du formulaire, envoyer une requête PUT vers "/api/me"

//Etape 13: Créer des posts
//[ ] Créer un formulaire avec messages d'erreurs. (title: obligatoire, description: obligatoire)
// [ ] Envoyer une requête avec les données et le token lors de la soumission du formulaire

//Etape 14: Afficher les posts
// [ ] Utiliser un useEffect pour Récupérer tous les posts de l'utilisateur (method: GET  - /api/users/me/posts ).
// [ ] Stocker les articles dans une variables d'état
// [ ] Utiliser la method map, pour afficher tous les articles
