module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        middleInitial: {
            type: DataTypes.STRING,
            allowNull: true
        },
         yearLevel: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        department: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idNumber: { //this quite un-needed if you think about it
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: () => `STU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Enrolled'  // Default status
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

    return Student;
};
