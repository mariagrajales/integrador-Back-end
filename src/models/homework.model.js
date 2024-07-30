const { createConnection } = require('../config/db.config');

class HomeworkModel {
    constructor(id, description, delivery_date, id_group) {
        this.id = id;
        this.description = description;
        this.delivery_date = delivery_date;
        this.id_group = id_group;
    }

    async save() {
        const connection = await createConnection();
        const query = 'INSERT INTO homework (description, delivery_date, id_group) VALUES (?, ?, ?)';
        const result = await connection.execute(query, [this.description, this.delivery_date, this.id_group]);
        connection.end();
        return result;
    }

    static async findById(id) {
        const connection = await createConnection();
        const query = 'SELECT * FROM homework WHERE id = ?';
        const [rows] = await connection.query(query, [id]);
        connection.end();
        return rows[0];
    }

    static async findByDate(date) {
        const connection = await createConnection();
        const query = 'SELECT * FROM homework WHERE delivery_date = ?';
        const [rows] = await connection.query(query, [date]);
        connection.end();
        return rows[0];
    }

    static async getAll(offset, limit) {
        const connection = await createConnection();
        let query = 'SELECT * FROM homework WHERE deleted = 0';
        if (offset && limit) {
            query += ' LIMIT ?, ?';
        }
        const [rows] = await connection.query(query, [offset, limit]);
        connection.end();
        return rows;
    }

    static async delete(homeworkId) {
        const connection = await createConnection();
        console.log(`ID recibido para eliminar en el modelo: ${homeworkId}`); 
    
        const query = 'UPDATE homework SET deleted = 1 WHERE id = ?';
        const [result] = await connection.execute(query, [homeworkId]);
        console.log(`Resultado de la eliminación en el modelo: ${JSON.stringify(result)}`); 
    
        connection.end();
        return result;
    }
    
    

    static async count() {
        const connection = await createConnection();
        const query = 'SELECT COUNT(*) AS total FROM homework WHERE deleted = 0';
        const [rows] = await connection.query(query);
        connection.end();
        return rows;
    }

    async patch(homeworkUpdate) {
        const connection = await createConnection();
        this.description = homeworkUpdate.description || this.description;
        this.delivery_date = homeworkUpdate.delivery_date || this.delivery_date;
        const query = 'UPDATE homework SET description = ?, delivery_date = ? WHERE id = ?';
        const result = await connection.execute(query, [this.description, this.delivery_date, this.id]);
        connection.end();
        return result;
    }

    static async findByGroupId(groupId) {
        const connection = await createConnection();
        const query = 'SELECT * FROM homework WHERE id_group = ? AND deleted = 0';
        const [rows] = await connection.query(query, [groupId]);
        connection.end();
        return rows;
    }
}

module.exports = HomeworkModel;
