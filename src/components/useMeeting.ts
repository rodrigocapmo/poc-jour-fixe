import {
  Meeting,
  MeetingSeries,
  TalkingPoint,
  TalkingPointTicket,
} from "../types";
import { useEffect, useState } from "react";
import { getSeries, saveTalkingPoint } from "../server";

export function useMeeting() {
  const [series, setSeries] = useState<MeetingSeries>();
  const [currentMeeting] = series?.meetings || [];

  useEffect(() => {
    // consider getSeries an apollo query
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

    /*
      If this fails we have some options:
      - block the item until the transaction is finished (super bad in my opinion)
      - undo data and ask user to perform action again (super bad in my opinion)
      - retry the same request until it works and cancel if same item receives an update (apollo has some ways to handle this)
      - send the full meeting to the backend. it will fix all inconsistencies, since the ui now has the stable data about the meeting.
    */
    saveTalkingPoint(talkingPoint);
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
