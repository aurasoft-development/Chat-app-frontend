import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModel from './miscelleniues/ProfileModel';
import UpdateGroupChatModel from './miscelleniues/UpdateGroupChatModel';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import io from "socket.io-client";
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
const ENDPOINT = "http://127.0.0.1:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, setNotification} = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("Connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);


  const postNotification = async (newMessageReceived) => {
    console.log("newMessage ----->",newMessageReceived)
    // newMessageReceived.chat.users.map((e)=>console.log("e--->",e))

    try {
      const config = {

        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },

      };
      const data = await axios.post(
        "/api/notification/send_notification",
        {
          chat: newMessageReceived.chat._id,
          sender_id: newMessageReceived.sender._id,
          receiver_id: newMessageReceived.chat.users[0],
          names: user.name,
          messageData: newMessageReceived.content
        },
        config
      );
      setNotification(data);
    } catch (error) {
      toast({
        title: "Error Occuredd!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (newMessageReceived) {
          postNotification(newMessageReceived)
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occuredd!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };


  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // eslint-disable-next-line
    if (!socketConnected) return; {
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "25px", md: "20px" }}
            pb={3}
            px={2}
            w='100%'
            fontFamily={"Poppins,sans-serif"}
            fontWeight={"600"}
            display={'flex'}
            justifyContent={{ base: "space-between" }}
            alignItems={'center'}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{
                color: "green",
                cursor: "pointer",
                background: "#EDF2F7",
                width: "40px",
                paddingTop: "8px",
                borderRadius: "6px",
                height: "40px",
                display: "flex",
                justifyContent: "center"
              }}><CallIcon /> </div>
              <div style={{
                color: "green",
                cursor: "pointer",
                background: "#EDF2F7",
                width: "40px",
                paddingTop: "8px",
                borderRadius: "6px",
                height: "40px",
                display: "flex",
                justifyContent: "center"
              }}> <VideoCallIcon /></div> </div>
            <IconButton display={{ base: "flex", md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {messages &&
              (!selectedChat.isGroupChat ? (
                <>

                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  {/* {console.log('first', getSenderFull(user, selectedChat.users))} */}
                </>
              ) : (

                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModel
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}

          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={10}
            bg="white"
            w="100%"
            h="100%"
            borderWidth={"1px"}
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div style={{ marginBottom: "15px", marginLeft: 0, color: "blue" }}>
                  Typing...
                </div>
              ) : (
                <></>
              )}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>

          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text pb={3} fontSize="20px" fontFamily="Poppins,sans-serif" fontWeight={"600"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat