import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Avatar } from '@chakra-ui/react';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { generateHeaders, getSender, getSenderId, getSenderPic } from '../../config/ChatLogic';
import GroupChatModel from './GroupChatModel';
import { toast } from 'react-toastify';
import '../../assets/css/miscelleniues/MyChat.css'
import commonApiRequest from '../../api/commonApi';

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();
  // eslint-disable-next-line
  const [newMessage, setNewMessage] = useState("");
  // eslint-disable-next-line
  const [data, setData] = useState("");
  const { selectedChat, setSelectedChat, user, chats, setChats, noti } = ChatState();


  const fetchChats = async () => {
    try {
      const headers = generateHeaders(`${user.token}`)
      const { data } = await commonApiRequest('get', 'api/chat', {}, headers)
      setChats(data)

    } catch (error) {
      toast.error("Error Occured")
    }
  }

  const deleteNotifacation = async (_id) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    try {
      const headers = generateHeaders(`${userInfo.token}`)
      const data = await commonApiRequest('delete', `/api/notification/delete_notification/${_id}`, {}, headers)
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
      <Box className='mychat_box_container'
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        w={{ base: "100%", md: "31%" }}
      >
        <Box
          className='fontS sizeF mychat_box_sec'
          fontSize={{ base: "30px", md: "20px" }}
        >
          My Chats
          <GroupChatModel>
            <Button
              fontSize={{ base: "20px", md: "10px", lg: "15px" }}
              rightIcon={<AddIcon />}
              background={"none"}
            >New Group Chat</Button>
          </GroupChatModel>
        </Box>

        <Box
          className='mychat_box_third'
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
                    className='mychat_stack_first'
                    bg={selectedChat === chat ? "#258c60" : "white"}
                    color={selectedChat === chat ? "white" : ""}
                    key={chat._id}
                  >
                    <Text className='fontS sizeF' fontWeight={"600"} >
                      <div className='innerDiv' >
                        <div className='mychat_div_first'>
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
                                <Text className='mychat_text'>
                                  {/* <b>{chat.latestMessage.sender.name} : </b> */}
                                  {chat.latestMessage.content.length > 50
                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                    : chat.latestMessage.content}
                                </Text>
                              )}
                            </div>
                          </div>

                        </div>
                        <div className='mychat_div_sec'>
                          <div className='mychat_div_third'>
                            {chat.latestMessage && (
                              <Text>
                                {chat.latestMessage.time}
                              </Text>
                            )}
                          </div>
                          <div className='mychat_div_four'>
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