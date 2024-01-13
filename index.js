const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const {pool} = require("./dbConfig");
const pg = require("pg");
const bcrypt = require("bcrypt");

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
    //db.end();
})

//app.use(express.static("/public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) =>{
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.post("/register", async (req, res) => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let numbers = /[1234567890]/;
    let {name, email, password, password2} = req.body;

    console.log({name, email, password, password2});

    let errors = [];

    if (!name, !email, !password, !password2){
        errors.push({message: "Please enter all fields"})
    };

    if(password.length < 6){
        errors.push({message: "Password must be at least 6 characters long and must contain at least one number and special character"})
    };

    //|| !format.test(password) || numbers.test(password)

    if(password != password2){
        errors.push({message: "Passwords do not match"})
    };

    if(errors.length > 0){
        res.render("register", {errors});

    } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        db.query(`SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err
            }

            console.log(results.rows);
            if (results.rows.length > 0){
                errors.push({message: "Email already registered"});
                res.render('register', {errors});
            }
        }
        )
    }

    if(errors.length == 0){
        db.query(`INSERT INTO users VALUES ($1, $2, $3)`, [name], [email], [password]);
        console.log("user inserted into table");
        res.render('dashboard');
    }

    console.log("actions completed");
    console.log(errors);


});

app.post("/login", (req, res) => {
    let errors = [];
    let {username, password} = req.body;
    db.query(`SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`, [username], (err, results) => {
        var exist = results.rows[0].exists;
        if(err){
            throw err
        } else if(!exist){
            errors.push({message: "This email does not exist"});
            res.render('login', {errors});
        } else {
            console.log("got here");
            db.query(`SELECT password FROM users WHERE email = $1`, [username], (err, results) => {
                //let decrypted_password = await bcrypt.hash(password, 10);
                console.log("got here");
                console.log(results.rows[0].password);
                if(err){
                    throw err
                } else if(results.rows[0].password == password){
                    console.log(results.rows[0].password);
                    res.render('dashboard');
            //res.render('dashboard');
                } else {
                    errors.push({message: "Your password is incorrect"});
                    res.render('login', {errors});
                }
            })
        }
    })
});

app.listen(port, () => {
    console.log('server is running!')
})