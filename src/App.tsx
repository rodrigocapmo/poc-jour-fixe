import "./App.css";
import {
  Meeting,
  MeetingSeries,
  TalkingPoint,
  TalkingPointTicket,
} from "./types";
import { useEffect, useState } from "react";
import { getSeries } from "./server";
import { Header } from "./components/Header";
import { TalkingPointForm } from "./components/TalkingPointForm";
import { TalkingPointTickets } from "./components/TalkingPointTickets";
import { Draggable } from "./components/Draggable";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Droppable } from "./components/Droppable";

function App() {
  const [series, setSeries] = useState<MeetingSeries>();
  const [currentMeeting] = series?.meetings || [];

  useEffect(() => {
    getSeries().then(setSeries);
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

    agendaItems.splice(newPosition, 0, talkingPoint);

    updateMeeting({
      ...currentMeeting,
      agendaItems,
    });
  };

  if (!series) return <span>This is loading</span>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Header title={series.name} date={series.date} onEdit={() => {}} />
        <h3>Agenda Items</h3>
        {currentMeeting.agendaItems.map((item, index) => (
          <div key={item.id}>
            <Droppable type="item" index={index}>
              <Draggable
                type="item"
                talkingPoint={item as TalkingPoint}
                onMove={moveTalkingPoint}
              >
                <TalkingPointForm
                  talkingPoint={item as TalkingPoint}
                  onSubmit={updateTalkingPointGeneralData}
                  onMove={moveTalkingPoint}
                >
                  <TalkingPointTickets
                    tickets={(item as TalkingPoint).tickets}
                    onLinkTicket={(ticket) =>
                      linkTicket(item as TalkingPoint, ticket)
                    }
                    onUnlinkTicket={(ticket) =>
                      unlinkTicket(item as TalkingPoint, ticket)
                    }
                  />
                </TalkingPointForm>
              </Draggable>
            </Droppable>
          </div>
        ))}
      </div>
    </DndProvider>
  );
}

export default App;
