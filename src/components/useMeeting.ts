import { TalkingPoint, TalkingPointTicket } from "../types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, selectCurrentMeeting, loadSeries } from "./slice";

export function useMeeting() {
  const series = useSelector((data: any) => data.meeting.series);
  const currentMeeting = useSelector((data: any) =>
    selectCurrentMeeting(data.meeting)
  );
  const status = useSelector((data: any) => data.meeting.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "idle") dispatch(loadSeries() as any); // dependency conflict, I won't spend time fixing it
    // We don't refetch, after the initial load we only rely on state updates
  }, [status, dispatch]);

  const updateTalkingPointGeneralData = (talkingPoint: TalkingPoint) =>
    dispatch(actions.updateTalkingPointGeneralData(talkingPoint));

  const linkTicket = (talkingPoint: TalkingPoint, ticket: TalkingPointTicket) =>
    dispatch(
      actions.linkTicket({
        talkingPointId: talkingPoint.id,
        ticket,
      })
    );

  const unlinkTicket = (
    talkingPoint: TalkingPoint,
    ticket: TalkingPointTicket
  ) =>
    dispatch(
      actions.unlinkTicket({
        talkingPointId: talkingPoint.id,
        ticketId: ticket.id,
      })
    );

  const moveTalkingPoint = (talkingPoint: TalkingPoint, newPosition: number) =>
    dispatch(
      actions.moveTalkingPoint({
        newPosition,
        id: talkingPoint.id,
      })
    );

  return {
    currentMeeting,
    series,
    status,

    // On each of this methods we can trigger mutations to the backend
    updateTalkingPointGeneralData,
    moveTalkingPoint,
    linkTicket,
    unlinkTicket,
  };
}
