module.exports = (sequelize, DataTypes) => {
  const Fingerprint = sequelize.define("Fingerprint", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minutiaeData: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValid(value) {
          if (!Array.isArray(value) || value.length !== 4) {
            throw new Error('Exactly 4 fingerprint samples required');
          }
        }
      }
    },
  }, {
    tableName: "fingerprints",
    timestamps: true,
  });

  return Fingerprint;
};