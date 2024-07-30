const {createConnection} = require('../config/db.config');

class DeliveryModel {
    constructor(id, id_homework, id_student, file, status = 0, is_submitted = 1) {
        this.id = id;
        this.id_homework = id_homework;
        this.id_student = id_student;
        this.file = file || '';
        this.delivery_date = new Date();
        this.status = status;
        this.is_submitted = is_submitted;
    }

    async save() {
        const connection = await createConnection();
        const query = 'INSERT INTO delivery (id_homework, id_student, file, delivery_date, status, is_submitted) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await connection.execute(query, [this.id_homework, this.id_student, this.file, this.delivery_date, this.status, this.is_submitted]);
        connection.end();
        return result;
    }


    static async findById(id) {
        const connection = await createConnection();
        const query = 'SELECT * FROM delivery WHERE id = ?';
        const [rows] = await connection.query(query, [id]);
        connection.end();
        return rows[0];
    }

    static async findByDate(date) {
        const connection = await createConnection();
        const query = 'SELECT * FROM delivery WHERE delivery_date = ?';
        const [rows] = await connection.query(query, [date]);
        connection.end();
        return rows[0];
    }

    static async getAll(offset, limit) {
        const connection = await createConnection();
        let query = 'SELECT * FROM delivery WHERE deleted = 0';
        if (offset && limit) {
            query += ' LIMIT ?, ?';
        }
        const [rows] = await connection.query(query, [offset, limit]);
        connection.end();
        return rows;
    }

    static async delete(deliveryId) {
        const connection = await createConnection();
        const query = 'UPDATE delivery SET deleted = 1 WHERE id = ?';
        const result = await connection.execute(query, [deliveryId]);
        connection.end();
        return result;
    }

    static async count() {
        const connection = await createConnection();
        const query = 'SELECT COUNT(*) AS total FROM delivery WHERE deleted = 0';
        const [rows] = await connection.query(query);
        connection.end();
        return rows;
    }

   async patch(deliveryId, deliveryUpdate) {
        const connection = await createConnection();
        this.id_homework = deliveryUpdate.id_homework || this.id_homework;
        this.id_student = deliveryUpdate.id_student || this.id_student;
        this.file = deliveryUpdate.file || this.file;
        this.delivery_date = deliveryUpdate.delivery_date || this.delivery_date;
        this.status = deliveryUpdate.status !== undefined ? deliveryUpdate.status : this.status;
        const query = 'UPDATE delivery SET id_homework = ?, id_student = ?, file = ?, delivery_date = ?, status = ? WHERE id = ?';
        const result = await connection.execute(query, [this.id_homework, this.id_student, this.file, this.delivery_date, this.status, deliveryId]);
        connection.end();
        return result;
    }

    static async patch(deliveryId, deliveryUpdate) {
        const connection = await createConnection();
        const query = 'UPDATE delivery SET grade = ?, status = ? WHERE id = ?';
        const result = await connection.execute(query, [deliveryUpdate.grade, deliveryUpdate.status, deliveryId]);
        connection.end();
        return result;
    }

    static async findByUserId(userId) {
        const connection = await createConnection();
        const query = 'SELECT * FROM delivery WHERE id_student = ? AND deleted = 0';
        const [rows] = await connection.query(query, [userId]);
        connection.end();
        return rows;
    }
    
}

module.exports = DeliveryModel;