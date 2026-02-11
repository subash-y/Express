/*HERE THE IMPORT NAME CAN BE ANYTHING BECOZ WE HAVE
USED A DEFAULT EXPORT.
*/

import express from "express";

import router from "./routes/routes.mjs"
import cookie from "cookie-parser"

const app = express();

const PORT = 3000;

//app.use(express.json()) for parsing JSON - Built-in Middleware

app.use(express.json());

//app.use(logger) – applies to all routes - Application-level

app.use(cookie("Marvel Fans Assembled Here"));

app.use(router);

//which send us msg as root.

app.get("/", (req, res) => {
    res.cookie("user", "helloworld", { maxAge: 60000 * 60, signed:true});
    res.send({ msg: "root" });
})

app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
});
