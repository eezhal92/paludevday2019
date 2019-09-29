import axios from 'axios';

/**
 * Fulfill empty ticket with buyer details
 * @params {object} payload
 * @params {string} payload.name
 * @params {string} payload.ticketNumber
 * @params {string?} payload.phone
 * @params {string?} payload.address
 * @params {string?} payload.notes
 */
export function fulfillTicket(payload) {
  return axios.post('https://baregis.com/api/tickets/fulfill', payload)
    .then(res => res.data);
}
