import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userService from '../dao/models/usersModel.js';
import cartsModel from '../dao/models/cartsModel.js';
import { createHash, isValidPassword } from './../utils/utils.js';

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                let user = await userService.findOne({ email: email });
                if (user) {
                    return done(null, false, { message: 'El usuario ya existe' });
                }

                const role = email === 'adminCoder@coder.com' ? 'admin' : 'user';

                let newUser;
                if (role === 'admin') {
                    newUser = {
                        first_name,
                        last_name,
                        age,
                        email,
                        password: createHash(password),
                        role
                    };
                } else {
                    const newCart = await cartsModel.create({});
                    newUser = {
                        first_name,
                        last_name,
                        age,
                        email,
                        password: createHash(password),
                        cart: newCart._id,
                        role
                    };
                }

                let result = await userService.create(newUser);
                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                let user = await userService.findOne({ email }).populate('cart');
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: 'Usuario y/o Contraseña incorrecta' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23liZm6FgtJrYwhpPf",
        clientSecret: "b570fbbf4100213102c124127ac1fc0cec096fad",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userService.findOne({ email: profile._json.email }).populate('cart');
            if (!user) {
                const newCart = await cartsModel.create({});
                let newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: "",
                    age: 27,
                    email: profile._json.email || `${profile.username}@github.com`,
                    password: "",
                    cart: newCart._id
                };
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id).populate('cart');
        done(null, user);
    });
};

export default initializePassport;
