require('dotenv').config();
const jwt = require('jsonwebtoken');

const Bill = require("../models/bill");
const Member = require("../models/user");
const { validateAdminCreateBillPayload } = require('../validations');
const Role = require('../models/role');

const secretKey = process.env.SECRET_KEY;

const getToken = (headers)=>{
    const authorizationHeader = headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return(authorizationHeader.substring(7)); // Remove 'Bearer ' from the header
    }
    else{
        throw new Error("You need to login");
    }
}

const verifyAdmin = (token)=>{
    const decoded = jwt.verify(token,secretKey)
    if(decoded.role != "Admin"){
        throw new Error("You don't have Access");
    }
    return decoded;
}

const getPaymentsData = (req,res,next)=>{
    try {
        let token = getToken(req.headers)
        const decoded = verifyAdmin(token)
        res.json({decoded})    
    } catch (error) {
       next(error)
    }
    
}

const postBill = async(req,res,next)=>{
    try {
        let token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const {name, price} = req.body;
        validateAdminCreateBillPayload({name,price});
        const member = await Role.findOne({where: {name: "Member"}});
        const persons = await member.getUsers();
        const currentBill = await Bill.create({name,price});
        for(let person of persons){
            await currentBill.addUser(person, {through: {status: "Unpaid", method:""}});
        }
        res.json({decoded})
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getPaymentsData, postBill
};