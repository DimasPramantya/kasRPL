const Sequelize = require('sequelize');

const sequelize = require('../utils/db');

const Role = sequelize.define('role',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    type:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Role;