const express = require("express");
const cors = require("cors");
const path = require("path")

const app = express();

// let's tackel cors
const corsOption = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credential: true
}
app.use(cors(corsOption));
app.use("/uploads",express.static(path.join(__dirname, "uploads")))

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toLocaleString()}] request made at : ${req.originalUrl}`
  );
  next();
};

app.use(logRequest);

const personRoutes = require("./src/routes/userRoutes");
const todoRoutes = require("./src/routes/todoRoutes");
const authRoutes = require("./src/routes/authRoutes");

app.use("/auth", authRoutes);
app.use("/user", personRoutes);
app.use("/todo",todoRoutes)

app.use((req,res) => {
  res.status(404).json({error: "Route not found"});
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = {app}
