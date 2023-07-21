import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useToast } from '@chakra-ui/react';
import { Box, Stack, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogic';
import GroupChatModel from './GroupChatModel';

const MyChat = () => {
  const [loggedUser, setLoggedUser] = useState();
  const [newMessage, setNewMessage] = useState("");
  const { notification, selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  // const [count,setCount]= useState('')
  // console.log("notification_1--->", notification[0])

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
      toast({
        title: "Error Occured",
        description: 'Failed to load the chats',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [])

//   const postNotification = async () => {

//     try {
//       const config = {
//         headers: {
//           "Content-type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//         await axios.post(
//         "/api/notification/send_notification",
//         {
//           sender_id: user._id,
//           receiver_id: notification[0].chat.users[0],
//           names: user.name,
//           messageData: notification[0].content
//         },
//         config
//       );
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to send the Message",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom",
//       });
//     }
//   }
// useEffect(()=>{
//   postNotification()
// },[notification])


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
          pb={3}
          px={3}
          fontSize={{ base: "30px", md: "20px" }}
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          fontFamily="Poppins,sans-serif"
          fontWeight={"600"}
        >
          My Chats
          <GroupChatModel>
            <Button
              display={"flex"}
              fontSize={{ base: "20px", md: "10px", lg: "20px" }}
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
                    <Text fontSize="15px" fontFamily="Poppins,sans-serif" fontWeight={"600"}>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}

                      {/* {notification.length} */}


                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="12px" fontFamily="Poppins,sans-serif" fontWeight={"600"}>
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}

                        {/* front on chat show counter */}


                        {/* {notification.map((u)=>{
                          return(
                            <div>
                              {notification.length}
                             </div>
                          )
                          })} */}
                      </Text>

                    )}

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