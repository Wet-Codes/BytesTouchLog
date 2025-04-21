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
      type: DataTypes.JSON, // ✅ Now stores an array of 4 minutiae samples
      allowNull: false
    },
  }, {
    tableName: "fingerprints",
    timestamps: true,
  });

  return Fingerprint;
};