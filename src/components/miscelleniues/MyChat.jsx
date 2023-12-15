import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Avatar} from '@chakra-ui/react';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender, getSenderId, getSenderPic } from '../../config/ChatLogic';
import GroupChatModel from './GroupChatModel';
import { toast } from 'react-toastify';

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();
  // eslint-disable-next-line
  const [newMessage, setNewMessage] = useState("");
  // eslint-disable-next-line
  const [data, setData] = useState("");
  const { selectedChat, setSelectedChat, user, chats, setChats, noti } = ChatState();


  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }
      const { data } = await axios.get("/api/chat", config);
      setChats(data)

    } catch (error) {
      toast.error("Error Occured")
    }
  }

  const deleteNotifacation = async (_id) => {
    // window.location.reload()
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const data = await axios.delete(
        `/api/notification/delete_notification/${_id}`,
        config
      );
      setData(data)

    } catch (error) {
      toast.error("Error Occured")
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [])
  return (
    loggedUser
      ?
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          className='fontS sizeF'
          pb={3}
          px={3}
          fontSize={{ base: "30px", md: "20px" }}
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          fontWeight={"600"}
        >
          My Chats
          <GroupChatModel>
            <Button
              display={"flex"}
              fontSize={{ base: "20px", md: "10px", lg: "15px" }}
              rightIcon={<AddIcon />}
              background={"none"}
            >New Group Chat</Button>
          </GroupChatModel>
        </Box>

        <Box
          display='flex'
          flexDir="column"
          p={3}
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
          borderWidth="1px"
        >
          {chats ? (
            <Stack overflowY='scroll'>
              {
                chats.length > 0 && chats.map((chat) => {
                  return <Box
                    onClick={() => {
                      setSelectedChat(chat);
                      setNewMessage("");
                    }
                    }
                    cursor="pointer"
                    bg={selectedChat === chat ? "#258c60" : "white"}
                    color={selectedChat === chat ? "white" : ""}
                    px={3}
                    py={2}
                    borderWidth="1px"
                    borderRadius="lg"
                    textAlign={"left"}
                    key={chat._id}
                  >
                    <Text className='fontS sizeF'  fontWeight={"600"} >
                      <div className='innerDiv' >
                        <div style={{ display: "flex", gap: "20px" }}>
                          <div>
                            <Avatar size={'md'} cursor={'pointer'} src={
                              !chat.isGroupChat
                                ? getSenderPic(loggedUser, chat.users)
                                : chat.chatName
                            } />
                          </div>
                          <div>
                            <div>
                              {!chat.isGroupChat
                                ? getSender(loggedUser, chat.users)
                                : chat.chatName}
                            </div>
                            <div>
                              {chat.latestMessage && (
                                <Text fontSize="12px"  fontWeight={"600"}>
                                  {/* <b>{chat.latestMessage.sender.name} : </b> */}
                                  {chat.latestMessage.content.length > 50
                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                    : chat.latestMessage.content}
                                </Text>
                              )}
                            </div>
                          </div>

                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ fontWeight: "400", fontSize: "12px" }}>
                            {chat.latestMessage && (
                              <Text>
                                {chat.latestMessage.time}
                              </Text>
                            )}
                          </div>
                          <div style={{ display: "flex", justifyContent: "center", background: "#10e55b", borderRadius: "50%", color: "white" }}>
                            {
                              noti.data.map((value) => {
                                return (
                                  <div onClick={() => deleteNotifacation(value._id)}>
                                    {value.sender_id === getSenderId(loggedUser, chat.users) ? <div >
                                      {value.messageData.length > 0 ? value.messageData.length : ""}
                                    </div> : <div>{""}</div>}
                                  </div>
                                )
                              })
                            }
                          </div>
                        </div>
                      </div>
                    </Text>
                  </Box>
                })}

            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
      : <din>not found</din>

  )
}

export default MyChat