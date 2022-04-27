import { TalkingPoint, TalkingPointTicket } from "../types";
import { useEffect } from "react";
import { getSeries } from "../server";
import { useDispatch, useSelector } from "react-redux";
import { actions, selectCurrentMeeting, selectSeries } from "./slice";

export function useMeeting() {
  const series = useSelector((data: any) => data.meeting.series);
  const currentMeeting = useSelector((data: any) =>
    selectCurrentMeeting(data.meeting)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!series)
      // consider getSeries an apollo query
      getSeries().then((series) => dispatch(actions.setSeries(series)));
    // We don't refetch, after the initial load we only rely on state updates
  }, [series, dispatch]);

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

    // On each of this methods we can trigger mutations to the backend
    updateTalkingPointGeneralData,
    moveTalkingPoint,
    linkTicket,
    unlinkTicket,
  };
}
