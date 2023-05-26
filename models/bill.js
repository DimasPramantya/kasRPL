const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const Bill = sequelize.define('bill', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: {
      updatedAt: {
        field: 'updated_at',
        format: 'YYYY-MM-DD HH:mm',
      },
    },
})

module.exports = Bill;