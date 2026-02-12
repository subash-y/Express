import { Router } from "express";
import { getIndexById, getParamsId } from "../utils/middleWare.mjs"
import { creatUserValidationSchema } from "../utils/validationSchemas.mjs"
import { validationResult, matchedData, checkSchema } from "express-validator"
import {users} from "../utils/constants.mjs"
import { User } from "../mongoose/schema/users.mjs";
import { hashPassword } from "../utils/helper.mjs";

const router = Router();

router.get("/api/users", async (req, res) => {
    console.log(req.signedCookies);

    if (req.signedCookies.user && req.signedCookies.user === "helloworld") {
        try {
            const { query: { filter, value } } = req;

            let users;
            if (filter && value) {
                // Build a dynamic query using regex for case-insensitive search
                const searchQuery = {};
                searchQuery[filter] = { $regex: value, $options: "i" };

                users = await User.find(searchQuery);
            } else {
                users = await User.find({});
            }

            return res.send(users);
        } catch (err) {
            console.error(err);
            return res.status(500).send({ msg: "Error fetching users from database." });
        }
    } else {
        res.status(404).send({ msg: "You don't have the right cookie/You are not the Admin." });
    }
});


router.get("/api/users/:id", getParamsId, (req, res) => {
    const id = req.id;
    const user = users.find((user) => user.id === id)
    if (user) {
        return res.send(user);
    }
    return res.status(404).send({ msg: "User not found!" });
});

//POST req ->Creation


router.post("/api/users", checkSchema(creatUserValidationSchema), 
    async (req, res) => { // async is used because await is used for .save().

    const result = validationResult(req);
    // console.log(result);
    // console.log(req['express-validator']);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() })
    }

    const body = matchedData(req);
    //Hasing the password...
    body.password = hashPassword(body.password);
    //Create new user using mongoose schema
    const newUser = new User(body);
    try{
         //Saving the new User
        const savedUser = await newUser.save(); // await => used to wait for saving the new user data in DB,because .save() is async function 
        return res.status(201).send(savedUser);
    }
    catch(err){
        console.log(err);
        return res.status(400).send({msg:"User not saved."})
    }
});


//PUT req -> UPDATE, Complete updation

router.put("/api/users/:id", getIndexById, (req, res) => {  //getIndexById act as a middleware.
    const userIndex = req.userIndex;
    const { body } = req;
    users[userIndex] = { id: id, ...body };
    return res.status(200).send({ msg: "User updated successfully" });
});

//PATCH -> Partial req,Updating the particular field.

router.patch("/api/users/:id", getIndexById, (req, res) => {

    const userIndex = req.userIndex
    const { body } = req;
    users[userIndex] = { ...users[userIndex], ...body };
    //Body will replace if there is already existing key-value pair,if its missing the add newly.Order is important
    //First we should give existing users data then new one.
    console.log(users[userIndex]);
    console.log(body);
    return res.sendStatus(200);
})

router.delete("/api/users/:id", getIndexById, (req, res) => {
    const userIndex = req.userIndex
    users.splice(userIndex, 1);
    res.sendStatus(200);
})


export default router;