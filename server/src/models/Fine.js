module.exports = (sequelize, DataTypes) => {
  const Fine = sequelize.define('Fine', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
      student_id: {
      type: DataTypes.INTEGER,
    
    },
     event_id: {
      type: DataTypes.STRING,
      
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'unpaid', 'paid'),
      allowNull: false,
      defaultValue: 'unpaid'
    },
    paid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'fines',
    underscored: true,
    timestamps: true // Adds createdAt and updatedAt fields
  });


   // Define associations
  Fine.associate = (models) => {
    Fine.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student'
    });
    Fine.belongsTo(models.Event, {
    foreignKey: 'event_id',       // Foreign key in Fine table
    targetKey: 'eventId',
      as: 'event'
    });
  };

  return Fine;
};
