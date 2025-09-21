const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const File = sequelize.define("File", {
  filename: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  key: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  contentType: { 
    type: DataTypes.STRING 
  },
  size: { 
    type: DataTypes.INTEGER 
  },
}, {
  timestamps: true,
  createdAt: "uploadedAt",
  updatedAt: false,
});

module.exports = File;
