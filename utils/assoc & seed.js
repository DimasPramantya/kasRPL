const sequelize = require('./db');
const Role = require('../models/role');
const User = require('../models/user');
const Bill = require('../models/bill');
const Payment = require('../models/payment');
const Event = require('../models/event');
const Expenditure = require('../models/expenditure');

User.belongsTo(Role);
Role.hasMany(User);

Bill.belongsToMany(User, {through: Payment});
User.belongsToMany(Bill, {through: Payment})

Event.hasMany(Expenditure);
Expenditure.belongsTo(Event);

//Seeders section
const bcrypt = require("bcrypt");
const CashBalance = require('../models/cashBalance');
const FundIncome = require('../models/fundIncome');

const roles = [{
    name:"Admin"
},{
    name:"Member"
}];

const password = bcrypt.hashSync("Intan1234",10) 

const admin = {
    fullName: "Intan",
    division: "Pengurus Inti",
    email: "intan@gmail.com",
    password: password,
    username: "Intan",
};

const cashBalances = [{
    name: "Kas Periode 2020-2021",
    ammount: 2000000
},{
    name: "Kas Periode 2022-2023",
    ammount: 2300000
}]


const association = async()=>{
    try {
    await sequelize.sync({force:true});
    await Role.bulkCreate(roles);
    const adminRole = await Role.findOne({
        where:{
            name: "Admin"
        }
    })
    await adminRole.createUser(admin);
    await CashBalance.bulkCreate(cashBalances);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;
