module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
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
        user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                onDelete: 'CASCADE'
            }
        }, {
            freezeTableName: true,
            timestamps: true,
            paranoid: true,
            comment: "post 게시글 스키마"

        }
    );

    Post.associate = (models) => {
        Post.hasMany(models.Comment, {
            as: 'comments',
            foreignKey: 'post_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });
        Post.belongsTo(models.User, {
            as: 'users',
            foreignKey: 'user_id',
            targetKey: 'id',
            onDelete: 'CASCADE'
        });
    };

    return Post;
}
