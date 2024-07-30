const groupModel = require('../models/group.model');

const createGroup = async (req, res) => {
    try {
        const {name, id_teacher} = req.body;
        const group = new groupModel(null, name, id_teacher);
        const result = await group.save();
        return res.status(201).json({message: 'Grupo creado', data: result});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const group = await groupModel.findById(id);
        if (!group.length) {
            return res.status(404).json({message: 'Grupo no encontrado'});
        }
        return res.status(200).json({message: 'Grupo encontrado', data: group});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        let groups;
        let response;
        if (!page || !limit) {
            groups = await groupModel.getAll();
            response = {
                message: "Grupos encontrados",
                data: groups
            };
        } else {
            groups = await groupModel.getAll(offset, limit);
            const totalGroups = await groupModel.count();
            const totalPages = Math.ceil(totalGroups[0].total / limit);
            response = {
                message: "Grupos encontrados",
                data: groups,
                meta: {
                    totalGroups: totalGroups[0].total,
                    pages: totalPages,
                    page: page
                }
            };
        }
        return res.status(200).json({message: 'Grupos encontrados', data: response});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteGroup = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`Intentando eliminar grupo con ID: ${id}`);
        
        const result = await groupModel.delete(id);
        
        if (result.affectedRows === 0) {
            console.log(`No se encontró el grupo activo con ID: ${id}`);
            return res.status(404).json({message: 'Grupo no encontrado o ya eliminado'});
        }
        
        console.log(`Grupo marcado como eliminado exitosamente`);
        return res.status(200).json({message: 'Grupo eliminado'});
    } catch (error) {
        console.error(`Error al eliminar grupo:`, error);
        return res.status(500).json({message: 'Error al eliminar el grupo', error: error.message});
    }
}




const getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const groups = await groupModel.findByUserId(userId);
        if (!groups.length) {
            return res.status(404).json({message: 'No se encontraron grupos para este usuario'});
        }
        return res.status(200).json({message: 'Grupos encontrados', data: groups});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


const getUsersByGroupId = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const users = await groupModel.findUsersByGroupId(groupId);
        if (!users.length) {
            return res.status(404).json({message: 'No se encontraron usuarios para este grupo'});
        }
        return res.status(200).json({message: 'Usuarios encontrados', data: users});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}




module.exports = {
    createGroup,
    getById,
    getAll,
    deleteGroup,
    getByUserId,
    getUsersByGroupId
}