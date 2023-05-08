const Sequelize = require('sequelize');

const sequelize = require('../utils/db');

const Member = sequelize.define('Member',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name:{
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
    divisi:{
        type: Sequelize.ENUM('Kerohanian', 'Pengurus Inti', 'PSDM', 'Minat & Bakat', 'PDD'),
        allowNull: false
    }
})

module.exports = Member;