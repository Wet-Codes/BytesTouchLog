module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      defaultValue: () => {
        const randomString = Math.random().toString(36).substr(2, 9).toUpperCase();
        return `EVT-${Date.now().toString().substr(-4)}-${randomString}`;
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
 

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  });


Event.associate = (models) => {
  Event.belongsToMany(models.PaymentLog, {
    through: 'PaymentEvents',
    foreignKey: 'eventId', // Changed from 'eventIds' to 'eventId'
    as: 'payments'
  });
};




  return Event;


  
};