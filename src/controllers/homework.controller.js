const homeworkModel = require('../models/homework.model');

const createHomework = async (req, res) => {
    try {
        const { description, delivery_date, id_group } = req.body;
        const homework = new homeworkModel(null, description, delivery_date, id_group);
        const result = await homework.save();
        return res.status(201).json({ message: 'Tarea creada', data: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const homework = await homeworkModel.findById(id);
        if (!homework) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        return res.status(200).json({ message: 'Tarea encontrada', data: homework });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        let homeworks;
        let response;
        if (!page || !limit) {
            homeworks = await homeworkModel.getAll();
            response = {
                message: "Tareas encontradas",
                data: homeworks
            };
        } else {
            homeworks = await homeworkModel.getAll(offset, limit);
            const totalHomeworks = await homeworkModel.count();
            const totalPages = Math.ceil(totalHomeworks[0].total / limit);
            response = {
                message: "Tareas encontradas",
                data: homeworks,
                meta: {
                    totalHomeworks: totalHomeworks[0].total,
                    pages: totalPages,
                    page: page
                }
            };
        }
        return res.status(200).json({ message: 'Tareas encontradas', data: response });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteHomework = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(`ID recibido para eliminar: ${id}`); 

        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const result = await homeworkModel.delete(id);
        console.log(`Resultado de la eliminación: ${JSON.stringify(result)}`); 

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        return res.status(200).json({ message: 'Tarea eliminada', data: result });
    } catch (error) {
        console.error(`Error al eliminar tarea: ${error.message}`); 
        return res.status(500).json({ message: error.message });
    }
}



const getByDate = async (req, res) => {
    try {
        const date = req.body.date;
        const homework = await homeworkModel.findByDate(date);
        if (!homework) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        return res.status(200).json({ message: 'Tarea encontrada', data: homework });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const patch = async (req, res) => {
    try {
        const id = req.params.id;
        const homeworkUpdate = req.body;
        const homeworkData = await homeworkModel.findById(id);
        if (!homeworkData) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        const homework = new homeworkModel(homeworkData.id, homeworkData.description, homeworkData.delivery_date, homeworkData.id_group);
        const result = await homework.patch(homeworkUpdate);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }
        return res.status(200).json({ message: 'Tarea actualizada', data: { ...homeworkData, ...homeworkUpdate } });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getHomeworksByGroupId = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const homeworks = await homeworkModel.findByGroupId(groupId);
        if (!homeworks.length) {
            return res.status(404).json({ message: 'No se encontraron tareas para este grupo' });
        }
        return res.status(200).json({ message: 'Tareas encontradas', data: homeworks });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createHomework,
    getById,
    getAll,
    deleteHomework,
    getByDate,
    patch,
    getHomeworksByGroupId
};
