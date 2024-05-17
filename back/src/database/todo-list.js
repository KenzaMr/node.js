import mongoose from "mongoose";
// Définir un schéma 
const TodoListSchema=mongoose.Schema({
    title:{type:String, required:true},
    createdAt:{type:Date},
    todos:[
        {
            title:{type:String, required:true},
            isDone:{type: Boolean, required:true, default:false}
        }
    ]
})
// Exporter le model pour etre utiliser ailleur
export const TodoModel=mongoose.model("todolist", TodoListSchema)