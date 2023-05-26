const Sequelize = require('sequelize');

const sequelize = require('../utils/db');

const User = sequelize.define('user',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    fullName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false
    },
    division:{
        type: Sequelize.ENUM('Kerohanian', 'Pengurus Inti', 'PSDM', 'Minat & Bakat', 'PDD', 'Humas'),
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

module.exports = User;