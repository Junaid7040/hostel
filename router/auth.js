const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const cors = require('cors');

router.use(cors());
require("../DB/conn")
const User = require('../schema/RegisterSchema');
const Otp = require('../schema/otpSchema')
const config = require('../DB/confi')


const mailer = async (Email, otp) => {
        var nodemailer = require('nodemailer')
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'junii7040@gmail.com',
                pass: '03317055539juN'
            }
        });
        var mail = {
            from: 'junii7040@gmail.com',
            to: 'imjunaidnoor@gmail.com',
            subject: 'Reset Password',
            text:'thanks'
        };
        transporter.sendMail(mail, function(error, info){
            if(error){
                consol.log('error')
            }else{
                console.log('Email sent' + info.response);
            }
        });
}


router.get('/', (req, res) => {
    res.send('junaidahmad');
})


router.post('/register', async (req, res) => {
    const { Fname, Lname, Gname, Adress, City, State, Email, Password, Cpassword, Pno, Gno, Cnic, Age, Bgroup, Gender, role } = req.body;

    if (!Fname || !Lname || !Gname || !Adress || !City || !State || !Email || !Password || !Cpassword || !Pno || !Gno || !Cnic || !Age || !Bgroup || !Gender) {
        return res.status(422).json({ error: "Please enter all given fields" });
    }

    try {
        const emailExist = await User.findOne({ Email: Email })
        if (emailExist) {
            return res.status(422).json({ error: "Email already exists" });
        }
        const cnicExist = await User.findOne({ Cnic: Cnic })
        if (cnicExist) {
            return res.status(422).json({ error: "Cnic already exists" });
        } else if (Password !== Cpassword) {
            return res.status(422).json({ error: "Password is not correct" });
        } else {
            const user = new User({ Fname, Lname, Gname, Adress, City, State, Email, Password, Cpassword, Pno, Gno, Cnic, Age, Bgroup, Gender, role });

            await user.save();
            res.status(201).json({ message: "User registered successfully" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server error" });
    }
});




// promise method


// User.findOne({ Email: Email })
//     .then((userExist) => {
//         if (userExist) {
//             return res.status(422).json({ error: "Email or Cnic exits" });
//         }
//         const user = new User({Fname, Lname, Gname, Adress, City, Email, Password, Cpassword, Pno, Gno, Cnic, Age})
//         user.save().then(() => {
//             res.status(201).json({ message: "saved!!" });
//         }).catch((err) => res.status(500).json({ message: "Failed!!" }));
//     }).catch(err => { console.log(err); });



// login Router


router.post('/login', async (req, res) => {
    try {

        const { Cnic, Password } = req.body;


        if (!Cnic || !Password) {
            return res.status(400).json({ error: "invalid credentials" });
        }


        const CnicExist = await User.findOne({ Cnic: Cnic });
        if (CnicExist) {
            const match = await bcrypt.compare(Password, CnicExist.Password);

            if (match) {
                res.status(200).json({ message: 'User login successfully' });
            } else {
                res.status(401).json({ error: "invalid credentials" });
            }
        } else {
            res.status(401).json({ error: "invalid credentials" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
    }
});


// //Forgot password
// router.post('/forgottenpassword', async (req, res) => {
//     try {
//         const Email = req.body.Email;

//         const user = await User.findOne({ Email: Email });
//         if (user) {
//             const randomString = randomstring.generate();
//             await User.updateOne({ Email: Email }, { token: randomString } );
//             res.status(200).json({ message: 'Reset password email sent successfully' });

//             resetpassword(user.Fname, user.Email, randomString)


//         } else {
//             res.status(200).json({ error: "email does not exist" });
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(400).json({ error: "ERROR" });
//     }
// });


router.post('/email-send', async (req, res) => {
    let data = await User.findOne({ Email: req.body.Email });
    console.log(data);
    const responseType = {};
    if (data) {
        let otpcode = Math.floor((Math.random() * 10000) + 1);
        let otpData = new Otp({
            Email: req.body.Email,
            Code: otpcode,
            ExpireIn: new Date().getTime() + 300 * 1000
        })
        await otpData.save();
        responseType.statusText = 'Success'
        responseType.message = 'Plz chek your email ID';
    } else {
        
    }
    res.status(200).json(responseType);
});

router.post('/change-password', async (req, res) => {
    let data = await Otp.find({Email:req.body.Email,Code:req.body.Code});
    const response = {}
    if (data){
        let currentTime = new Date().getTime();
        let diff = data.ExpireIn - currentTime;
        if(diff<0){
            response.message = 'Token Expire';
            response.statusText = 'error'
        }else{
            let user = await User.findOne({Email:req.body.Email});
            user.Password = req.body.Password;
            user.save();
            response.message = 'Password changed';
            response.statusText = 'success'
        }
    }else{
        response.message = 'Invalid Otp';
        response.statusText = 'error'
    }
    res.status(200).json(response);
    

});





module.exports = router;