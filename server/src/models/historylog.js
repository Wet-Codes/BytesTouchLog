module.exports = (sequelize, DataTypes) => {
  const HistoryLog = sequelize.define('HistoryLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    updatedAt: false,
    createdAt: 'timestamp'
  });

  HistoryLog.associate = (models) => {
    HistoryLog.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return HistoryLog;
};