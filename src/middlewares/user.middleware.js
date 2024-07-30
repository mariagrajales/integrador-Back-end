const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'] || req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'No hay sesión iniciada'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error('Error al verificar el token:', error);
            return res.status(401).json({message: 'No autorizado'});
        }
        req.user = user;
        next();
    });
}

const verifyTeacher = (req, res, next) => {
    const token = req.headers['authorization'] || req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'No hay sesión iniciada'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error('Error al verificar el token:', error);
            return res.status(401).json({message: 'No autorizado'});
        }
        if (user.type !== 'teacher') {
            return res.status(403).json({message: 'No estás autorizado para realizar esta acción'});
        }
        req.user = user;
        next();
    });
}

const verifyTeacherOrStudent = (req, res, next) => {
    const token = req.headers['authorization'] || req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'No hay sesión iniciada'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.error('Error al verificar el token:', error);
            return res.status(401).json({message: 'No autorizado'});
        }
        if (user.type !== 'teacher' && user.type !== 'student') {
            return res.status(403).json({message: 'No estás autorizado para realizar esta acción'});
        }
        req.user = user;
        next();
    });
}

module.exports = {verifyToken, verifyTeacher, verifyTeacherOrStudent};