import { Box } from "@chakra-ui/react";
import { ChatState } from "../components/Context/ChatProvider";
import MyChat from "../components/miscelleniues/MyChat";
import ChatBox from "../components/miscelleniues/ChatBox";
import Sidebar from "../components/miscelleniues/Sidebar";
import { useState } from "react";
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  return (

    <div style={{ width: "100%" }} >
        <h1>This is my chat app</h1>
       {user && <Sidebar />}
      <Box style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "91.5vh", padding: "10px" }}>
        {user && <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage