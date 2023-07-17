const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const RSchema = new mongoose.Schema({
    Fname: {
        type: String,
        required: true
    },
    Lname: {
        type: String,
        required: true
    },
    Gname: {
        type: String,
        required: true
    },
    Adress: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Cpassword: {
        type: String,
        required: true
    },
    Pno: {
        type: String,
        required: true
    },
    Gno: {
        type: String,
        required: true
    },
    Cnic: {
        type: String,
        required: true
    },
    Age: {
        type: String,
        required: true
    },
    Bgroup: {
        type: String,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    role: { 
        type: String
    }, // Role: 'employee', 'student', 'other'
    picture: { 
        type: String
    },
    token: {
        type:String,
        default:''
    },
    usertype: { type: String, default: 'user' }

})


RSchema.pre('save', async function(next){
    if(this.isModified('Password')){
        this.Password = await bcrypt.hash(this.Password,12);
        this.Cpassword = await bcrypt.hash(this.Cpassword,12);
    }
    next();
});

const Reg = mongoose.model('REGISTER', RSchema);
module.exports = Reg;