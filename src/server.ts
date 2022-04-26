import {
  AgendaItemType,
  MeetingSeries,
  TalkingPoint,
  TalkingPointTicket,
} from "./types";
import Chance from "chance";

const chance = new Chance();

const getParticipant = () => ({
  email: chance.email(),
  hasParticipated: chance.bool(),
  isVisible: chance.bool(),
  participantName: chance.name(),
  role: chance.profession(),
});

export const getTicket = () => ({
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

const getAgendaItem = (tickets: TalkingPointTicket[]) => {
  const selectedTickets = chance.pickset(
    tickets,
    chance.integer({ min: 0, max: tickets.length - 1 })
  );
  return {
    id: chance.guid(),
    isDone: chance.bool(),
    linkedTickets: selectedTickets.map((t) => t.id),
    tickets: selectedTickets,
    note: chance.paragraph(),
    text: chance.sentence({ words: 3 }),
    title: chance.sentence({ words: 3 }),
    type: AgendaItemType.TalkingPoint,
  };
};

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
        getAgendaItem(tickets),
        getAgendaItem(tickets),
        getAgendaItem(tickets),
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

export const saveTalkingPoint = (talkingPoint: TalkingPoint) => {
  console.log(`saving talking point ${talkingPoint.text}`);
  return new Promise<TalkingPoint>((resolve, reject) =>
    setTimeout(() => {
      console.log(`talking point saved - ${talkingPoint.text}`);
      resolve(talkingPoint);
    }, 1000)
  );
};
