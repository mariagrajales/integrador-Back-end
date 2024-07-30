const deliveryModel = require('../models/delivery.model');

const createDelivery = async (req, res) => {
    try {
        const { id_homework, id_student, file } = req.body;
        const delivery = new deliveryModel(null, id_homework, id_student, file, 0, 1); // is_submitted por defecto 1
        const result = await delivery.save();
        return res.status(201).json({ message: 'Entrega creada', data: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const delivery = await deliveryModel.findById(id);
        if (!delivery.length) {
            return res.status(404).json({message: 'Entrega no encontrada'});
        }
        return res.status(200).json({message: 'Entrega encontrada', data: delivery});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const getByDate = async (req, res) => {
    try {
        const date = req.params.date;
        const delivery = await deliveryModel.findByDate(date);
        if (!delivery.length) {
            return res.status(404).json({message: 'Entrega no encontrada'});
        }
        return res.status(200).json({message: 'Entrega encontrada', data: delivery});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }

}

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;
        let deliveries;
        let response;
        if (!page || !limit) {
            deliveries = await deliveryModel.getAll();
            response = {
                message: "Entregas encontradas",
                data: deliveries 
            };
        } else {
            deliveries = await deliveryModel.getAll(offset, limit);
            const totalDeliveries = await deliveryModel.count();
            const totalPages = Math.ceil(totalDeliveries[0].total / limit);
            response = {
                message: "Entregas encontradas",
                data: deliveries,
                meta: {
                    totalDeliveries: totalDeliveries[0].total,
                    pages: totalPages,
                    page: page
                }
            };
        }
        return res.status(200).json({message: 'Entregas encontradas', data: response});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const deleteDelivery = async (req, res) => {
    try {
        const id = req.params.id;
        const delivery = await deliveryModel.delete(id);
        if (!delivery.affectedRows) {
            return res.status(404).json({message: 'Entrega no encontrada'});
        }
        return res.status(200).json({message: 'Entrega eliminada', data: delivery});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const patch = async (req, res) => {
    try {
        const id = req.params.id;
        const deliveryUpdate = req.body;
        const delivery = await deliveryModel.findById(id);
        const result = await delivery.patch(id, deliveryUpdate);
        if (!result.affectedRows) {
            return res.status(404).json({message: 'Entrega no encontrada'});
        }
        return res.status(200).json({message: 'Entrega actualizada', data: result});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const patchGrade = async (req, res) => {
    try {
        const id = req.params.id;
        const { grade } = req.body;
        const result = await deliveryModel.patch(id, { grade, status: 1 }); // Asume que el status 1 indica calificado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Entrega no encontrada' });
        }
        return res.status(200).json({ message: 'Entrega calificada', data: result });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



const getByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const deliveries = await deliveryModel.findByUserId(userId);
        if (!deliveries.length) {
            return res.status(404).json({ message: 'Entregas no encontradas' });
        }
        return res.status(200).json({ message: 'Entregas encontradas', data: deliveries });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createDelivery,
    getById,
    getByDate,
    getAll,
    deleteDelivery,
    patch,
    patchGrade,
    getByUserId // Agrega esta línea
}