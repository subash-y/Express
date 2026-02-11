/*HERE THE IMPORT NAME CAN BE ANYTHING BECOZ WE HAVE
USED A DEFAULT EXPORT.
*/

import express from "express";

import router from "./routes/routes.mjs"
import cookie from "cookie-parser"
import session from "express-session"

const app = express();

const PORT = 3000;

//app.use(express.json()) for parsing JSON - Built-in Middleware

app.use(express.json());

//app.use(logger) – applies to all routes - Application-level

app.use(cookie("Marvel Fans Assembled Here"));

app.use(
    session({
        secret:"Wanjdnjvnvjrkgnjkb4efjei", // used to sign the session ID cookie
        saveUninitialized:false, // save new sessions
        resave:false, // don’t save session if unmodified
        cookie:{
            maxAge:60000 * 60
        }
    }));

app.use(router);

//which send us msg as root.

app.get("/", (req, res) => {
    res.cookie("user", "helloworld", { maxAge: 60000 * 60, signed:true});
    /*To see the session details.
    console.log(req.session);*/
    
    //To see the session id.
    console.log(req.sessionID); 
    
    req.sessionStore.get(req.sessionID, (err,sessionData)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(sessionData);
        }
    })

    res.send({ msg: "root" });
})

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
