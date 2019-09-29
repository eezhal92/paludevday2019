import { Router } from 'express';
import backoffice from './backoffice';
import passport from 'passport';
import { ensureLoggedIn } from 'connect-ensure-login';

const router = Router();

router.get('/login', (request, response) => {
  response.render('admin/login');
});

router.post(
  '/login',
  passport.authenticate('local', { failure: '/backoffice/login' }),
  (request, response) => {
    response.redirect('/backoffice/dashboard');
  }
);

router.get(
  '/dashboard',
  ensureLoggedIn({
    redirectTo: '/backoffice/login'
  }),
  (request, response) => {
    response.render('admin/dashboard');
  }
);

export default router;
