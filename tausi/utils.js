const mongoose = require("mongoose");

const connection = ()=> {

    mongoose.connect('mongodb://localhost/test', {
        useNewUrlParser: true
    });
    
}

module.exports = {connection};