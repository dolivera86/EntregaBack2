import User from '../models/user.model.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({
            status: 'success',
            message: 'Usuarios obtenidos exitosamente',
            payload: users,
            total: users.length
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuarios'
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.uid).select('-password');
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            status: 'success',
            message: 'Usuario obtenido exitosamente',
            payload: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener usuario'
        });
    }
};


export const updateUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        // Validar que el rol sea válido
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                status: 'error',
                message: `Rol inválido. Roles permitidos: ${validRoles.join(', ')}`
            });
        }

        if (req.user._id.toString() === uid && role === 'user') {
            return res.status(403).json({
                status: 'error',
                message: 'No puedes cambiar tu propio rol de admin a user'
            });
        }

        const user = await User.findByIdAndUpdate(
            uid,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: `Rol actualizado a '${role}' exitosamente`,
            payload: user,
            updatedBy: { id: req.user._id, email: req.user.email }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al actualizar rol del usuario'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;

        if (req.user._id.toString() === uid) {
            return res.status(403).json({
                status: 'error',
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        const user = await User.findByIdAndDelete(uid);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Usuario eliminado exitosamente',
            payload: { deletedUser: user.email },
            deletedBy: { id: req.user._id, email: req.user.email }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error al eliminar usuario'
        });
    }
};
