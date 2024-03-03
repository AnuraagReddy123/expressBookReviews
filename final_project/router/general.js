const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    
    if (username && password) {
        if (!isValid(username)) {
            let user = {
                "username": username,
                "password": password
            }
            users.push(user)
            res.status(200).json({message: "User successfully registered"});
        } else {
            res.status(404).json({messsage: "User already exists"});
        }
    } else {
        res.status(404).json({message: "Unable to register user"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    if (isbn in books) res.status(200).json(books[isbn])
    else res.status(404).json({message: "Book does not exist"})
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let author = req.params.author
    let bookList = []
    for (const key in books) {
        bookList.push(books[key])
    }
    let filtered_books = bookList.filter(book => book.author === author)
    if (filtered_books.length > 0) res.status(200).json(filtered_books)
    else res.status(404).json({message: "No books by that author"})
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    let title = req.params.title
    bookList = []
    for (const key in books) bookList.push(books[key])
    
    let filtered_books = bookList.filter(book => book.title === title)
    if (filtered_books.length > 0) res.status(200).json(filtered_books)
    else res.status(404).json({message: "No books by that title"})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    if (isbn in books) {
        res.status(200).json(books[isbn].reviews)
    } else {
        res.status(404).json({message: "No books by that isbn found"})
    }
});

module.exports.general = public_users;
