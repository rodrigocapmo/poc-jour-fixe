import "./App.css";
import { MeetingSeries } from "./types";
import { useEffect, useState } from "react";
import { getSeries } from "./server";

function App() {
  const [series, setSeries] = useState<MeetingSeries>();

  useEffect(() => {
    getSeries().then(setSeries);
  }, []);

  if (!series) return <span>This is loading</span>;

  return <div className="App">{JSON.stringify(series)}</div>;
}

export default App;
