module.exports = (sequelize, DataTypes) => {
  const PaymentLog = sequelize.define('PaymentLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
     
  }, {
    timestamps: true,
    updatedAt: false,
    createdAt: 'timestamp'
  });

  PaymentLog.associate = (models) => {
     PaymentLog.belongsTo(models.User, {
    foreignKey: 'adminId',
    as: 'admin'
    }),

    PaymentLog.belongsTo(models.Student, {
    foreignKey: 'studentId',
    as: 'student'
  }),
  
 PaymentLog.belongsToMany(models.Event, {
    through: 'PaymentEvents',
    foreignKey: 'paymentId',
    as: 'events'
  })


;
  
  

  };

  return PaymentLog;
};