const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    task: {
        type: String,
        require: true
    },
    term: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    award: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('task', taskSchema);