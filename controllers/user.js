require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { validateUserCreatePayload, validateUserLoginPayload } = require("../validations");
const secretKey = process.env.SECRET_KEY;

const User = require("../models/user");
const Role = require('../models/role');

const userRegisterHandler = async(req,res,next)=>{
    try {
        const {fullName, username, email, password, confPass, division} = req.body;
        validateUserCreatePayload({fullName, username, email, password, confPass, division});
        const duplicateEmail = await User.findOne({
            where: {
                email
            }
        })
        if(duplicateEmail){
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
        const token = jwt.sign(payload, secretKey,{
            algorithm: 'HS256'
        })
        res.json({
            role: role.name,
            token
        });
    } catch (error) {
        next(error)
    }
}

const userLoginHandler = async(req,res,next)=>{
    try {
        const {email, password} = req.body;
        validateUserLoginPayload({email,password});
        const loggedUser = await User.findOne({
            where:{
                email
            }
        });
        if(!loggedUser){
            throw new Error("Wrong email or password")
        }
        const validatePassword = bcrypt.compare(loggedUser.password, password);
        if(!validatePassword){
            throw new Error("Wrong email or password")
        }
        const role = await loggedUser.getRole();
        const token = jwt.sign({
            role: role.name,
            userId: loggedUser.id
        }, secretKey);
        res.json({
            role: role.name,
            token
        })   
    } catch (error) {
        next(error)
    }
}

const getUserDataHandler = async(req,res,next)=>{
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.substring(7); // Remove 'Bearer ' from the header
        }
        
    } catch (error) {
        next(error);
    }
}



module.exports = {userRegisterHandler, userLoginHandler, getUserDataHandler}