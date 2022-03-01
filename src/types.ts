export interface MeetingSeries {
  projectId: string;
  // createdBy: string;
  name: string;
  // frequency: object;
  date: Date;
  meetings: Array<Meeting>;
  // serverCreatedAt: string;
  // serverUpdatedAt: string;
}

export interface Meeting {
  id: string;
  // createdBy: string;
  // updatedBy: string;
  title: string;
  meetingDateTime: Date;
  sentAt: Date | null;
  participants: Array<Participant>;
  // protocolRecipients: Array<string>;
  agendaItems: Array<Section | TalkingPoint>;
}

export interface TalkingPoint {
  id: string;
  // createdBy: string;
  // updatedBy: string;
  text: string;
  note: string;
  // createdAt: string;
  isDone: boolean;
  linkedTickets: Array<string>;
  type: AgendaItemType;
}

export interface TalkingPointTicket {
  id: string;
  ticketKey: string;
  name: string;
  dueDate: string;
  company: string;
  responsible: string;
}

export interface Section {
  id: string;
  title: string;
  // createdBy: string;
  // updatedBy: string;
  type: AgendaItemType;
}

export enum AgendaItemType {
  TalkingPoint = "TalkingPoint",
  Section = "Section",
}

export interface Participant {
  email: string;
  participantName: string;
  role: string | null;
  hasParticipated: boolean;
  isVisible: boolean;
}
