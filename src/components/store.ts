import { configureStore } from "@reduxjs/toolkit";
import { reducer as meetingSeriesReducer } from "./slice";

export const seriesStore = configureStore({
  reducer: {
    meeting: meetingSeriesReducer,
  },
});
