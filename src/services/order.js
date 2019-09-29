import Order from '../models/Order';

export function stats() {
  const orderedCount = Order
    .where({ paidAt: { $exists: true } })
    .countDocuments();

  const totalAmount = Order
    .aggregate([{
      $group: {
        _id: null,
        amount: {
          $sum: '$paymentAmount'
        }
      }
    }])
    .then((result) => {
      if (Array.isArray(result)) {
        return result[0].amount;
      }

      return 0;
    });

  return Promise.all([
    orderedCount.exec(),
    totalAmount
  ])
    .then(([
      count,
      totalAmount
    ]) => ({
      count,
      totalAmount
    }));
}

/**
 * @param  {Object} payload
 * @param  {number?} payload.name
 * @param  {number} payload.page
 * @param  {number} payload.limit
 */
export function getList(payload = {}) {
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

  return Order.find(q)
    .sort({ createdAt: '-1' })
    .populate([
      { path: 'entryBy' }
    ])
    .skip((limit * page) - limit)
    .limit(limit)
    .exec();
}

/**
 * @param  {object} payload
 * @return {string} payload.name
 * @return {string} payload.phone
 * @return {string} payload.email
 * @return {string} payload.institution
 * @return {ObjectId} payload.entryBy
 * @return {string} payload.paymentStatus
 * @return {boolean} payload.isDiscounted
 */
export function createOrder(payload) {

}
