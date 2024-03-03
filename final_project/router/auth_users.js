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
        return res.status(404).json({message: 'Error logging in'});
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60*60});
        
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({message: "Invalid login, check username and password"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const username = req.session.authorization['username']
    const isbn = req.params.isbn
    const review = req.body.review
    if (isbn in books) {
        books[isbn]["reviews"][username] = review
        res.status(200).json({message: "Review added succesfully"})
    } else {
        res.status(404).json({message: "Book does not exist"})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization['username']
    const isbn = req.params.isbn

    if (isbn in books) {
        delete books[isbn]["reviews"][username]
        res.status(200).json({message: "Review deleted successully"})
    } else res.status(404).json({message: "Book does not exist"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
