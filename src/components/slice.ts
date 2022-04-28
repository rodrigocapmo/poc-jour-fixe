import {
  Meeting,
  MeetingSeries,
  TalkingPoint,
  TalkingPointTicket,
} from "../types";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getSeries, series } from "../server";

interface State {
  status: "idle" | "loading" | "success" | "failed";
  series: MeetingSeries | null;
  currentMeeting: string | null;
}

const initialState: State = {
  status: "idle",
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

// this will deal with all the state logic of our request, we just need to listen to specifc events
export const loadSeries = createAsyncThunk(
  "meetingSeries/loadSeries",
  async () => {
    const series = await getSeries();
    return series;
  }
);

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
  extraReducers(builder) {
    // Updating status based on the state of the request
    builder
      .addCase(loadSeries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadSeries.fulfilled, (state, action) => {
        state.status = "success";
        state.series = action.payload;
      })
      .addCase(loadSeries.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { reducer, actions } = meetingSeriesSlice;
