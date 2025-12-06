import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './src/models/user.model.js';
import { hashPassword } from './src/utils/password.util.js';

async function setupAdminUser() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Verificar si el admin ya existe
        const adminExists = await User.findOne({ email: 'admin@test.com' });
        
        if (adminExists) {
            console.log('Usuario admin ya existe:', adminExists.email);
            
            // Actualizar a role admin si no lo es
            if (adminExists.role !== 'admin') {
                await User.updateOne(
                    { email: 'admin@test.com' },
                    { $set: { role: 'admin' } }
                );
                console.log('Usuario promovido a admin');
            }
        } else {
            // Crear usuario admin
            const adminUser = await User.create({
                first_name: 'Admin',
                last_name: 'Sistema',
                email: 'admin@test.com',
                age: 30,
                password: hashPassword('Admin123!'),
                role: 'admin'
            });
            console.log('Usuario admin creado exitosamente');
            console.log('Email:', adminUser.email);
            console.log('Rol:', adminUser.role);
        }

        // Crear usuario de prueba normal
        const userExists = await User.findOne({ email: 'user@test.com' });
        
        if (userExists) {
            console.log('Usuario de prueba ya existe:', userExists.email);
        } else {
            const testUser = await User.create({
                first_name: 'Usuario',
                last_name: 'Prueba',
                email: 'user@test.com',
                age: 25,
                password: hashPassword('User123!'),
                role: 'user'
            });
            console.log('Usuario de prueba creado exitosamente');
            console.log('Email:', testUser.email);
            console.log('Rol:', testUser.role);
        }

        console.log('Usuarios disponibles para testing:');
        console.log('Admin:');
        console.log('Email: admin@test.com');
        console.log('Password: Admin123!');
        console.log('Role: admin');
        console.log('Usuario Regular:');
        console.log('Email: user@test.com');
        console.log('Password: User123!');
        console.log('Role: user');

        // Mostrar todos los usuarios
        const allUsers = await User.find().select('-password');
        console.log('Total de usuarios en la base de datos:', allUsers.length);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    setupAdminUser();
}

export default setupAdminUser;
