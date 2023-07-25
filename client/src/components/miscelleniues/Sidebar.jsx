import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Toast, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState();
  const [noti, setNoti] = useState([])
  const { user, setSelectedChat, chats, setChats, notification, setNotification, } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchNotifacation = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/notification/get_notification`,
        config
      );
      setNoti(data);
    } catch (error) {
      Toast({
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
    fetchNotifacation();
  }, [])
  const deleteNotifacation = async (_id) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.delete(
        `/api/notification/delete_notification/${_id}`,
        config
      );
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate('/', { replace: true })
  }
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token} `,
        },
      };
      const { data } = await axios.get(`/api/user/getalluser?search=${search}`, config)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: 'Failed to Load the Search Results',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false);
      onClose();

    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }
  return (
    <div>
      <Box display={"flex"} justifyContent="space-between" alignItems="center" bg="rgb(237 237 237)" w="100%" p="5px 10px 5px 10px" borderWidth="1px">
        <Tooltip label="Search Users to chat"
          hasArrow placement='bottom-end'
        >
          <Button className='btn' variant="ghost" onClick={onOpen}>
            <i className="fas fa-search" />
            <Text display={{ base: "none", md: "flex" }} px="4" fontSize="20px" fontFamily="Poppins,sans-serif" fontWeight={"600"} >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="20px" fontFamily="Poppins,sans-serif" fontWeight={"600"}  >
          ChatApp
        </Text>
        <div >
          <Menu>
            <MenuButton p={1} className='bellIconBox' >
              <h5 className='IconInner'>
                {noti && noti.data && noti.data.length > 0 ? <span>{noti.data.length}</span> : 0}
                </h5>
              <BellIcon className='bell' fontSize={"20px"} m={1} />
            </MenuButton>

            <MenuList >
              {/* {!noti && !noti.data.length > 0 && "No New Messages"} */}

              {noti && noti.data && noti.data.length > 0 && noti.data.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    deleteNotifacation(noti._id)
                  }}
                >
                   {/* show notification details functionality */}
                   
                  {noti.length > 0 ? <span> {"No Notifacation Message"}</span> : <span> {noti.names} :  {noti.messageData} </span> } 
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
              {user.email}
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem >My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay />
        <DrawerContent borderWidth={'1px'}>
          <DrawerHeader borderBottomWidth={"1px"} fontSize="20px" fontFamily="Poppins,sans-serif" fontWeight={"600"} >Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} pb={2}>
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}
                border={'2px solid skyblue'}
              >Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>

  )
}

export default Sidebar