import express from "express";
import {creatUserValidationSchema} from "./utils/validationSchemas.mjs"
import {validationResult,matchedData,checkSchema} from "express-validator"

const app = express();

const PORT = 3000;

const users = [

    {id:1, user_name:"subash"},
    {id:2,user_name:"hello"},
    {id:3,user_name:"world"},
    {id:4,user_name:"Welcome"},
    {id:5,user_name:"DoIt"},
    {id:6,user_name:"super"}
]

const products = [

    {id:1, product_name:"iphone 16"},
    {id:2,product_name:"iphone 17 max"},
    {id:3,product_name:"Realme 11 pro"},
    {id:4,product_name:"s25 ultra"},
    {id:5,product_name:"Moto edge 60"},
    {id:6,product_name:"supernova"}
]

app.get("/",(req,res)=>{
    res.send({msg:"root"});
})

//MiddleWare for finding whether given id by user  is present in the users array[index] or not.
const getIndexById =(req,res,next) =>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
         return res.status(400).send({msg:"Bad request id"});
    } 
    const userIndex = users.findIndex((user) => user.id === id);
    console.log(userIndex);
    if (userIndex === -1){
        return res.status(400).send({msg:"Bad request id"});
    }
    req.userIndex = userIndex;
    next();
}

const getParamsId = (req,res,next) =>{
    const id =parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({msg:"Bad request id"}); //return is for to return once if statement gets executed then below are not going to be execute.
    }
    req.id = id;
    next();
}
//Products

app.get("/api/products",(req,res) =>{
    
    
    const {query:{filter, value}} = req;  //object destructing.
    if(filter && value){
    return res.send(products.filter((product) => product[filter].toLowerCase().includes(value).toLowerCase())); //tolowercase is used because always the url parameters in smallcase.
    }
    return res.send(products);

})

app.get("/api/products/:id",getParamsId,(req,res) =>{
    const id = req.id;
    const product = products.find((product) => product.id === id)
    if(product){
        return res.send(product);
    }
    return res.status(404).send({msg:"User not found!"});
});

app.get("/api/users",(req,res) =>{
    
    
    const {query:{filter, value}} = req;  //object destructing.
    if(filter && value){
    return res.send(users.filter((user) => user[filter].toLowerCase().includes(value).toLowerCase())); //tolowercase is used because always the url parameters in smallcase.
    }
    return res.send(users);

})

app.get("/api/users/:id",getParamsId,(req,res) =>{
    const id = req.id;
    const user = users.find((user) => user.id === id)
    if(user){
        return res.send(user);
    }
    return res.status(404).send({msg:"User not found!"});
});


//POST req ->Creation
app.use(express.json()); //use() is used as middleware

app.post("/api/users",checkSchema(creatUserValidationSchema),(req,res)=>{

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

app.put("/api/users/:id",getIndexById,(req,res) =>{  //getIndexById act as a middleware.
    const userIndex = req.userIndex; 
    const {body} = req;
    users[userIndex] = {id: id , ...body};
    return res.status(200).send({msg:"User updated successfully"});
});

//PATCH -> Partial req,Updating the particular field.

app.patch("/api/users/:id",getIndexById,(req,res)=>{

    const userIndex = req.userIndex
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}; 
    //Body will replace if there is already existing key-value pair,if its missing the add newly.Order is important
    //First we should give existing users data then new one.
    console.log(users[userIndex]);
    console.log(body);
    return res.sendStatus(200);
})

app.delete("/api/users/:id",getIndexById,(req,res) =>{ 
    const userIndex = req.userIndex
    users.splice(userIndex,1);
    res.sendStatus(200);
})


app.listen(PORT,() =>{
    console.log(`App is running on PORT ${PORT}`);
});
