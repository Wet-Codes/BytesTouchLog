const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Fingerprint', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fingerprintData: {  // Store raw samples
      type: DataTypes.JSON,
      allowNull: false
    },
    fingerprintTemplate: {  // Optional, can be null
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['userId'],
        where: {
          userId: {
            [Sequelize.Op.ne]: null
          }
        }
      }
    ]
  });
};