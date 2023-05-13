require('dotenv').config();
const jwt = require('jsonwebtoken');

const Bill = require("../models/bill");
const { validateAdminCreateBillPayload } = require('../validations');
const Role = require('../models/role');
const Payment = require('../models/payment');
const User = require('../models/user');

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

const getPaymentsData = async(req,res,next)=>{
    try {
        let token = getToken(req.headers)
        const decoded = verifyAdmin(token)
        const bills = await Bill.findAll();
        const paymentData = [];
        for(let bill of bills){
            const data = await bill.getUsers({
                attributes: { exclude: ['password', 'email', 'username'] },
            });
            paymentData.push(data);
        }
        res.json(paymentData);
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

const getUserPayment = async(req,res,next)=>{
    try {
        const {paymentId} = req.params;
        const token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const currentPayment = await Payment.findOne({where: {id: paymentId}});
        res.json({
            currentPayment
        })
    } catch (error) {
        next(error)
    }
}

const verifyUserPayment = async(req,res,next)=>{
    try {
        const {paymentId} = req.params;
        const token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const currentPayment = await Payment.findOne({where: {id: paymentId}});
        const {status} = req.body;
        currentPayment.status = status;
        currentPayment.save();
        res.json({
            currentPayment
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getPaymentsData, postBill, verifyUserPayment, getUserPayment
};