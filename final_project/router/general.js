const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

  const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }


  public_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 let allBooks = new Promise ((resolve,reject) => {
     setTimeout(() => {
         resolve(books);
     },1000)})

     allBooks.then ((books) => {
         res.send(JSON.stringify(books, null, 4));
     })
 })

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const isbnbook = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(Error("Book not found"));
    }}) 
   isbnbook.then ((book) => {
       res.send(book);
   }) 
    isbnbook.catch ((Error) => {
        res.status(404).send(error.message);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = [];
  
    let authorbooks = new Promise((resolve, reject) => {
      bookKeys.forEach((bookKey) => {
        const book = books[bookKey];
        if (book.author === author) {
          matchingBooks.push(book);
        }
      });
  
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("book not found"));
      }
    });
  
    authorbooks.then((books) => {
        res.send(books);
      })
      authorbooks.catch((error) => {
        res.status(404).send(error.message);
      });
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  let titlebooks = new Promise((resolve, reject) => {
    bookKeys.forEach((bookKey) => {
      const book = books[bookKey];
      if (book.title === title) {
        matchingBooks.push(book);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject(new Error("book not found"));
    }
  });

titlebooks.then((books) => {
      res.send(books);
    })
titlebooks.catch((error) => {
      res.status(404).send(error.message);
    });
}); 

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ["reviews"])
});

module.exports.general = public_users;
