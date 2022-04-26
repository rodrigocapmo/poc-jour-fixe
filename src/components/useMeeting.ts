import {
  Meeting,
  MeetingSeries,
  TalkingPoint,
  TalkingPointTicket,
} from "../types";
import { useEffect, useState } from "react";
import { getSeries } from "../server";

export function useMeeting() {
  const [series, setSeries] = useState<MeetingSeries>();
  const [currentMeeting] = series?.meetings || [];

  useEffect(() => {
    getSeries().then(setSeries);
    // We don't refetch, after the initial load we only rely on state updates
  }, []);

  const updateMeeting = (updatedMeeting: Meeting) => {
    const meetings = series!.meetings!.map((meeting) =>
      meeting.id === meeting.id ? updatedMeeting : meeting
    );

    setSeries({ ...series!, meetings });
  };

  const updateTalkingPoint = (talkingPoint: TalkingPoint) => {
    const agendaItems = currentMeeting.agendaItems.map((item) =>
      talkingPoint.id === item.id ? talkingPoint : item
    );

    updateMeeting({
      ...currentMeeting,
      agendaItems,
    });
  };

  const updateTalkingPointGeneralData = (talkingPoint: TalkingPoint) => {
    const { linkedTickets, tickets } = currentMeeting.agendaItems.find(
      (item) => talkingPoint.id === item.id
    ) as TalkingPoint;

    updateTalkingPoint({
      ...talkingPoint,
      linkedTickets,
      tickets,
    });
  };

  const linkTicket = (
    talkingPoint: TalkingPoint,
    ticket: TalkingPointTicket
  ) => {
    updateTalkingPoint({
      ...talkingPoint,
      linkedTickets: [...talkingPoint.linkedTickets, ticket.id],
      tickets: [...talkingPoint.tickets, ticket],
    });
  };

  const unlinkTicket = (
    talkingPoint: TalkingPoint,
    ticket: TalkingPointTicket
  ) => {
    updateTalkingPoint({
      ...talkingPoint,
      linkedTickets: talkingPoint.linkedTickets.filter(
        (id) => id !== ticket.id
      ),
      tickets: talkingPoint.tickets.filter(({ id }) => id !== ticket.id),
    });
  };

  const moveTalkingPoint = (
    talkingPoint: TalkingPoint,
    newPosition: number
  ) => {
    const agendaItems = currentMeeting.agendaItems.filter(
      (item) => talkingPoint.id !== item.id
    );

    agendaItems.splice(newPosition, 0, talkingPoint); // yeah, I know. Just ignore this.

    updateMeeting({
      ...currentMeeting,
      agendaItems,
    });
  };

  return {
    currentMeeting,
    series,

    // On each of this methods we can trigger mutations to the backend
    updateTalkingPointGeneralData,
    moveTalkingPoint,
    linkTicket,
    unlinkTicket,
  };
}
