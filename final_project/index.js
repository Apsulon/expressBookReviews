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
