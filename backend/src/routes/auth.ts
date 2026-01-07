import { Router } from 'express';
import passport from 'passport';
import { signIn, signUpOrg, signUpUser } from '../controllers/auth';
import { jwtStrategy } from '../services/jwt-auth';

// passport.use(jwtStrategy);

export const authRouter = Router();

// passport.use(new LocalStrategy({ usernameField: 'email' }, async function verify(email, password, cb) {
//   try {
//     const accounts = await AccountModel.getAccount(email);

//     if (accounts.length === 0) {
//       return cb(null, false, { message: 'Incorrect email or password.' });
//     }

//     const account = accounts[0];

//     crypto.pbkdf2(password, Buffer.from(account.salt, 'base64'), 310000, 32, 'sha256', (err, hashedPassword) => {
//       if (err) {
//         return cb(err);
//       }

//       if (!crypto.timingSafeEqual(Buffer.from(account.passwordHash, 'base64'), hashedPassword)) {
//         return cb(null, false, { message: 'Incorrect email or password.' });
//       }

//       return cb(null, { id: account.id, email: account.email });
//     });
//   }
//   catch (err) {
//     return cb(err);
//   }
// }));

// passport.serializeUser(function(user: any, cb) {
//   process.nextTick(function() {
//     cb(null, { id: user.id, email: user.email });
//   });
// });

// passport.deserializeUser(function(user: Express.User, cb) {
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });

authRouter.post('/signin', signIn);

// authRouter.post('/signout', signOutLocal);
  
authRouter.post('/user/signup', signUpUser);
authRouter.post('/org/signup', signUpOrg);
