const {SALT} = process.env;
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            receive_key: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            hp: {
                type: DataTypes.STRING
            },
            password: DataTypes.STRING,
            salt: {
                type: DataTypes.STRING,
            },
            status: DataTypes.STRING,
            dc_id: DataTypes.STRING
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            comment: "유저 테이블"
        }
    );
    /*User.afterFind = (model) =>{
        model.password = ""
        model.salt = ""
        return model
    }*/
    User.associate = (models) => {
        User.hasMany(models.Post, {
            as: 'posts',
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
        User.hasMany(models.PersonalPush, {
            as: 'personal_pushs',
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
        User.hasOne(models.PersonalSetting, {
            as: 'personal_setting',
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
        User.hasMany(models.Comment, {
            as: 'comments',
            foreignKey: 'user_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
    };
    return User;
}
