import { ticketsDao } from "../dao/index.js";

export class TicketsService {
  //add ticket
  static addTicket = (ticket) => {
    return ticketsDao.addTicket(ticket);
  };

  //get tickets
  static getTickets = () => {
    return ticketsDao.getTickets();
  };

  //get ticket by id
  static getTicketById = (id) => {
    return ticketsDao.getTicketById(id);
  };
}
