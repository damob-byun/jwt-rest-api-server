module.exports = (sequelize, DataTypes) => {
    const Push = sequelize.define('Push', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            summary: {
                type: DataTypes.STRING,
                allowNull: false
            },
            comment_count: {
                type: DataTypes.INTEGER,
            },
            link: {
                type: DataTypes.TEXT,
                validate: {
                    len: [0, 800],
                },
                allowNull: true
            }
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            comment: "Push 목록을 저장하는 테이블"

        }
    );
    Push.associate = (models) => {
        Push.hasMany(models.PersonalPush, {
            as: 'personal_push',
            foreignKey: 'push_seq',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
        Push.hasMany(models.AttachFiles, {
            as: 'attach_files',
            foreignKey: 'push_seq',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
    };


    return Push;
}
