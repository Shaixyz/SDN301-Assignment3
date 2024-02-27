const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({ 
    username: { 
        type: String,
        require: true
    },
    password: { 
        type: String, 
        require: true
    }, 
    name: {
        type: String,
        require: true
    },
    YOB: {
        type: Number,
        require: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{ timestamps: true, });

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;
    