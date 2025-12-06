import User from '../models/user.model.js';

export class UserRepository {

    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async getUserById(userId) {
        return await User.findById(userId);
    }

    async getAllUsers() {
        return await User.find().select('-password');
    }

    async getUsersByRole(role) {
        return await User.find({ role }).select('-password');
    }
}

export default UserRepository;