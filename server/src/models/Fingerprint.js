module.exports = (sequelize, DataTypes) => {
  const Fingerprint = sequelize.define('Fingerprint', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enrolledFMD1: {
      type: DataTypes.TEXT('long'),  // Enrolled template for index finger
      allowNull: false
    },
    enrolledFMD2: {
      type: DataTypes.TEXT('long'),  // Enrolled template for middle finger
      allowNull: false
    }
  });

  return Fingerprint;
};
