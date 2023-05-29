require('dotenv').config();
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs')

const Bill = require("../models/bill");
const { validateAdminCreateBillPayload } = require('../validations');
const Role = require('../models/role');
const Payment = require('../models/payment');
const User = require('../models/user');
const Event = require('../models/event');
const CashBalance = require('../models/cashBalance');
const Expenditure = require('../models/expenditure');

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

const getAdminDashboard = async(req,res,next)=>{
    try {
        let token = getToken(req.headers)
        const decoded = verifyAdmin(token)
        const bills = await Bill.findAll();
        const paymentData = [];
        for(let bill of bills){
            const data = await bill.getUsers({
                attributes: { exclude: ['password', 'email', 'username', "division", "roleId"] },
            });
            paymentData.push({bill,userBills: data});
        }
        const currBalance = await CashBalance.findOne({where: {name:"Kas Periode 2022-2023"}});
        res.json({paymentData, username: decoded.username, currBalance});
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
            await currentBill.addUser(person, {through: {status: "Unpaid", method:"", accName:""}});
        }
        res.json({message: "Successfully Create Bill"});
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
        const currBill = await Bill.findOne({where: {id: currentPayment.billId}})
        const {status} = req.body;
        const currBalance = await CashBalance.findOne({where: {name: "Kas Periode 2022-2023"}});
        if(status == "BERHASIL"){
            currBalance.ammount += currBill.price;
        }
        currentPayment.status = status;
        await currentPayment.save();
        await currBalance.save();
        res.json({
            currentPayment, currBalance, username: decoded.username
        })
    } catch (error) {
        next(error)
    }
}

const postCreateEventHandler = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const {name, date} = req.body;
        const currEvent = await Event.create({
            name,date
        });
        res.json({message: "Succesfully Create Event!", });
    } catch (error) {
        next(error);
    }
}

const getAllEventHandler = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const events = await Event.findAll();
        res.json({events, username: decoded.username});
    } catch (error) {
        next(error);
    }
}

const getEventHandler = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const {eventId} = req.params;
        const event = await Event.findOne({where: {id:eventId}});
        const eventExpenditures = await event.getExpenditures();
        res.json({eventName: event.name, username: decoded.username, eventExpenditures});
    } catch (error) {
        next(error);
    }
}

const postEventExpenditure = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = verifyAdmin(token);
        const {eventId} = req.params;
        const currEvent = await Event.findOne({where:{id: eventId}});
        const {name, cashOut} = req.body;
        
        const currExpenditure = await Expenditure.create({
            name, cashOut: parseInt(cashOut), eventId:eventId, imageUrl:" "
        })
        // Upload image to Cloudinary
        if (req.file) {
            console.log('test');
            const file = req.file;
            const uploadOptions = {
                folder: `Event Expenditure/${currEvent.name}/`, // Specify the folder in Cloudinary where you want to store the images
                public_id: `payment_${name}`, // Assign a unique public ID for the image
                overwrite: true // Overwrite if the image with the same public ID already exists
            };

            // Upload the image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, uploadOptions);

            // Retrieve the URL of the uploaded image
            const imageUrl = uploadResult.secure_url;

            currExpenditure.imageUrl = imageUrl;

            // Delete the temporary file from the server
            fs.unlinkSync(file.path);
        };
        const currBalance = await CashBalance.findOne({where: {name: "Kas Periode 2022-2023"}});
        currBalance.ammount -= cashOut;
        currBalance.save();
        await currExpenditure.save();
        res.json({currExpenditure, message: "Succesfully Create Event Expenditure"});
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAdminDashboard, postBill, verifyUserPayment, getUserPayment, postCreateEventHandler, getAllEventHandler, postEventExpenditure, getEventHandler
};