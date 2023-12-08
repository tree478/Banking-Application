const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const {dirname} = require("path");
// const {fileURLToPath} = require("url");
// const __directory = dirname(fileURLToPath(meta.url));
const pg = require("pg");

//import {dirname} from "path";
//import { fileURLToPath } from "url";

//import pg from "pg";
//import ejs from "ejs";

const app = express();
const port = 3001;

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
        console.log("database connected");
    }
    db.end();
})

app.use(express.static("/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render("home");
    //res.sendFile(__directory + "/public/home.ejs")
})

app.get("/login", (req, res) =>{
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.listen(port, () => {
    console.log('server is running!')
})