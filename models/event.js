const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const Event = sequelize.define('event',{
    id:{
        type: Sequelize.INTEGER,
        allowNUll: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNUll: false
    }, date:{
        type: Sequelize.STRING,
        allowNUll: false
    },
    cashOut:{
        type: Sequelize.INTEGER,
        allowNUll: false
    }
},{
    timestamps: false
})

module.exports = Event;