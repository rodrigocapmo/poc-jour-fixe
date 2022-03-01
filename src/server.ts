import { AgendaItemType, MeetingSeries } from "./types";
import Chance from "chance";

const chance = new Chance();

const getParticipant = () => ({
  email: chance.email(),
  hasParticipated: chance.bool(),
  isVisible: chance.bool(),
  participantName: chance.name(),
  role: chance.profession(),
});

const getTicket = () => ({
  id: chance.guid(),
  ticketKey: `PD-${chance.integer()}`,
  name: chance.sentence(),
  dueDate: chance.date(),
  company: chance.company(),
  responsible: chance.name(),
});

const tickets = [
  getTicket(),
  getTicket(),
  getTicket(),
  getTicket(),
  getTicket(),
  getTicket(),
  getTicket(),
  getTicket(),
  getTicket(),
];

const ticketsId = tickets.map((ticket) => ticket.id);

const getAgendaItem = (ticketsId: string[]) => ({
  id: chance.guid(),
  isDone: chance.bool(),
  linkedTickets: chance.pickset(ticketsId),
  note: chance.paragraph(),
  text: chance.sentence(),
  title: chance.sentence(),
  type: AgendaItemType.TalkingPoint,
});

const series: MeetingSeries = {
  name: chance.sentence(),
  date: chance.date({ min: new Date() }) as Date,
  projectId: chance.guid(),
  meetings: [
    {
      id: chance.guid(),
      title: chance.sentence(),
      sentAt: null,
      meetingDateTime: chance.date(),
      agendaItems: [
        getAgendaItem(ticketsId),
        getAgendaItem(ticketsId),
        getAgendaItem(ticketsId),
      ],
      participants: [
        getParticipant(),
        getParticipant(),
        getParticipant(),
        getParticipant(),
        getParticipant(),
      ],
    },
  ],
};

export const getSeries = () => {
  return new Promise<MeetingSeries>((resolve) =>
    setTimeout(() => resolve(series), 3000)
  );
};
