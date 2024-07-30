const student_groupModel = require('../models/student_group.model');

const createStudent_group = async (req, res) => {
    try {
        const {id_student, id_group} = req.body;

        // Verificar si el usuario ya pertenece al grupo
        const existingStudentGroup = await student_groupModel.findByUserIdAndGroupId(id_student, id_group);
        if (existingStudentGroup.length > 0) {
            return res.status(400).json({message: 'El usuario ya pertenece a este grupo'});
        }

        const student_group = new student_groupModel(null, id_student, id_group);
        const result = await student_group.save();
        return res.status(201).json({message: 'Alumno asignado al grupo', data: result});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const student_group = await student_groupModel.findById(id);
        if (!student_group) {
            return res.status(404).json({message: 'Alumno no encontrado'});
        }
        return res.status(200).json({message: 'Alumno encontrado', data: student_group});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        let student_groups;
        let response;
        if (!page || !limit) {
            student_groups = await student_groupModel.getAll();
            response = {
                message: "Alumnos encontrados",
                data: student_groups
            };
        } else {
            student_groups = await student_groupModel.getAll(offset, limit);
            const totalStudent_groups = await student_groupModel.count();
            const totalPages = Math.ceil(totalStudent_groups[0].total / limit);
            response = {
                message: "Alumnos encontrados",
                data: student_groups,
                meta: {
                    totalStudent_groups: totalStudent_groups[0].total,
                    pages: totalPages,
                    page: page
                }
            };
        }
        return res.status(200).json({message: 'Alumnos encontrados', data: response});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteStudent_group = async (req, res) => {
    try {
        const id = req.params.id;
        const student_group = await student_groupModel.findById(id);
        if (!student_group) {
            return res.status(404).json({message: 'Alumno no encontrado'});
        }
        const result = await student_groupModel.delete(id);
        return res.status(200).json({message: 'Alumno eliminado', data: result});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const groups = await student_groupModel.findByUserId(userId);
        if (!groups.length) {
            return res.status(404).json({message: 'No se encontraron grupos para este usuario'});
        }
        return res.status(200).json({message: 'Grupos encontrados', data: groups});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


module.exports = {createStudent_group, getById, getAll, deleteStudent_group, getByUserId};
