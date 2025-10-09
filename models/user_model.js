const mongoose = require ('mongoose');
const { stringify } = require('querystring');
const { Schema } = mongoose;

const userSchema= new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    roles:{ 
        type: String,
        enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN', "PARENT"],
        default: 'STUDENT'
    },
    isVerified:{
        type: Boolean,
        default: false
    },

    image: String,
    age: Number




})


const User = mongoose.model('User', userSchema);

  module.exports = User