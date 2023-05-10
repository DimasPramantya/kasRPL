require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { validateUserCreatePayload, validateUserLoginPayload } = require("../validations");
const secretKey = process.env.SECRET_KEY;

const Member = require("../models/member");
const Role = require('../models/role');

const userRegisterHandler = async(req,res,next)=>{
    try {
        const {fullName, username, email, password, confPass, division} = req.body;
        await validateUserCreatePayload({fullName, username, email, password, confPass, division});
        const duplicateEmail = await Member.findOne({
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
        const newUser = await Member.create({
            fullName,
            username,
            email,
            password: hashedPassword,
            division,
            roleId: role.id
        })
        const payload = {
            userId: newUser.id,
        }
        const token = jwt.sign(payload, secretKey,{
            algorithm: 'HS256'
        })
        res.json({
            user: {
                username: newUser.username,
                division: newUser.division
            },
            token
        });
    } catch (error) {
        next(error)
    }
}

const userLoginHandler = async(req,res,next)=>{
    const {email, password} = req.body;
    await validateUserLoginPayload({email,password});
    const loggedUser = await Member.findOne({
        where:{
            email
        }
    })
    if(!loggedUser){
        throw new Error("Wrong email or password")
    }
    const validatePassword = bcrypt.compare(loggedUser.password, password);
    if(!validatePassword){
        throw new Error("Wrong email or password")
    }
    const token = jwt.sign({
        userId: loggedUser.id
    }, secretKey);
    res.json({
        user: {
            username: loggedUser.username,
            division: loggedUser.division
        },
        token
    })
}

module.exports = {userRegisterHandler, userLoginHandler}