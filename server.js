const express = require("express");

const connectDB = require("./config/db");

// call express

const app = express();

// connect to mangodb

connectDB();

//init middle ware

app.use(express.json({ extended: false }));

// calling routes

app.use("/api/users", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/post", require("./routes/api/posts"));

app.get("/", (req, rest) => rest.send("API Running"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur started on port ${PORT}`));
