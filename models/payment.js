const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const Payment = sequelize.define('payment',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    accName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    status:{
        type: Sequelize.ENUM('UNPAID', 'DITOLAK', 'PROSES', 'BERHASIL'),
        allowNull: false
    },
    method:{
        type: Sequelize.ENUM('BCA', 'GOPAY', 'DANA', 'SHOPEEPAY'),
    },
    proof:{
        type: Sequelize.STRING,
    },
}, {
    timestamps: {
        createdAt: {
            field: 'created_at',
            format: 'YYYY-MM-DD HH:mm',
          },updatedAt:{
            field: 'updated_at',
            format: 'YYYY-MM-DD HH:mm',
          }
    },
})

module.exports = Payment;