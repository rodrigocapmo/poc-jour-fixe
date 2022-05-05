import Chance from "chance";
import { actions, loadSeries } from "./slice";
import { seriesStore } from "./store";

import { getSeries } from "../server";

const chance = new Chance();

jest.mock("../server", () => ({
  getSeries: jest.fn(),
}));

describe("Slice", () => {
  // The tests work in a similar way we are used to, but the difference is that we need to also use the store to keep the state
  it("set series", () => {
    const state = { series: null };
    const series = { name: chance.name() } as any;
    seriesStore.dispatch(actions.setSeries(series));

    const newState = seriesStore.getState();
    expect(state).not.toBe({ series });
    expect(newState.meeting.series).toBe(series);
  });

  // Async tests
  describe("load series", () => {
    // Deals with the whole request process
    it("loads", async () => {
      const series = { name: chance.name() } as any;
      (getSeries as jest.Mock).mockResolvedValue(series);

      await seriesStore.dispatch(loadSeries());
      const newState = seriesStore.getState();

      expect(newState.meeting.status).toBe("success");
      expect(newState.meeting.series).toBe(series);
    });
    // Deals with error handling
    it("handle errors", async () => {
      (getSeries as jest.Mock).mockRejectedValue(new Error());

      await seriesStore.dispatch(loadSeries());
      const newState = seriesStore.getState();

      expect(newState.meeting.status).toBe("failed");
    });

    // if you wanna test an individual state you can do like this
    it("show loading", () => {
      seriesStore.dispatch({ type: loadSeries.pending.type });
      const newState = seriesStore.getState();

      expect(newState.meeting.status).toBe("loading");
    });
  });
});
