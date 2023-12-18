import { Box } from "@chakra-ui/react";
import { ChatState } from "../components/Context/ChatProvider";
import MyChat from "../components/miscelleniues/MyChat";
import ChatBox from "../components/miscelleniues/ChatBox";
import Sidebar from "../components/miscelleniues/Sidebar";
import { useState } from "react";
import '../assets/css/pages/ChatPage.css'
const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
  return (

    <div className="chat-page-container" >
       {user && <Sidebar />}
      <Box className="chat-page-box">
        {user && <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage