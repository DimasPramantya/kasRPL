require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs')

const { validateUserCreatePayload, validateUserLoginPayload } = require("../validations");
const secretKey = process.env.SECRET_KEY;

const User = require("../models/user");
const Role = require('../models/role');
const cloudinary = require('../utils/cloudinary');

const getToken = (headers) => {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return (authorizationHeader.substring(7)); // Remove 'Bearer ' from the header
    }
    else {
        throw new Error("You need to login");
    }
}

const userRegisterHandler = async (req, res, next) => {
    try {
        const { fullName, username, email, password, confPass, division } = req.body;
        validateUserCreatePayload({ fullName, username, email, password, confPass, division });
        const duplicateEmail = await User.findOne({
            where: {
                email
            }
        })
        if (duplicateEmail) {
            throw new Error("Email has been registered")
        }
        const role = await Role.findOne({
            where: {
                name: "Member"
            }
        })
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            division,
            roleId: role.id
        })
        const payload = {
            role: role.name,
            userId: newUser.id,
        }
        const token = jwt.sign(payload, secretKey, {
            algorithm: 'HS256'
        })
        res.json({
            message: "Register Successfull!",
            role: role.name,
            token
        });
    } catch (error) {
        next(error)
    }
}

const userLoginHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        validateUserLoginPayload({ email, password });
        const loggedUser = await User.findOne({
            where: {
                email
            }
        });
        if (!loggedUser) {
            throw new Error("Wrong email or password")
        }
        const validatePassword = await bcrypt.compare(password,loggedUser.password);
        if (!validatePassword) {
            throw new Error("Wrong email or password")
        }
        const role = await loggedUser.getRole();
        const token = jwt.sign({
            role: role.name,
            userId: loggedUser.id,
            username: loggedUser.username
        }, secretKey);
        res.json({
            role: role.name,
            token,
            message: "Login Successfull!"
        })
    } catch (error) {
        next(error)
    }
}

const getUserDataHandler = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        const loggedUser = await User.findOne({ where: { id: decoded.userId }, attributes: { exclude: ['password', 'email'] } });
        const bills = await loggedUser.getBills();
        res.json({bills, username: loggedUser.username, division: loggedUser.division});
    } catch (error) {
        next(error);
    }
}

const userGetTheBillHandler = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        const loggedUser = await User.findOne({ where: { id: decoded.userId }, attributes: { exclude: ['password', 'email', 'username'] } });
        const { billId } = req.params;
        const currentBill = await loggedUser.getBills({ where: { id: billId } });
        res.json(currentBill);
    } catch (error) {
        next(error)
    }
}

const userPayTheBillHandler = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        const loggedUser = await User.findOne({ where: { id: decoded.userId }, attributes: { exclude: ['password', 'email', 'username'] } });
        const { billId } = req.params;
        const { method } = req.body;
        const currentBill = await loggedUser.getBills({ where: { id: billId } });
        currentBill[0].payment.method = method;
        currentBill[0].payment.status = "Proses"
        // Upload image to Cloudinary
        if (req.file) {
            console.log('test');
            const file = req.file;
            const uploadOptions = {
                folder: 'payment_images/', // Specify the folder in Cloudinary where you want to store the images
                public_id: `payment_${currentBill[0].payment.id}`, // Assign a unique public ID for the image
                overwrite: true // Overwrite if the image with the same public ID already exists
            };

            // Upload the image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, uploadOptions);

            // Retrieve the URL of the uploaded image
            const imageUrl = uploadResult.secure_url;

            // Save the image URL to the currentBill or perform any other necessary operations
            currentBill[0].payment.proof = imageUrl;

            // Delete the temporary file from the server
            fs.unlinkSync(file.path);
        }
        await currentBill[0].payment.save();
        res.json({currentBill,method})
    } catch (error) {
        next(error)
    }
}


module.exports = { userRegisterHandler, userLoginHandler, getUserDataHandler, userGetTheBillHandler, userPayTheBillHandler }