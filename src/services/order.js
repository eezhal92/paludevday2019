import Order from '../models/Order';

export function stats() {
  const paidCount = Order
    .where({ paymentStatus: 'paid' })
    .countDocuments();

  const discountedCount = Order
    .where({ paymentStatus: 'paid', paymentAmount: 40000 })
    .countDocuments();

  const pendingCount = Order
    .where({ paymentStatus: 'pending' })
    .countDocuments();

  const refundCount = Order
    .where({ paymentStatus: 'refund' })
    .countDocuments();

  const totalAmount = Order
    .aggregate([{
      $match: {
        paymentStatus: 'paid'
      },
      $group: {
        _id: null,
        amount: {
          $sum: '$paymentAmount'
        }
      }
    }])
    .then((result) => {
      if (Array.isArray(result) && result.length) {
        return result[0].amount;
      }

      return 0;
    });

  return Promise.all([
    paidCount.exec(),
    discountedCount.exec(),
    pendingCount.exec(),
    refundCount.exec(),
    totalAmount
  ])
    .then(([
      paid,
      discounted,
      pending,
      refund,
      totalAmount
    ]) => ({
      paid,
      discounted,
      pending,
      refund,
      totalAmount
    }));
}

/**
 * @param  {Object} payload
 * @param  {number?} payload.name
 * @param  {number} payload.page
 * @param  {number} payload.limit
 */
export async function getList(payload = {}) {
  const {
    limit = 10,
    page = 1,
    ticketCode,
    name,
    phone,
    email,
    paymentStatus,
  } = payload;

  const q = {};

  if (name) q.name = new RegExp(`${name}`, 'gi');
  if (phone) q.phone = new RegExp(`${phone}`, 'g');
  if (email) q.email = new RegExp(`${email}`, 'gi');
  if (payload.ticketCode) q.ticketCode = new RegExp(`${ticketCode}`, 'gi');
  if (payload.paymentStatus) q.paymentStatus = paymentStatus;

  const totalCount = await Order.find(q).countDocuments();

  return Order.find(q)
    .sort({ createdAt: '-1' })
    .populate([
      { path: 'entryBy' }
    ])
    .skip((limit * page) - limit)
    .limit(limit)
    .exec()
    .then((orders) => ({
      orders,
      totalCount,
    }));
}

/**
 * @param  {object} payload
 * @return {string} payload.name
 * @return {string} payload.phone
 * @return {string} payload.email
 * @return {string} payload.institution
 * @return {ObjectId} payload.entryBy
 * @return {string} payload.paymentStatus
 */
export function createOrder(payload) {
  return Order.create(payload);
}

export function findByCode(ticketCode) {
  return Order.findOne({ ticketCode });
}

async function isDiscounted() {
  const discountedOrder = await Order.find({
    paymentNominal: 40000,
  }).countDocuments();

  return discountedOrder < 100;
}

/**
 * @param  {object} payload
 * @param  {string} payload.ticketCode
 * @param  {string} payload.paymentStatus
 */
export async function updateOrder(payload = {}) {
  const { ticketCode, paymentStatus } = payload;
  const applyDiscount = await isDiscounted();

  let price = 50000;
  if (applyDiscount) price = price - 10000;
  const order = await Order.findOne({ ticketCode });
  if (!order) throw new Error('Order not found');

  order.paymentStatus = payload.paymentStatus;
  order.paidAt = new Date().toISOString();
  order.paymentAmount = price;

  return order.save();
}
