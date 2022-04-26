import { getTicket } from "../server";
import { TalkingPointTicket } from "../types";

interface TalkingPointTicketsProps {
  tickets: TalkingPointTicket[];
  onLinkTicket(ticket: TalkingPointTicket): void;
  onUnlinkTicket(ticket: TalkingPointTicket): void;
}

export const TalkingPointTickets = ({
  tickets,
  onLinkTicket,
  onUnlinkTicket,
}: TalkingPointTicketsProps) => (
  <div>
    <strong>Tickets</strong>
    <ul>
      {tickets.map((ticket) => (
        <li key={ticket.id} onClick={() => onUnlinkTicket(ticket)}>
          {ticket.name}
        </li>
      ))}
    </ul>
    <button type="button" onClick={() => onLinkTicket(getTicket())}>
      Link ticket
    </button>
  </div>
);
