import React, { useEffect, useCallback } from "react";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../components/Context/ChatProvider";
// import { MeetContext } from "../context/MeetContext";

const MeetPage = () => {
  const { user } = ChatState();
  //AS OF NOW DOMAIN WOULD BE JITSI'S AS WE ARE STILL USING THIER SERVERS
  const domain = "meet.jit.si";
  let api = {};

  const history = useNavigate();

  // THIS IS TO EXTRACT THE NAME WHICH WAS FILLED IN THE FIRST PAGE
  // const [name] = useContext(MeetContext);

  // INTIALISE THE MEET WITH THIS FUNCTION
  const startMeet = useCallback(() => {
    const options = {
      roomName: "vpaas-magic-cookie-b85c7e94eba0402fa764a7f08781bf72/SampleAppCongressionalConsequencesForecastBesides",
      width: 1400,
      height: 600,
      configOverwrite: { prejoinPageEnabled: false },
      interfaceConfigOverwrite: {
        // overwrite interface properties if you want
      },
      // VIDEO FRAME WILL BE ADDED HERE
      parentNode: document.querySelector('#jaas-container'),
      userInfo: {
        displayName: user.name,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    api = new window.JitsiMeetExternalAPI(domain, options);

    api.addEventListeners({
      readyToClose: handleClose,
      participantLeft: handleParticipantLeft,
      participantJoined: handleParticipantJoined,
      videoConferenceJoined: handleVideoConferenceJoined,
      videoConferenceLeft: handleVideoConferenceLeft,
    });
  }, [api]);

  useEffect(() => {

    if (window.JitsiMeetExternalAPI) {
      startMeet();
    } else {
      alert("JitsiMeetExternalAPI not loaded");
    }
    // eslint-disable-next-line
  }, []);

  // ALL OUR HANDLERS
  const handleClose = () => {
    console.log("handleClose");
  };

  const handleParticipantLeft = async (participant) => {
    console.log("handleParticipantLeft", participant);
    await getParticipants();
  };

  const handleParticipantJoined = async (participant) => {
    console.log("handleParticipantJoined", participant);
    await getParticipants();
  };

  const handleVideoConferenceJoined = async (participant) => {
    console.log("handleVideoConferenceJoined", participant);
    await getParticipants();
  };

  const handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    history("/chat");
  };

  // GETTING ALL PARTICIPANTS
  const getParticipants = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(api.getParticipantsInfo());
      }, 500);
    });
  };

  return (
    <React.Fragment>
      <header
        style={{
          backgroundColor: "rgb(10, 25, 41)",
          color: "white",
          textAlign: "center",
        }}
      >
      </header>
      <div id="jaas-container" style={{ marginBottom: 0 }}></div>
      <div
        style={{
          backgroundColor: "rgb(10, 25, 41)",
          height: "20vh",
          margin: 0,
        }}
      ></div>
    </React.Fragment>
  );
};

export default MeetPage;
