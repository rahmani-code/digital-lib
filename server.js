const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// routes
app.get("/", (req, res) => {
  res.send("Welcome User");
});

// Start the server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
