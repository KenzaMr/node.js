import express from "express";
import { UserModel } from "../database/user.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import{ModifModel} from "../database/post.js"

export const usersRouter = express.Router();
const SECRET_KEY = "azerty";
usersRouter.post("/inscription", async (req, res) => {
  console.log(req.body);

  // * Step 1: Test the received data
  const { email, password, username } = req.body;

  if (!email.includes("@") || username === "" || password.length < 6) {
    return res.status(400).json({ error: "incorrect data" });
  }

  //   * Step 2: Test if the user exists
  const userFromDB = await UserModel.find({ email: email });
  console.log(userFromDB);
  if (userFromDB.length > 0) {
    return res.status(401).json({ error: "this user already exists" });
  }

  // * Step 3: Hash the password
  const hashedPassword = await bcrypt.hash(password, 6);
  console.log(hashedPassword);

  // * Step 4: Register the user
  const newUser = new UserModel({
    email,
    hashedPassword,
    username,
  });

  const user = await newUser.save();
  console.log(user);
  return res.json({
    user: {
      email: user.email,
      username: user.username,
      id: user._id,
    },
  });
});

// Exercice:
// Créer un route: /api/user/connexion
// Verifier si l'email et le mot de passe on ete réçu dans le coprs de la requete sinon retourner un erreur
// Récuperer l'utilisateur depuis la base de données avec son mail, retourner un erreur si il n'existe pas
// Verifier si le mot de passe est correcte (utiliser la methode compare de bcrypt)
// Retourner l'utilisateur dans la réponse

usersRouter.post("/connexion", async (req, res) => {
  const Email = req.body.email;
  const MdpBody = req.body.password;
  const identifiant = await UserModel.find({ email: Email });
  console.log(Email);
  if (!Email || !MdpBody) {
    return res.status(400).json({ error: "Email manquant" });
  }
  if (identifiant.length == 0) {
    return res.status(400).json({ error: "Identifiant innexistant" });
  }
  const passwordUsers = identifiant[0].hashedPassword;
 
  const VerifPassword = await bcrypt.compare(MdpBody, passwordUsers);
  console.log(VerifPassword);
  if (!VerifPassword) {
    return res.status(400).json({ error: "Donnée incorrecte" });
  }
  const access_token = jsonwebtoken.sign({ id: identifiant[0]._id }, SECRET_KEY);
  console.log(access_token);
  return res.json({ user: identifiant, access_token });
});

usersRouter.get("/me", async (req, res) => {
  const  access_token  = req.headers.authorization;
  const token = access_token.split(" ")[1];
  console.log(access_token);
  const verifieToken = jsonwebtoken.verify(token, SECRET_KEY);

  if (!verifieToken) {
    return res.status(400).json({ error: "Token invalide" });
  }
  const user = await UserModel.findById( verifieToken.id );
  return res.json({ user });
});

//Etape 12: Modification du profile 
// Dans la back
// [ ] Ajouter la route PUT sur /api/me
// [ ] Récupérer les données du corps de la requête
// [ ] Valider les données sinon retourner 400
// [ ] Verifier le token de l'utilisateur sinon retourner 401
// [ ] Modifier l'utilisateur dans la base de données
// [ ] Retourner l'utilisateur dans la répons
usersRouter.put('/me', async (req,res)=>{
const userName= req.body.username
if(!userName ){
  return res.status(400).json({error:"Modification impossible"})
}
const tokenUser= req.headers.authorization
console.log(tokenUser);
const verifieToken= jsonwebtoken.verify(tokenUser,SECRET_KEY)
if(!verifieToken){
  return res.status(401).json({error:"Token faux"})
}
const user= await UserModel.findByID(verifieToken.id)
user.username=userName
await user.save()
return user
})

//Etape 13 : Créer des posts
// [ ] Ajouter la route POST /api/posts
// [ ] Récupérer les données dans le corps de la requête
// [ ] Valider les données sinon 400
// [ ] Verifier la validité tu token sinon 401
// [ ] Créer le post dans la base de données
// [ ] Retourner le nouveau post
usersRouter.post('/posts', async (req,res)=>{
  const dataSend=req.body
  if(!dataSend){
    return res.status(400).json({error:"Publication impossible"})
  }
  const tokenPublication=req.headers.authorization
  const checkToken=jsonwebtoken.verify(tokenPublication, SECRET_KEY)
  if(!checkToken){
    return res.status(401).json({error:'Token pas bon'})
  }
  const newPublication= new ModifModel({
    userID:checkToken.id,
    title:dataSend.title,
    description:dataSend.description,
    imageUrl:dataSend.imageUrl
  })
  const newPublactionAjouter= await newPublication.save()
  return res.json({post:newPublactionAjouter})
})

// Etape 14 Afficher les posts
// Dans le back:
// [ ] Ajouter la route GET /api/me/posts
// [ ] Récupérer et retourner les post dont userID est égale a l'identifiant de l'utilisateur récupérer dans le token
usersRouter.get('/posts', async (req,res)=>{
  const toktok=req.headers.authorization
  const verifietoktok= jsonwebtoken.verify(toktok.split(" ")[1], SECRET_KEY)
  const RecupPost= await ModifModel.find({userID :verifietoktok.id})
  return res.json(RecupPost)
})