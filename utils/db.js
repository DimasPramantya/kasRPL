const Sequelize = require('sequelize');

const sequelize = new Sequelize('administrasikas_rpl', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize;