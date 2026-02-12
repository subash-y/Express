import { Router } from "express";
import {getParamsId} from "../utils/middleWare.mjs"
import {products} from "../utils/constants.mjs"

const router = Router();

router.get("/api/products",(req,res) =>{
    
    req.session.visited = true; //Initialized Session
    console.log(req.sessionID);
    const {query:{filter, value}} = req;  //object destructing.
    if(filter && value){
    return res.send(products.filter((product) => product[filter].toLowerCase().includes(value).toLowerCase())); //tolowercase is used because always the url parameters in smallcase.
    }
    return res.send(products);

})

router.get("/api/products/:id",getParamsId,(req,res) =>{
    const id = req.id;
    const product = products.find((product) => product.id === id)
    if(product){
        return res.send(product);
    }
    return res.status(404).send({msg:"User not found!"});
});

export default router