module.exports = (sequelize, DataTypes) => {


    const PersonalSetting = sequelize.define('PersonalSetting', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            setting_json: {
                type: DataTypes.STRING,
                allowNull: false
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
            comment: "셋팅 관련 값 정의"

        }
    );

    PersonalSetting.associate = (models) => {
        PersonalSetting.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'cascade'
        });
    };

    return PersonalSetting;
}
