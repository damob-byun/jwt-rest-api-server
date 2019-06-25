class Dao {}

// PUT, UPDATE, DELETE
Dao.prototype.create = async (model, body) => {
    return await model.create(body);
};
Dao.prototype.updateById = async (model, body, id) => {
    try {
        return await model.update(body, { where: { id } });
    } catch(err) {
        return err;
    }
};
Dao.prototype.destroyById = async (model, id) => {
    try {
        return await model.destroy({ where: { id } });
    } catch (err) {
        return err;
    }
};
// GET
Dao.prototype.findByEmail = async (model, email) => {
    try {
        return await model.findOne({
            where: {email : email}
        });
    } catch (err) {
        return err;
    }
};
// GET
Dao.prototype.findByPk = async (model, pk) => {
    try {
        return await model.findByPk(pk);
    } catch (err) {
        return err;
    }
};
Dao.prototype.findAll = async (model, limit, offset, order = [ ['createdAt', 'DESC'] ], where = {}) => {
    try {
        return await model.findAll({
            ...where,
            order,
            limit,
            offset
        });
    } catch (err) {
        return err;
    }
};

Dao.prototype.findAndCountAll = async (model, limit, offset, order = [ ['createdAt', 'DESC'] ], where = {}) => {
    return await model.findAndCountAll({
        ...where,
        limit,
        offset,
        order
    })
};

// Dao.prototype.findOne = async (model, where = {}) => {
//     return await model.findOne({ where });
// }

module.exports = Dao;
