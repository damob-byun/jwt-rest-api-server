module.exports = (sequelize, DataTypes) => {
    const PushComment = sequelize.define('PushComment', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            content: {
                type: DataTypes.TEXT,
                validate: {
                    len: [0, 500],
                },
                allowNull: false
            },
            push_seq: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            comment: "푸쉬 댓글 스키마"
        }
    );
    PushComment.associate = (models) => {
        PushComment.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'cascade'
        });
        PushComment.belongsTo(models.Push, {
            as: 'push',
            foreignKey: 'push_seq',
            targetKey: 'id',
            onDelete: 'cascade'
        });
    };
    return PushComment;
}
