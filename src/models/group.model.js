const {createConnection} = require('../config/db.config');

class GroupModel {
    constructor(id, name, id_teacher) {
        this.id = id;
        this.name = name;
        this.id_teacher = id_teacher;
    }

    async save() {
        const connection = await createConnection();
        const query = 'INSERT INTO classroom.groups (name, id_teacher) VALUES (?, ?)';
        const result = await connection.execute(query, [this.name, this.id_teacher]);
        connection.end();
        return result;
    }

    static async findById(id) {
        const connection = await createConnection();
        const query = 'SELECT * FROM classroom.groups WHERE id = ?';
        const [rows] = await connection.query(query, [id]);
        connection.end();
        return rows[0];
    }

    static async findByUserId(userId) {
        const connection = await createConnection();
        const query = 'SELECT * FROM classroom.groups WHERE id_teacher = ? AND deleted = 0';
        const [rows] = await connection.query(query, [userId]);
        connection.end();
        return rows;
    }

    static async getAll(offset, limit) {
        const connection = await createConnection();
        let query = 'SELECT * FROM classroom.groups WHERE deleted = 0';
        if (offset && limit) {
            query += ' LIMIT ?, ?';
        }
        const [rows] = await connection.query(query, [offset, limit]);
        connection.end();
        return rows;
    }


    static async delete(groupId) {
        const connection = await createConnection();
        try {
            const [result] = await connection.execute(
                'UPDATE classroom.groups SET deleted = 1 WHERE id = ? AND deleted = 0',
                [groupId]
            );
            return result;
        } finally {
            connection.end();
        }
    }
    
    static async count() {
        const connection = await createConnection();
        const query = 'SELECT COUNT(*) AS total FROM classroom.groups WHERE deleted = 0';
        const [rows] = await connection.query(query);
        connection.end();
        return rows;
    }

    static async findUsersByGroupId(groupId) {
        const connection = await createConnection();
        const query = `
            SELECT u.id, u.name, u.email
            FROM users u
            JOIN student_group sg ON u.id = sg.id_student
            WHERE sg.id_group = ? AND sg.deleted = 0
        `;
        const [rows] = await connection.query(query, [groupId]);
        connection.end();
        return rows;
    }
}

module.exports = GroupModel;