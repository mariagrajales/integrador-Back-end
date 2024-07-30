const {createConnection} = require('../config/db.config');
const bcrypt = require('bcrypt');

class UserModel {
    constructor(name, lastname, email, password, type) {
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.type = type
    }

    async save() {
        const connection = await createConnection();
        const query = 'INSERT INTO users (name, lastname, email, password, type) VALUES (?, ?, ?, ?, ?)';
        const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS));
        const result = await connection.execute(query, [this.name, this.lastname, this.email, hashedPassword, this.type]);
        connection.end();
        return result;
    }

    static async findByEmail(email) {
        const connection = await createConnection();
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await connection.query(query, [email]);
        connection.end();
        return rows[0];
    }

    static async findById(id) {
        const connection = await createConnection();
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await connection.query(query, [id]);
        connection.end();
        return rows[0];
    }

    static async getAll(offset, limit) {
        const connection = await createConnection();
        let query = 'SELECT * FROM users WHERE deleted = 0';
        if (offset && limit) {
            query += ' LIMIT ?, ?';
        }
        const [rows] = await connection.query(query, [offset, limit]);
        connection.end();
        return rows;
    }

    async patch(userId, userUpdate) {
        const connection = await createConnection();
        this.name = userUpdate.name || this.name;
        this.lastname = userUpdate.lastname || this.lastname;
        this.email = userUpdate.email || this.email;
        this.password = userUpdate.password || this.password;
        this.type = userUpdate.type || this.type;
        const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS));
        const query = 'UPDATE users SET name = ?, lastname = ?, email = ?, password = ?, type = ? WHERE id = ?';
        const result = await connection.execute(query, [this.name, this.lastname, this.email, hashedPassword, userId, this.type]);
        connection.end();
        return result;
    }

    async put(userId, userUpdate) {
        const connection = await createConnection();
        this.name = userUpdate.name || '';
        this.lastname = userUpdate.lastname || "";
        this.email = userUpdate.email || "";
        this.password = userUpdate.password || "";
        this.type = userUpdate.type || "";
        const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS));
        const query = 'UPDATE users SET name = ?, lastname = ?, email = ?, password = ?, type  = ? WHERE id = ?';
        const result = await connection.execute(query, [this.name, this.lastname, this.email, hashedPassword, userId, this.type]);
        connection.end();
        return result;
    }

    static async deleteById(userId) {
        const connection = await createConnection();
        const query = 'UPDATE users SET deleted = 1 WHERE id = ?';
        const result = await connection.execute(query, [userId]);
        connection.end();
        return result;
    }

    static async count() {
        const connection = await createConnection();
        const query = 'SELECT COUNT(*) as count FROM users WHERE deleted = 0';
        const [rows] = await connection.query(query);
        connection.end();
        return rows;
    }

}

module.exports = UserModel;