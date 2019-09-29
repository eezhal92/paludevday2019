import { Router } from 'express';
import passport from 'passport';
import qs from 'querystring';
import { ensureLoggedIn } from 'connect-ensure-login';

import * as orderService from '../services/order';

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
  async (request, response) => {
    const summary = await orderService.stats();

    response.render('admin/dashboard', { stats: summary });
  }
);

router.get(
  '/order',
  ensureLoggedIn({
    redirectTo: '/backoffice/login'
  }),
  async (request, response) => {
    const {
      page,
      limit,
      ticketCode,
      name,
      phone,
      email,
      paymentStatus,
    } = request.query;

    const currentPage = (request.query.page && parseInt(page, 10)) || 1;
    const query = {
      page: currentPage,
      limit: (request.query.limit && parseInt(limit, 10)) || 10,
      ticketCode,
      name,
      phone,
      email,
      paymentStatus,
    };
    const orders = await orderService.getList(query);

    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;
    const viewPayload = {
      orders,
      nextPage,
      prevPage,
      query,
      nextQuery: qs.stringify({ ...query, page: nextPage }),
      prevQuery: qs.stringify({ ...query, page: prevPage }),
    };

    response.render('admin/order/list', viewPayload);
  }
);

router.get(
  '/order/create',
  ensureLoggedIn({
    redirectTo: '/backoffice/login'
  }),
  (request, response) => {
    response.render('admin/order/create');
  }
);

router.get(
  '/order/:code',
  ensureLoggedIn({
    redirectTo: '/backoffice/login'
  }),
  async (request, response) => {
    const order = await orderService.findByCode(request.params.code);

    if (!order) return response.redirect('/backoffice/order');

    response.render('admin/order/detail', { order });
  }
);

router.post(
  '/order',
  ensureLoggedIn({
    redirectTo: '/backoffice/login'
  }),
  (request, response, next) => {
    const payload = {
      ticketCode: request.body.ticketCode,
      name: request.body.name,
      phone: request.body.phone,
      email: request.body.email,
      institution: request.body.institution,
      entryBy: request.user._id.toString(),
      paymentStatus: 'pending',
    };

    orderService.createOrder(payload)
      .then((order) => {
        response.redirect('/backoffice/order/' + order.ticketCode);
      })
      .catch((err) => next(err));
  }
);

export default router;
