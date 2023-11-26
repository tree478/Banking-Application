import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));
import pg from "pg";

const app = express();
const port = 3000;
var data = "";
const db  = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "banking_app_users",
    password: "Soumya12",
    port: 5432
})

db.connect();

db.query("SELECT * FROM users", (err, res) => {
    if (err){
        console.log(err);
        console.error("Error executing query", err.stack);
    } else{
        data = res.rows;
    }
    db.end();
})

app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/welcome.html", (req, res) =>{
    res.sendFile(__dirname + "/public/welcome.html")
})

app.listen(port, () => {
    console.log('server is running!')
})