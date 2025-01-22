const express = require("express");
const fs = require("fs");
const router = express.Router();

const filePath = "./data/library.json";

// const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));

const readData = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return { books: [] };
  }
};
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

// get the books
router.get("/", (req, res) => {
  const data = readData();
  res.json(data.books || []);
});

// Add new book
router.post("/", (req, res) => {
  const { title, author, isbn } = req.body;

  if (!title || !author || !isbn) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const data = readData();
  const newBook = { id: Date.now(), title, author, isbn, isBorrowed: false };
  data.books = data.books || [];
  data.books.push(newBook);

  writeData(data);
  res.status(201).json(newBook);
});

// update book
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, isbn } = req.body;

  const data = readData();
  if (!data.books) data.books = [];

  const book = data.books.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  // Update fields if provided
  if (title) book.title = title;
  if (author) book.author = author;
  if (isbn) book.isbn = isbn;

  writeData(data);
  res.json(book);
});

// delete book
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const filteredBooks = data.books.filter((b) => b.id !== parseInt(id));

  if (data.books.length === filteredBooks.length) {
    return res.status(404).json({ error: "Book not found." });
  }

  data.books = filteredBooks;
  writeData(data);
  res.status(204).send();
});

module.exports = router;

// Borrow a book
router.post("/:id/borrow", (req, res) => {
  const { id } = req.params;
  const { userId, dueDate } = req.body;

  if (!userId || !dueDate) {
    return res.status(400).json({ error: "User ID and due date required!" });
  }

  const data = readData();
  const book = data.books.find((b) => b.id === parseInt(id));
  const user = data.users.find((u) => u.id === parseInt(userId));

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (book.borrowedBy) {
    return res.status(400).json({ error: "Book is already borrowed." });
  }

  // Borrow the book
  book.borrowedBy = userId;
  book.dueDate = dueDate;

  writeData(data);
  res.json({ message: "The book has successfully borrowed.", book });
});

// Return the book
router.post("/:id/return", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const book = data.books.find((b) => b.id === parseInt(id));

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  if (!book.borrowedBy) {
    return res.status(400).json({ error: "Book is not currently borrowed." });
  }

  // return the book
  book.borrowedBy = null;
  book.dueDate = null;

  writeData(data);
  res.json({ message: "Book returned!", book });
});
