import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import flash from 'connect-flash';

import routes from './routes';
import { localStrategyHandler, serializeUser, deserializeUser } from './auth-strategy';

const app = express();

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static(path.resolve(__dirname, '../static')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy({
  usernameField: 'email',
}, localStrategyHandler));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.get('/', (request, response) => {
  response.render('index');
});

app.use(routes);

export default app;
