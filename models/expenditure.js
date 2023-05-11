const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const Expenditure = sequelize.define('expenditure', {
    id:{
        type: Sequelize.INTEGER,
        allowNUll: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNUll: false
    },
    cashOut:{
        type: Sequelize.INTEGER,
        allowNUll: false,
    }
})

module.exports = Expenditure;
