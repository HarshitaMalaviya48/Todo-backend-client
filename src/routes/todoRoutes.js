const express = require('express');
const router = express.Router();
const db = require('../../models');
const todo = db.todo;
const {jwtAuthMiddleware} = require("../jwt.js");

console.log("in todo route", todo);


router.post("/create", jwtAuthMiddleware, async (req, res) => {
    try{
        const {title, description, date} = req.body; 
    const createTodo = await todo.create({
        title,
        description,
        date,
        userId: req.user.userId
    })
    res.status(200).json({message: "Todo created", createTodo});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"})
    }
    
})



module.exports = router;