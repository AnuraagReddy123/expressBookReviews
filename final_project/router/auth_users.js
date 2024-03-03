const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filtered_users = users.filter(user => user.username === username)
    if (filtered_users.length > 0) return true;
    else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let filtered_users = users.filter(user => {
        return (user.username === username && user.password === password)
    });
    if (filtered_users.length > 0) return true;
    else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).send('Error logging in');
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60*60});
        
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).send("Invalid login, check username and password")
    }
});

regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!isValid(username)) {
            user = {
                "username": username,
                "password": password
            }
            users.push(user)
            res.status(200).send("User successfully registered");
        } else {
            res.status(404).send("User already exists");
        }
    } else {
        res.status(404).send("Unable to register user");
    }
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
