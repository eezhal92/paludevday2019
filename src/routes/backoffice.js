import { Router } from 'express';
import passport from 'passport';
import qs from 'querystring';
import { ensureLoggedIn } from 'connect-ensure-login';
import Validator from 'validatorjs';

import * as orderService from '../services/order';

/**
 * @param  {Array} errors
 * @return {object}
 */
function createFormErrors(errors) {
  if (!errors.length) return {};
  const err = errors[0].errors;
  return Object.keys(err)
    .reduce((acc, key) => Object.assign(acc, { [key]: err[key][0] }), {})
}

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
    const { totalCount, orders } = await orderService.getList(query);

    const nextPage = currentPage + 1;
    const prevPage = currentPage - 1;
    const viewPayload = {
      orders,
      nextPage,
      prevPage,
      query,
      totalCount,
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
    const errors = createFormErrors(request.flash('errors'));
    const inputs = request.flash('inputs')[0] || {};

    response.render('admin/order/create', { inputs, errors });
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

router.patch('/order/:code', (request, response) => {
  const { code } = request.params;

  const payload = {
    ticketCode: code,
    paymentStatus: request.body.paymentStatus,
  };

  orderService.updateOrder(payload)
    .then((order) => {
      response.json({
        paymentStatus: request.body.paymentStatus,
        price: order.paymentAmount
      });
    });
});

router.post(
  '/order',
  ensureLoggedIn({
    redirectTo: '/backoffice/login'
  }),
  (request, response, next) => {
    const validation = new Validator(request.body, {
      ticketCode: 'required',
      name: 'required|min:3',
      phone: 'required'
    });

    if (validation.fails()) {
      request.flash('errors', validation.errors);
      request.flash('inputs', request.body);
      return response.redirect('/backoffice/order/create');
    }

    next();
  },
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
