import mongoose from "mongoose";
//Etape 13:Créer des posts
// [ ] Créer un schema et model pour les posts: (id, userID, title, description, imageUrl)

//Je défini mon schéma
const UserModifSchema=mongoose.Schema({
    userID:{type:String, required:true},
    title:{type:String, required:true},
    description:{type:String, required:true},
    imageUrl:{type:String}
})
//J'exporte mon schéma 
export const ModifModel= mongoose.model("modifUser",UserModifSchema)