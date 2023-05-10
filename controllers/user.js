require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const { validateUserCreatePayload } = require("../validations");
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
            id: newUser.id,
            username: newUser.username,
            role: newUser.role
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

module.exports = {userRegisterHandler}