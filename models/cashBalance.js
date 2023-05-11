const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const CashBalance = sequelize.define('cashbalance',{
    id:{
        type: Sequelize.INTEGER,
        allowNUll: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNUll: false,
    },
    ammount:{
        type: Sequelize.INTEGER,
        allowNUll: false,
    }
})

module.exports = CashBalance;