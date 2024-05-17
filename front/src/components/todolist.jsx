import { useEffect, useState } from "react";
// Créer un composant /components/TodoList.jsx
// Il 'yaura un input et un bouton
// Quand on clique sur le bouton, afficher dans une alerte l'entrée de l'utilisateur

export function TodoList() {
  const [texte, setTexte] = useState("");
  const [message, setmessage] = useState({ success: true, content: "" });
  const [listeTodo, setListeTodo] = useState([]);
  function frappe(e) {
    setTexte(e.target.value);
  }

  useEffect(() => {
    async function liste() {
      const todoliste = await fetch("/api/todos");
      const tableau = await todoliste.json();
      setListeTodo(tableau.recup);
    }
    liste();
  }, []);

  async function valideFormulaire() {
    if (texte === "") {
      return setmessage({ success: false, content: "titre obligatoire" });
    }
    const reponse = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: texte }),
      headers: { "Content-type": "application/json" },
    });
    const data = await reponse.json();
    return setmessage({ success: true, content: "Tâche ajoutée" });
  }
  return (
    <>
      <div>
        <input type="text" onChange={frappe} />
        <button onClick={valideFormulaire}>Valider</button>
        <p style={{ color: message.success ? "green" : "red" }}>
          {message.content}
        </p>
        {listeTodo.map((element) => {
          return <p>{element.title}</p>;
        })}
      </div>
    </>
  );
}
// Exercice:
// 1. Créer une variable d'état: message: {success:boolean, message:string}
// 2. L'afficher dans le JSX
// 3. Quand l'utilisateur clique:
// 3.1 Test: Si l'input est vide afficher le message "Message Obligtoire"
// 3.2 Envoyer la requete, afficher un message de succés

//Exercice:
// Utiliser le useEffect et fetch pour récuperer les listes de tache
//On utilise UseEffect la plupart du temps poour faire des requêtes HTTP, c'est effectuer une action aprés qu'on est rendu des composant
// Stocker les liste de taches dans une variable d'état
// Utiliser un boucle pour afficher chaque liste de taches
