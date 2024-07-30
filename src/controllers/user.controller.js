const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {serialize} = require('cookie')

    const register = async (req, res) => {
        try {
            const {name, lastname, email, password, type} = req.body;
            const user = new userModel(name, lastname, email, password, type);
            const result = await user.save();
            return res.status(201).json({
                message: 'Usuario creado',
                user: {
                    id: result.insertId,
                    name,
                    lastname,
                    email
                }
            });
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    const login = async (req, res) => {
        try {
            console.log('Iniciando proceso de login');
            const {email, password} = req.body;
            const user = await userModel.findByEmail(email);
            if (!user) {
                console.log('Usuario no encontrado');
                return res.status(401).json({message: 'Usuario o contraseña incorrectos'});
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                console.log('Contraseña inválida');
                return res.status(401).json({message: 'Usuario o contraseña incorrectos'});
            }
            console.log('Generando token');
            const token = jwt.sign({id: user.id, email: user.email, type: user.type}, process.env.JWT_SECRET, {expiresIn: '1h'});
            
            console.log('Configurando cookie');
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 3600000, // 1 hora en milisegundos
            });
    
            console.log('Enviando respuesta');
            res.status(200).json({status: "success", message: 'Sesión iniciada', userType: user.type});
        } catch (error) {
            console.error('Error en el proceso de login:', error);
            return res.status(500).json({message: error.message});
        }
    }
    

    const logout = async (req, res) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({message: 'No hay sesión iniciada'});
        }
        res.clearCookie('token');
        return res.status(200).json({message: 'Sesión cerrada'});
    }

    const getAll = async (req, res) => {
        try {
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const offset = (page - 1) * limit;
            let users;
            let response;
            if (!page || !limit) {
                users = await userModel.getAll();
                response = {
                    message: "Usuarios encontrados",
                    data: users
                };
            }

            else {
                users = await userModel.getAll(offset, limit);
                const totalUsers = await userModel.count();
                const totalPages = Math.ceil(totalUsers[0].count / limit);
                response = {
                    message: "Usuarios encontrados",
                    data: users,
                    meta: {
                        totalUsers: totalUsers[0].count,
                        pages :totalPages,
                        page: page
                    }
                };

            }
            return  res.status(200).json(response);
        } catch (error) {
            return  res.status(500).json({message: error.message});
        }
    }

    const getById = async (req, res) => {
        try {
            const id = req.params.id;
            console.log(id)
            const user = await userModel.findById(id);
            if (!user) {
                return res.status(404).json({message: 'Usuario no encontrado'});
            }
            return res.status(200).json({message: 'Usuario encontrado', data: user});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    const patch = async (req, res) => {
        try {
            const id = req.params.id;
            const userUpdate = req.body;
            const user = await userModel.findById(id);
            const result = await user.patch(id, userUpdate);
            if (!result.affectedRows) {
                return res.status(404).json({message: 'Usuario no encontrado'});
            }
            return res.status(200).json({message: 'Usuario actualizado'});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    const put = async (req, res) => {
        try {
            const id = req.params.id;
            const userUpdate = req.body;
            const user = await userModel.findById(id);
            const result = await user.put(id, userUpdate);
            if (!result.affectedRows) {
                return res.status(404).json({message: 'Usuario no encontrado'});
            }
            return res.status(200).json({message: 'Usuario actualizado'});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    const deleteById = async (req, res) => {
        try {
            const id = req.params.id;
            const result = await userModel.deleteById(id);
            if (!result.affectedRows) {
                return res.status(404).json({message: 'Usuario no encontrado'});
            }
            return res.status(200).json({message: 'Usuario eliminado'});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }

    const getUserProfile = async (req, res) => {
        try {
            const userId = req.user.id; 
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({message: 'Usuario no encontrado'});
            }
            return res.status(200).json({message: 'Usuario encontrado', data: user});
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    }
    
    module.exports = {register, logout, login, getAll, getById, patch, put, deleteById, getUserProfile};
    

