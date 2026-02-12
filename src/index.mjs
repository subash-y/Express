/*HERE THE IMPORT NAME CAN BE ANYTHING BECOZ WE HAVE
USED A DEFAULT EXPORT.
*/

import express from "express";
import router from "./routes/routes.mjs"
import cookie from "cookie-parser"
import session from "express-session"
import { Strategy as localStrategy } from "passport-local"
import passport from "passport";
import mongoose from "mongoose"
import { User } from "./mongoose/schema/users.mjs";
import { comparePassword } from "./utils/helper.mjs";

mongoose.connect('mongodb://192.168.0.105:27017/express')
    .then(() => console.log("DB connected.."))
    .catch((err) => console.log(`Error:${err}`));

const app = express();

const PORT = 3000;

//app.use(express.json()) for parsing JSON - Built-in Middleware

app.use(express.json());

//app.use(logger) – applies to all routes - Application-level

app.use(cookie("Marvel Fans Assembled Here"));

app.use(
    session({
        secret: "Wanjdnjvnvjrkgnjkb4efjei", // used to sign the session ID cookie
        saveUninitialized: false, // save new sessions
        resave: false, // don’t save session if unmodified
        cookie: {
            maxAge: 60000 * 60
        }
    }));


app.use(passport.initialize());
app.use(passport.session());
/*
user_name:Ysubash
password:1283456
*/

passport.use(new localStrategy(
    { usernameField: "user_name", passwordField: "password" },
    async (user_name, password, done) => {
        try {
            const user = await User.findOne({ user_name: user_name });
            if (!user) {
                return done(null, false, { message: "Invalid username." });
            }
            if (comparePassword(password,user.password)) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        }
        catch (err) {
            return done(err, false);
        }

    }));

passport.serializeUser((user, done) => {

    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try{
    const user = await User.findById(id);
    done(null,user)
    }
    catch(err){
        console.log(err);
        done(err, false);
    }
    
});

app.use(router);

//which send us msg as root.

app.get("/", (req, res) => {
    res.cookie("user", "helloworld", { maxAge: 60000 * 60, signed: true });
    /*To see the session details.
    console.log(req.session);*/

    //To see the session id.
    console.log(req.sessionID);

    //To verify that client has sent the cookie with session to the server.
    //sessionSStore -> stores all the session details

    req.sessionStore.get(req.sessionID, (err, sessionData) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(sessionData);
        }
    })
    res.send({ msg: "root" });
})

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).send({ message: info?.message || "Login Failed." });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            return res.json({ message: "Login Successful", user });
        });
    })(req, res, next); //calling the callback function immediately once we have finished the definition.
})


app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
