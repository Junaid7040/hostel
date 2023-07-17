const mongoose = require('mongoose');
const OtpSchema = new mongoose.Schema({
    Email: {
        type: String
    },
    Code: {
        type: String
    },
    ExpireIn: {
        type: Number
    }
},
{timestamps:true

})

const Otp = mongoose.model('OTP', OtpSchema, 'otp');
module.exports = Otp;