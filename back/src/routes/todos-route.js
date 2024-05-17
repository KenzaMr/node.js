import express from "express"
import {TodoModel} from "../database/todo-list.js"
export const todosRoute= express.Router()

// Exercice 1:
// Créer une route sur la methode post avec l'url'/'
// Récuperer les données du body: title;
// Tester si dans le body y'a title:
// Si pa title retourne 400 avec erreur
// Sinon: retour message "ok"
todosRoute.post('/',async (req,res)=>{
    const data=req.body
    if(!data.title){
        return res.status(404).json({error:"Erreur"})}
        //Sinon créer une todoliste 
        const newTodoList= new TodoModel({
            title:data.title,
            createdAt: new Date()
        })
        //Enregistrer la todolist dns la base de données
        const todoListAjouter= await newTodoList.save()

        //Retourner en JSON la nouvelle todolist ajouté
        return res.json({todo:todoListAjouter})
    // }else{
    //     return res.end("ok")
    // }
})
// Exercice 2:
// 1. Ajouter un route "GET" sur l'url "/"
// 2. Lire la doc de mongoose pour apprendre a récuperer tous les document du collection.
// 3. Utiliser le model pour récuperer toutes les todos de la DB
// 4. Retourner la liste de toutes les todos. 
todosRoute.get("/",async (req,res)=>{
    //Pour récupérer plusieurs doc on utilise find(), ici j'ai relier la métode find au model qu'on a créer
    const recup= await TodoModel.find()
    //Je retourne la liste que j'ai créer grâce à ma constante recup mais je dois là retourner en JSON
    return res.json({recup})
})

// Exercice 3:
// 1. Ajouter un route sur '/api/todos/id',
// 2. Récuperer l'id depuis les paramètre d'url
// 3. Utiliser le model pour récuperer la todo avec son id
// 4. Si la todo n'existe pas retourner 404
// 5. Si la todo exist retourner la todo
// todosRoute.get('/:id',async (req,res)=>{
    //Ici je créer une constante qui me permettra de récupérer l'id dans l'url
    // const urlId=req.params.id
    // console.log(urlId);
    //Je crée ici une constante qui me permettra de récupérer dans la todo l'id d'ou l'utilisation du find one
//     const recupId= await TodoModel.findOne({_id:urlId})
//     if(!recupId){
//         return res.status(404).json({error:"La todo n'existe pas"})
//     }else{
//         return res.json({recupId})
//     }
// })
// Autre méthode 
// todosRoute.get("/:id",async (req,res)=>{
//     const urlId=req.params.id
//     const recupId= await TodoModel.findById(urlId).exec()
//     if(!recupId){
//         return res.status(404).json({error:"La todo n'existe pas"})
//     }else{
//         return res.json({recupId})
//     }
// })
// Exercice 4:
// 1. Créer la route '/api/todos/id'
// 2. Récuperer l'id dans les paramètre d'url
// 3. Récuperer le titre dans les body de la requete
// 4. Récuperer la todo avec son id
// 4.1 Si elle existe pas, retourner 404
// 4.2 Si elle existe;
    // 4.2.1: Mettre a jour le titre de la todolist
    // 4.2.1: Retourner la todolist
todosRoute.put("/:id",async (req,res)=>{
    const urlId=req.params.id
    const bodyTitle=req.body.title
    const todo= await TodoModel.findById(urlId).exec()
    console.log(todo)
    if(!todo){
        return res.status(404).json({error:"La todo n'existe pas"})
    }else{
        const modif= await TodoModel.updateOne({_id:urlId},{$set:{title:bodyTitle}})
        return res.json(modif)
    }
})
// Exercice 5:
// 1. Ajouter un route Delete avec id dans les paramètre
// 2. Récuperer la tache avec ID
// 3. 404 si ell n'existe pas
// 4. La supprimer si elle existe
// 5. Retourner un message.
todosRoute.delete("/:id", async(req,res)=>{
    const urlId=req.params.id
    const tache= await TodoModel.findById(urlId).exec()
    if(!tache){
        return res.status(404).json({error:"elle n'existe pas"})
    }else{
         await TodoModel.deleteOne({_id:urlId})
        return res.json({message:"La tâche a été supprimé felicitations!"})
    }
})
// METHODE CRUD
// Ici on va ajouter une tâche a une liste CREATE
todosRoute.post("/:id/todo", async(req,res)=>{
    const todolistID=req.params.id
    const todoTitle=req.body.title
    const todoList= await TodoModel.findById(todolistID)
    if(!todoList){
        return res.status(404).json({error:"Todolist introuvable"})

    }
    todoList.todos.push({title:todoTitle})
    await todoList.save() //Le save sert à enregistrer
    return res.json(todoList)
})
//READ: Ici on va récupérer une tache dans une liste par son id 
todosRoute.get("/:listId/:todoId",async(req,res)=>{
    // const listId=req.params.listId
    // const todoId=req.params.todoId
    const{listId,todoId }= req.params
    const todoList= await TodoModel.findById(listId)
    if(!todoList){
        return res.status(404).json({error:"Todolist introuvable"})
    }
    const todo= todoList.todos.id(todoId)
    return res.json(todo)
})
//PUT : ici on va modifier une tache dans la liste 
todosRoute.put("/:listId/:todoId", async (req,res)=>{
    const {listId,todoId}=req.params
    const {title, isDone}= req.body
    const todList= await TodoModel.findById(listId)
    if(!todList){
        return res.status(400).json({error:"Todolist introuvable"})
    }
    const todo= todList.todos.id(todoId)
    todo.set({
        title: title ? title: todo.title,
        isDone:isDone !=undefined ?isDone:todo.isDone
    })
    await todList.save()
    return res.json({message:"Todo modifier"})
})
//DELETE : Supprimer une tâche de la liste avec son id 
todosRoute.delete("/:listId/:todoId", async(req,res)=>{
    const {listId,todoId}=req.params
    const todList= await TodoModel.findById(listId)
    if(!todList){
        return res.status(400).json({error:"Todolist introuvable"})
    }
    const todo= todList.todos.id(todoId)
    todList.todos.pull(todo)
    await todList.save()
    return res.json({message:"Tâche supprimer"})
})