const Sequelize = require('sequelize');
const sequelize = require('../utils/db');

const FundIncome = sequelize.define('fundIncomes', {
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
    fundSource:{
        type: Sequelize.STRING,
        allowNUll: false
    },
    ammount:{
        type: Sequelize.INTEGER,
        allowNUll: false,
    },
},{
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

module.exports = FundIncome;
