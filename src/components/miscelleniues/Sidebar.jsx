import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs, Text, Toast, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
// import GetUserModel from './GetUserModel';

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState();
  const [data, setData] = useState("")
  const [getUser, seGetUser] = useState("")
  const { user, setSelectedChat, chats, setChats, notification, noti, setNoti } = ChatState();
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
  const allUser = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },

      }
      const userData = await axios.get(`/api/user/getuser/user`, config)
      seGetUser(userData.data)
    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "User Not Found",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }
  useEffect(() => {
    fetchNotifacation();
    allUser()
    // eslint-disable-next-line
  }, [data, notification])
  const deleteNotifacation = async (_id) => {
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
  const handleSearch = async (value) => {
    setSearch(value)
    if (!value) {
      setSearchResult([])
      return;
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token} `,
        },
      };
      const { data } = await axios.get(`/api/user/getalluser?search=${value}`, config)
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
            <Text className='fontS' display={{ base: "none", md: "flex" }} px="4" fontSize="20px" fontWeight={"600"} >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text className='fontS' fontSize="20px" fontWeight={"600"}  >
          ChatApp
        </Text>
        <div >
          <Menu>
            <MenuButton p={1} className='bellIconBox' >
              <h5 className='IconInner' >
                {noti && noti.data && noti.data.length > 0 ? <span>{noti.data.length}</span> : 0}
              </h5>
              <BellIcon className='bell' fontSize={"20px"} m={1} />
            </MenuButton>

            <MenuList >
              {/* {!noti && !noti.data.length > 0 && "No New Messages"} */}

              {noti && noti.data && noti.data.length > 0 && noti.data.map((noti) => (
                <MenuItem
                  key={noti.chat._id}
                  onClick={() => {
                    setSelectedChat(noti.chat);
                    deleteNotifacation(noti._id)
                  }}
                >
                  {/* show notification details functionality */}

                  {noti.length > 0 ? <span> {"No Notifacation Message"}</span> : <span> {noti.names} :  {noti.messageData} </span>}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu  >
            <MenuButton className='fontS sizeF ' as={Button}  rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic.url} />
              {/* {user.email} */}
            </MenuButton>
            <MenuList className='fontS sizeF'>
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
        <Tabs variant='enclosed'>
          <DrawerOverlay />
          <DrawerContent borderWidth={'1px'}>
            <TabList>
              <div className='fontS sizeF' style={{ display: "flex", justifyContent: 'space-between' }}>
                <Tab><div><DrawerHeader className='sizeF' fontWeight={"600"} >Search User</DrawerHeader></div></Tab>
                <Tab> <div><DrawerHeader className='sizeF' fontWeight={"600"} cursor={'pointer'}>All Users</DrawerHeader> </div></Tab>
              </div>
            </TabList>
            <TabPanels className='fontS sizeF'>
              <TabPanel><DrawerBody>
                <Box display={'flex'} >
                  <Input
                    className='sizeF'
                    placeholder='Search by name or email'
                    mr={2}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
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
              </TabPanel>
              <TabPanel height={'555px'} overflow={'scroll'}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", cursor: "pointer" }} >
                  {getUser && getUser.data.map((value) => {
                    return (

                      <div className="Mhover" style={{ display: "flex", borderBottom: '1px solid #ede5e5', gap: "10px", borderRadius: "5px", fontWeight: 'normal', padding: "10px", overflow: "scroll", paddingBottom: "0%" }} onClick={() => accessChat(value._id)} >
                        <div >
                          <Avatar size={'md'} cursor={'pointer'} src={value.pic.url} />

                        </div>
                        <div>
                          <div><Text>{value.name}</Text></div>
                          <div><Text>{value.email}</Text></div>

                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabPanel>
            </TabPanels>
          </DrawerContent>
        </Tabs>
      </Drawer>
    </div>

  )
}

export default Sidebar