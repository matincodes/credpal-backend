import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import argon2 from 'argon2';
import { User } from '../modules/users/users.model.js';
import { env } from './env.config.js';
import { cookieExtractor } from '../utils/cookieExtractor.js';


// Local Strategy for username and password authentication
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false,
        }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email }).select('+password');

                if (!user || !user.password) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                // Verify password
                const isValid = await argon2.verify(user.password, password);

                if (!isValid) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// JWT Strategy for token authentication
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: cookieExtractor,
            secretOrKey: env.ACCESS_TOKEN_SECRET,
        }, async (jwtPayload, done) => {
            try {

                // Find the user specified in token
                const user = await User.findById(jwtPayload.id);

                if (!user) {
                    return done(null, false, { message: 'User not found.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

export default passport;