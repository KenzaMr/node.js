import express from "express"
import mongoose from "mongoose"
import { todosRoute } from "./routes/todos-route.js"
import { usersRouter } from "./routes/user-route.js"

const PORT=4020
const server=express()
server.use(express.json())
server.use('/api/todos',todosRoute) //Pour tous les url qui commencent par api/todos , il va exécuter le routeur
// Ajouter une sur l'url "/api/ping" method GET
// Retourne json avec "pong"
server.use('/api/users',usersRouter)
server.get("/api/ping",(req,res)=>{
    return res.json({message:"pong"})
})
const MONGODB_URI="mongodb://127.0.0.1:27017/todos"
server.listen(PORT,function(){
    console.log('Votre serveur est sur le port 4020 ')
    console.log(`http://localhost:${PORT}`)

    mongoose.connect(MONGODB_URI).then(()=>{
        console.log("Connecté à la base de donnée")
    })
    .catch((err)=>{
        console.log("Pas connecté à ma base de donnée")
        console.log(err)
    })
})
