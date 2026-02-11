
export const getIndexById =(req,res,next) =>{
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

export const getParamsId = (req,res,next) =>{
    const id =parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({msg:"Bad request id"}); //return is for to return once if statement gets executed then below are not going to be execute.
    }
    req.id = id;
    next();
}