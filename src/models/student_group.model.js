const {createConnection} = require('../config/db.config');

class Student_groupModel {
    constructor(id, id_student, id_group) {
        this.id = id;
        this.id_student = id_student;
        this.id_group = id_group;
    }

    async save() {
        const connection = await createConnection();
        const query = 'INSERT INTO student_group (id_student, id_group) VALUES (?, ?)';
        const result = await connection.execute(query, [this.id_student, this.id_group]);
        connection.end();
        return result;
    }

    static async findById(id) {
        const connection = await createConnection();
        const query = 'SELECT * FROM student_group WHERE id = ?';
        const [rows] = await connection.query(query, [id]);
        connection.end();
        return rows[0];
    }

    
    static async findByUserId(userId) {
        const connection = await createConnection();
        const query = `
            SELECT sg.id, sg.id_student, sg.id_group, g.name AS group_name, sg.deleted
            FROM student_group sg
            JOIN \`groups\` g ON sg.id_group = g.id
            WHERE sg.id_student = ? AND sg.deleted = 0 AND g.deleted = 0
        `;
        const [rows] = await connection.query(query, [userId]);
        connection.end();
        return rows;
    }

    static async getAll(offset, limit) {
        const connection = await createConnection();
        let query = 'SELECT * FROM student_group WHERE deleted = 0';
        if (offset && limit) {
            query += ' LIMIT ?, ?';
        }
        const [rows] = await connection.query(query, [offset, limit]);
        connection.end();
        return rows;
    }

    static async delete(student_groupId) {
        const connection = await createConnection();
        const query = 'UPDATE student_group SET deleted = 1 WHERE id = ?';
        const result = await connection.execute(query, [student_groupId]);
        connection.end();
        return result;
    }

    static async count() {
        const connection = await createConnection();
        const query = 'SELECT COUNT(*) AS total FROM student_group WHERE deleted = 0';
        const [rows] = await connection.query(query);
        connection.end();
        return rows;
    }

    static async findByUserIdAndGroupId(userId, groupId) {
        const connection = await createConnection();
        const query = `
            SELECT * FROM student_group
            WHERE id_student = ? AND id_group = ? AND deleted = 0
        `;
        const [rows] = await connection.query(query, [userId, groupId]);
        connection.end();
        return rows;
    }
}

module.exports = Student_groupModel;
