import { Router } from "express";
import {getParamsId} from "../utils/middleWare.mjs"

const router = Router();

const products = [

    {id:1, product_name:"iphone 16"},
    {id:2,product_name:"iphone 17 max"},
    {id:3,product_name:"Realme 11 pro"},
    {id:4,product_name:"s25 ultra"},
    {id:5,product_name:"Moto edge 60"},
    {id:6,product_name:"supernova"}
]

router.get("/api/products",(req,res) =>{
    
    
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