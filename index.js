import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/welcome.html", (req, res) =>{
    res.sendFile(__dirname + "/public/welcome.html")
})

app.listen(port, () => {
    console.log('server is running!')
})