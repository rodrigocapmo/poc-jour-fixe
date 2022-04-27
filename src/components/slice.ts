import {
  Meeting,
  MeetingSeries,
  TalkingPoint,
  TalkingPointTicket,
} from "../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { series } from "../server";

interface State {
  series: MeetingSeries | null;
  currentMeeting: string | null;
}

const initialState: State = {
  series,
  currentMeeting: null,
};

export const selectSeries = (state: State) => state.series;

export const selectCurrentMeeting = ({ series, currentMeeting }: State) => {
  if (!series) return null;
  if (!currentMeeting) return series.meetings[0];
  return series.meetings.find(({ id }) => id === currentMeeting)!;
};

export const selectAgendaItem = (state: State, id: string) => {
  const currentMeeting = selectCurrentMeeting(state);
  return currentMeeting?.agendaItems.find((item) => item.id === id);
};

// New way to deal with slices. Way less code and more simple to understand
// the state injected can be mutated as you want and it will work like magic
const meetingSeriesSlice = createSlice({
  // prefix for our actions
  name: "meetingSeries",
  initialState,
  reducers: {
    setSeries(state, { payload: series }: PayloadAction<MeetingSeries>) {
      state.series = series;
    },
    updateMeeting(state, action: PayloadAction<Meeting>) {
      const meetings = state.series!.meetings!.map((meeting) =>
        meeting.id === meeting.id ? action.payload : meeting
      );

      state.series!.meetings = meetings;
    },
    updateTalkingPointGeneralData(
      state,
      { payload }: PayloadAction<TalkingPoint>
    ) {
      const { id, linkedTickets, tickets, ...update } = payload;
      const talkingPoint = selectAgendaItem(state, id);
      Object.assign(talkingPoint, update);
    },
    linkTicket(
      state,
      action: PayloadAction<{
        talkingPointId: string;
        ticket: TalkingPointTicket;
      }>
    ) {
      const { ticket, talkingPointId } = action.payload;
      const talkingPoint = selectAgendaItem(
        state,
        talkingPointId
      ) as TalkingPoint;
      talkingPoint.tickets = [...talkingPoint.tickets, ticket];
      talkingPoint.linkedTickets = [...talkingPoint.linkedTickets, ticket.id];
    },
    unlinkTicket(
      state,
      action: PayloadAction<{
        talkingPointId: string;
        ticketId: string;
      }>
    ) {
      const { ticketId, talkingPointId } = action.payload;
      const talkingPoint = selectAgendaItem(
        state,
        talkingPointId
      ) as TalkingPoint;
      talkingPoint.tickets = talkingPoint.tickets.filter(
        (t) => t.id !== ticketId
      );
      talkingPoint.linkedTickets = talkingPoint.linkedTickets.filter(
        (id) => id !== ticketId
      );
    },
    moveTalkingPoint(
      state,
      action: PayloadAction<{ id: string; newPosition: number }>
    ) {
      const { id, newPosition } = action.payload;
      const currentMeeting = selectCurrentMeeting(state);
      const talkingPoint = selectAgendaItem(state, id) as TalkingPoint;
      const agendaItems = currentMeeting!.agendaItems.filter(
        (item) => id !== item.id
      );

      agendaItems.splice(newPosition, 0, talkingPoint); // yeah, I know. Just ignore this.

      currentMeeting!.agendaItems = agendaItems;
    },
  },
});

export const { reducer, actions } = meetingSeriesSlice;
