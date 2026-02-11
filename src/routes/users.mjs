import { Router } from "express";
import {getIndexById,getParamsId} from "../utils/middleWare.mjs"
import {creatUserValidationSchema} from "../utils/validationSchemas.mjs"
import {validationResult,matchedData,checkSchema} from "express-validator"
const router = Router();

const users = [

    {id:1, user_name:"subash"},
    {id:2,user_name:"hello"},
    {id:3,user_name:"world"},
    {id:4,user_name:"Welcome"},
    {id:5,user_name:"DoIt"},
    {id:6,user_name:"super"}
]

router.get("/api/users",(req,res) =>{
    
    
    const {query:{filter, value}} = req;  //object destructing.
    if(filter && value){
    return res.send(users.filter((user) => user[filter].toLowerCase().includes(value).toLowerCase())); //tolowercase is used because always the url parameters in smallcase.
    }
    return res.send(users);

})

router.get("/api/users/:id",getParamsId,(req,res) =>{
    const id = req.id;
    const user = users.find((user) => user.id === id)
    if(user){
        return res.send(user);
    }
    return res.status(404).send({msg:"User not found!"});
});

//POST req ->Creation


router.post("/api/users",checkSchema(creatUserValidationSchema),(req,res)=>{

    const result = validationResult(req);
    // console.log(result);
    // console.log(req['express-validator']);
    if(!result.isEmpty()){
        return res.status(400).send({error:result.array()})
    }
    
    const body = matchedData(req);
    const newUser = {id: users[users.length-1].id+1, 
    ...body}
    users.push(newUser);
    return res.status(201).send(newUser);
})  


//PUT req -> UPDATE, Complete updation

router.put("/api/users/:id",getIndexById,(req,res) =>{  //getIndexById act as a middleware.
    const userIndex = req.userIndex; 
    const {body} = req;
    users[userIndex] = {id: id , ...body};
    return res.status(200).send({msg:"User updated successfully"});
});

//PATCH -> Partial req,Updating the particular field.

router.patch("/api/users/:id",getIndexById,(req,res)=>{

    const userIndex = req.userIndex
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}; 
    //Body will replace if there is already existing key-value pair,if its missing the add newly.Order is important
    //First we should give existing users data then new one.
    console.log(users[userIndex]);
    console.log(body);
    return res.sendStatus(200);
})

router.delete("/api/users/:id",getIndexById,(req,res) =>{ 
    const userIndex = req.userIndex
    users.splice(userIndex,1);
    res.sendStatus(200);
})


export default router;