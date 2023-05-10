require('dotenv').config();
const jwt = require('jsonwebtoken');

const Bill = require("../models/bill");
const Member = require("../models/member");

const secretKey = process.env.SECRET_KEY;

const getPaymentsData = (req,res,next)=>{
    try {
        const authorizationHeader = req.headers.authorization;
        let token;
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            token = authorizationHeader.substring(7); // Remove 'Bearer ' from the header
        }
        else{
            throw new Error("You need to login");
        }
        const decoded = jwt.verify(token,secretKey)
        if(decoded.role != "Admin"){
            throw new Error("You don't have Access");
        }
        res.json({decoded})    
    } catch (error) {
        next(error);
    }
    
}

module.exports = {getPaymentsData};