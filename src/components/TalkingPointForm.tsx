import { Field, Form, Formik } from "formik";
import { getTicket } from "../server";
import { TalkingPoint, TalkingPointTicket } from "../types";

interface TalkingPointProps {
  talkingPoint: TalkingPoint;
  onSubmit(talkingPoint: TalkingPoint): void;
  onLinkTicket(ticket: TalkingPointTicket): void;
  onUnlinkTicket(ticket: TalkingPointTicket): void;
  onMove(talkingPoint: TalkingPoint, position: number): void;
}

export const TalkingPointForm = ({
  talkingPoint,
  onMove,
  onSubmit,
  onLinkTicket,
  onUnlinkTicket,
}: TalkingPointProps) => {
  return (
    <Formik
      initialValues={{ talkingPoint }}
      onSubmit={(data) => onSubmit(data.talkingPoint)}
    >
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "32px",
          width: 500,
        }}
      >
        {talkingPoint.text}{" "}
        <button type="button" onClick={() => onMove(talkingPoint, 0)}>
          Move Top
        </button>
        <button type="button" onClick={() => onLinkTicket(getTicket())}>
          Link ticket
        </button>
        <Field
          style={{ width: 20, height: 20 }}
          name="talkingPoint.isDone"
          type="checkbox"
        />
        <label>Title</label>
        <Field name="talkingPoint.text" />
        <label>Note</label>
        <Field name="talkingPoint.note" as="textarea" />
        <strong>Tickets</strong>
        <ul>
          {talkingPoint.tickets.map((ticket) => (
            <li key={ticket.id} onClick={() => onUnlinkTicket(ticket)}>
              {ticket.name}
            </li>
          ))}
        </ul>
        <button type="submit">Save</button>
      </Form>
    </Formik>
  );
};
