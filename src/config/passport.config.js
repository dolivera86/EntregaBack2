import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model.js';
import { comparePassword, hashPassword } from '../utils/password.util.js';
import { JWT_SECRET } from './jwt.config.js';

// Estrategia Local - Signup (Registro)
passport.use('signup', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: 'El email ya está registrado' });
            }

            const hashedPassword = hashPassword(password);
            const user = await User.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword
            });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Estrategia Local - Login
passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            
            if (!comparePassword(password, user.password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Estrategia JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }
            return token;
        }
    ]),
    secretOrKey: JWT_SECRET
};

passport.use('jwt', new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export default passport;