import "./App.css";
import { MeetingSeries, TalkingPoint } from "./types";
import { useEffect, useState } from "react";
import { getSeries } from "./server";
import { Header } from "./components/Header";
import { TalkingPointForm } from "./components/TalkingPointForm";

function App() {
  const [series, setSeries] = useState<MeetingSeries>();

  useEffect(() => {
    getSeries().then(setSeries);
  }, []);

  if (!series) return <span>This is loading</span>;

  const [currentMeeting] = series.meetings;

  return (
    <div className="App">
      <Header title={series.name} date={series.date} onEdit={() => {}} />
      {currentMeeting.agendaItems.map((item) => (
        <TalkingPointForm talkingPoint={item as TalkingPoint} />
      ))}
    </div>
  );
}

export default App;
