import "./App.css";
import { TalkingPoint } from "./types";
import { Header } from "./components/Header";
import { TalkingPointForm } from "./components/TalkingPointForm";
import { TalkingPointTickets } from "./components/TalkingPointTickets";
import { Draggable } from "./components/Draggable";

import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Droppable } from "./components/Droppable";
import { useMeeting } from "./components/useMeeting";

function App() {
  // We could break this into useSeries and useMeetings({series}), but I don't think it is necessary in a POC
  const {
    series,
    currentMeeting,
    moveTalkingPoint,
    updateTalkingPointGeneralData,
    linkTicket,
    unlinkTicket,
  } = useMeeting();

  if (!series || !currentMeeting) return <span>This is loading</span>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Header title={series.name} date={series.date} onEdit={() => {}} />
        <h3>Agenda Items</h3>
        {currentMeeting.agendaItems.map((item, index) => (
          // I won't bother preparing the same for sections, you get the idea.
          // I am using id as keys because they are stable and now we have this during creation
          <Droppable type="item" key={item.id} index={index}>
            <Draggable
              type="item"
              talkingPoint={item as TalkingPoint}
              onMove={moveTalkingPoint}
            >
              <TalkingPointForm
                talkingPoint={item as TalkingPoint}
                onSubmit={updateTalkingPointGeneralData}
              >
                <TalkingPointTickets // breaking tickets into their own component without dependencies from talking point form. This way we don't need to nest that much
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
        ))}
      </div>
    </DndProvider>
  );
}

export default App;
