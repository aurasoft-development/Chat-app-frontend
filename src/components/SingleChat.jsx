import React, { useEffect, useState } from 'react'
import { ChatState } from './Context/ChatProvider'
import { Box, Button, FormControl, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogic';
import ProfileModel from './miscelleniues/ProfileModel';
import UpdateGroupChatModel from './miscelleniues/UpdateGroupChatModel';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CallIcon from '@mui/icons-material/Call';
import io from "socket.io-client";
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import MoodIcon from '@mui/icons-material/Mood';
import data from '@emoji-mart/data'
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import Picker from '@emoji-mart/react'
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
  const [showEmojis, setShowEmojis] = useState(false);
  const { user, selectedChat, setSelectedChat, setNotification, setVideo } = ChatState();
  const navigation = useNavigate();

  const sendVideo = async () => {
    if (selectedChat && selectedChat.users.length > 0) {
      // eslint-disable-next-line
      selectedChat.users.map((e) => {
        if (user._id !== e._id) {
          const data = {
            url: `/video/call/${user._id}`,
            sender_id: user._id,
            receiver_id: e._id,
            names: user.names
          }
          socket.emit('send_notification', data)
        }
      })
    }
  }
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
    // getVideo()
    socket.on('receive_notification', (data) => {
      console.log("receiverd data --->", data)
      setVideo(data)
      navigation('/call/model')
    })
    // eslint-disable-next-line
  })

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);


  const postNotification = async (newMessageReceived) => {
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
          receiver_id: user._id,
          names: newMessageReceived.sender.name,
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
          // postNotification(newMessageReceived)
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (newMessageReceived) {
          postNotification(newMessageReceived)
        }
      }
    });
    // eslint-disable-next-line
  }, []);

  const sendMessage = async (event) => {
    if (event.key === "Enter" ? event.key === "Enter" : event === "submit" && newMessage) {
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
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setNewMessage(newMessage + emoji);

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
  // we will use this to navigate next page
  const history = useNavigate();

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            className='fontS sizeF'
            fontSize={{ base: "25px", md: "20px" }}
            pb={3}
            px={2}
            w='100%'
            fontWeight={"600"}
            display={'flex'}
            justifyContent={{ base: "space-between" }}
            alignItems={'center'}
          >
            <IconButton display={{ base: "flex", md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div>
                    <ProfileModel
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </div>
                  <div>  {getSender(user, selectedChat.users)}</div>
                </div>
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
              }}> <CallIcon onClick={() => {
                sendVideo();
                history(`/video/call/${user._id}`);
              }}
                /> </div>

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
              }}>
                <VideoCallIcon
                  onClick={() => {
                    sendVideo();
                    history(`/video/call/${user._id}`);
                  }}
                />
              </div>
            </div>

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
              onClick={sendMessage}
            >
              {isTyping ? (
                <div style={{ marginBottom: "15px", marginLeft: 0, color: "green" }}>
                  Typing...
                </div>
              ) : (
                <></>
              )}
              <InputGroup>
                <InputLeftElement >
                  <Button>  <div className="button" onClick={() => setShowEmojis(!showEmojis)}> <MoodIcon /> </div> </Button>
                </InputLeftElement>
                {/* <div className='divInput'> */}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement className="button">
                  <Button type='submit' onClick={() => sendMessage('submit')}> <SendIcon /> </Button>
                </InputRightElement>
                <div>
                  {showEmojis && (
                    <div className="divPiker">
                      <Picker
                        data={data}
                        emojiSize={20}
                        emojiButtonSize={28}
                        onEmojiSelect={addEmoji}
                        maxFrequentRows={0}
                      />
                    </div>
                  )}


                </div>
                {/* </div> */}
              </InputGroup>
            </FormControl>

          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box className='fontS sizeF' display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text pb={3} fontSize="20px" fontWeight={"600"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat