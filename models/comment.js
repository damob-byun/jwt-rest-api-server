module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
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
            post_id: {
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
            comment: "댓글 스키마"
        }
    );
    Comment.associate = (models) => {
        Comment.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'cascade'
        });
        Comment.belongsTo(models.Post, {
            as: 'post',
            foreignKey: 'post_id',
            targetKey: 'id',
            onDelete: 'cascade'
        });
    };
    return Comment;
}
