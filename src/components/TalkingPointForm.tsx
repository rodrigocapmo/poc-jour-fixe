import { Field, Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { TalkingPoint } from "../types";

interface TalkingPointProps {
  talkingPoint: TalkingPoint;
  children: React.ReactElement;
  onSubmit(talkingPoint: TalkingPoint): void;
}

export const TalkingPointForm = ({
  talkingPoint,
  children,
  onSubmit,
}: TalkingPointProps) => {
  const [shouldShowMore, setShowMore] = useState(false); // Spliting state from data. Also solve problems with state sync.
  const toggleShowMore = useCallback(
    () => setShowMore((isShowingMore) => !isShowingMore),
    []
  );
  const hasShowMoreButton =
    talkingPoint.tickets.length > 0 || !!talkingPoint.note; // Deriving state

  return (
    <Formik
      initialValues={{ talkingPoint }}
      enableReinitialize={false} // Not necessary to update with changes because the dataflow is one way
      onSubmit={(data) => onSubmit(data.talkingPoint)}
    >
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          background: "white",
          gap: "10px",
          border: "1px solid red",
          padding: "1em",
          marginBottom: "32px",
          width: 500,
        }}
      >
        <div>
          <button type="submit">Save</button>
        </div>
        <Field
          style={{ width: 20, height: 20 }}
          name="talkingPoint.isDone"
          type="checkbox"
        />
        <label>Title</label>
        <Field name="talkingPoint.text" />
        "Saved" data, should only update when you save it - {talkingPoint.text}
        {hasShowMoreButton && (
          <button type="button" onClick={toggleShowMore}>
            {shouldShowMore ? "Show less" : "Show more"}
          </button>
        )}
        {shouldShowMore && (
          <>
            <label>Note</label>
            <Field name="talkingPoint.note" as="textarea" />
            {children}
          </>
        )}
      </Form>
    </Formik>
  );
};
