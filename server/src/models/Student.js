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
        idNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: () => `STU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        }
    });

    return Student;
};
