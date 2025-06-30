const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

module.exports = {app}
