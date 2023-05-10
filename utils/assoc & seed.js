const sequelize = require('./db');
const Role = require('../models/role');
const Member = require('../models/member');
const Bill = require('../models/bill');
const Payment = require('../models/payment');

Member.belongsTo(Role);
Role.hasMany(Member);

Bill.belongsToMany(Member, {through: Payment});

//Seeders section
// const bcrypt = require("bcrypt");

// Role.findOne({
//     where: {
//         name: "Admin"
//     }
// }).then((admin)=>{
//     console.log(admin);
//     const password = bcrypt.hashSync("Intan1234",10);
//     admin.createMember({
//         fullName: "Intan",
//         division: "Pengurus Inti",
//         email: "intan@gmail.com",
//         password,
//         username: "Intan",
//     })
// })

const association = async()=>{
    try {
    await sequelize.sync({/*force:true*/});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;
