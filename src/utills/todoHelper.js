const validateTodo = (title, description, date) => {
    if(!title){
        return "Title is Mandatory";
    }
    if(!description){
        return "Description is Mandatory"
    }
    if(!date){
        return "Date is Mandatory";
    }
}

module.exports = {
    validateTodo
}