import { Field, Form, Formik } from "formik";
import { TalkingPoint } from "../types";

interface TalkingPointProps {
  talkingPoint: TalkingPoint;
}

export const TalkingPointForm = ({ talkingPoint }: TalkingPointProps) => {
  return (
    <Formik
      initialValues={{ talkingPoint }}
      enableReinitialize
      onSubmit={(values) => console.log({ values })}
    >
      <Form
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "32px",
          width: 500,
        }}
      >
        <label>Title</label>
        <Field name="talkingPoint.text" />
        <label>Note</label>
        <Field name="talkingPoint.note" />
        <button type="submit">Save</button>
      </Form>
    </Formik>
  );
};
