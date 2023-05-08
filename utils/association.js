const sequelize = require('./db');
const Role = require('../models/role');
const Member = require('../models/member');
const Bill = require('../models/bill');
const Payment = require('../models/payment');

Member.belongsTo(Role);
Role.hasMany(Member);

Bill.belongsToMany(Member, {through: Payment})

const association = async()=>{
    try {
    await sequelize.sync({/*force:true*/});
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;
