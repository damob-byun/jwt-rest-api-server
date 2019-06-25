module.exports = (sequelize, DataTypes) => {
    const AttachFiles = sequelize.define('AttachFiles', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            file_name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            file_path: {
                type: DataTypes.STRING,
                allowNull: false
            },
            push_seq: {
                type: DataTypes.INTEGER,
            },
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            comment: "attach_file을 저장하는 테이블"
        }
    );

    AttachFiles.associate = (models) => {
        AttachFiles.belongsTo(models.Push, {
            as: 'push',
            foreignKey: 'push_seq',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
    };

    return AttachFiles;
}
