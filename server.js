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
const todoRoutes = require("./src/routes/todoRoutes")

app.use("/user", personRoutes);
app.use("/todo",todoRoutes)

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
