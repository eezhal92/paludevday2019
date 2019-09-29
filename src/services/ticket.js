import Hashids from 'hashids';

const hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");

export function nextNumber(order) {
  if (!order) return 1;
  if (!order.ticketCode) throw new Error('No ticketCode');

  const numbers = decodeHash(order.ticketCode);
  if (!numbers.length) throw new Error(`${order.ticketCode} is not valid hash`);

  return numbers[0];
}

export function encodeHash(number) {
  if (typeof number !== 'number') throw new Error('Should be number type');
  return hashids.encode(number);
}

export function decodeHash(hash) {
  return hashids.decode(hash);
}
