import express from "express";

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




app.get("/api/users",(req,res) =>{
    console.log(req.query);
    
    const {query:{filter, value}} = req;  //object destructing.
    console.log(filter,value);
    if(filter && value){
    return res.send(users.filter((user) => user[filter].toLowerCase().includes(value).toLowerCase())); //tolowercase is used because always the url parameters in smallcase.
    }
    return res.send(users);

})


app.get("/api/users/:id",(req,res) =>{
    
    const id =parseInt(req.params.id);
    //console.log(req.params);
    if(isNaN(id)){
        return res.status(400).send({msg:"Bad request id"}); //return is for to return once if statement gets executed then below are not going to be execute.
    }

    const user = users.find((user) => user.id === id)
    if(user){
        return res.send(user);
    }
    return res.status(404).send({msg:"User not found!"});
});

app.get("/",(req,res)=>{
    res.send({msg:"root"});
})


//POST req ->Creation
app.use(express.json()); //use() is used as middleware
app.post("/api/users",(req,res)=>{
    console.log(req.body);
    const {body} = req;
    const newUser = {id: users[users.length-1].id+1, 
    ...body}
    users.push(newUser);
    return res.status(201).send(newUser);
})  


//PUT req -> UPDATE, Complete updation

app.put("/api/users/:id",(req,res) =>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
         return res.status(400).send({msg:"Bad request id"});
    } 
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1){
        return res.status(400).send({msg:"Bad request id"});
    }
    const {body} = req;
    users[userIndex] = {id: id , ...body};
    return res.status(200).send({msg:"User updated successfully"});
});

//PATCH -> Partial req,Updating the particular field.

app.patch("/api/users/:id",(req,res)=>{

    const id = parseInt(req.params.id);
    if(isNaN(id)){
         return res.status(400).send({msg:"Bad request id"});
    } 
    const userIndex = users.findIndex((user) => user.id === id);
    console.log(userIndex);
    if (userIndex === -1){
        return res.status(400).send({msg:"Bad request id"});
    }
    const {body} = req;
    users[userIndex] ={...users[userIndex], ...body}; 
    //Body will replace if there is already existing key-value pair,if its missing the add newly.Order is important
    //First we should give existing users data then new one.
    console.log(users[userIndex]);
    console.log(body);
    return res.sendStatus(200);
})

app.delete("/api/users/:id",(req,res) =>{
     const id = parseInt(req.params.id);
    if(isNaN(id)){
         return res.status(400).send({msg:"Bad request id"});
    } 
    const userIndex = users.findIndex((user) => user.id === id);
    console.log(userIndex);
    if (userIndex === -1){
        return res.status(400).send({msg:"Bad request id"});
    }
    users.splice(userIndex,1);
    res.sendStatus(200);
})


app.listen(PORT,() =>{
    console.log(`App is running on PORT ${PORT}`);
});
