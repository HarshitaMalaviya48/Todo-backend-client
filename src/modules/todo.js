const {validateTodo} = require("../utills/todoHelper")

exports.todo_create = async (data) => {
    const { title, description, date } = data;

    const validateTodoRes = validateTodo(title, description, date)
    if(validateTodoRes){
        return {
            status_code: 400,
            res: {message: validateTodoRes}
        }
    }
        
        const parsedDate = parse(date, "dd-MM-yyyy", new Date());
    
        if (isNaN(parsedDate)) {
          return res.status(400).json({ message: "date is not valid" });
        }
        const formattedDate = format(parsedDate, "yyyy-MM-dd");
    
        const createTodo = await todo.create({
          title,
          description,
          date: formattedDate,
          userId: req.user.userId,
        });
}