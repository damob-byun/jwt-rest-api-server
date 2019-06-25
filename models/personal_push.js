module.exports = (sequelize, DataTypes) => {


    const PersonalPush = sequelize.define('PersonalPush', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            push_seq: {
                type: DataTypes.INTEGER,
            },
            receiver_mobile_no: {
                type: DataTypes.STRING,
            },
            link: {
                type: DataTypes.TEXT,
                validate: {
                    len: [0, 800],
                },
                allowNull: true
            },

            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            status: {
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE'
            }
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            comment: "푸쉬 개개인 컬럼"

        }
    );

    PersonalPush.associate = (models) => {
        PersonalPush.belongsTo(models.Push, {
            as: 'push',
            foreignKey: 'push_seq',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
        PersonalPush.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
    };

    return PersonalPush;
}
