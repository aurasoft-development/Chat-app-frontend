import { Avatar, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Toast, useDisclosure } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import { ChatState } from "../Context/ChatProvider";


export default function GetUserModel() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [getUser, seGetUser] = useState("")
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats } = ChatState();

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
      Toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }
  useEffect(() => {
    allUser()
  }, [])

  return (
    <>
      <h3 onClick={onOpen}> All User List</h3>

      <Modal isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Show All User List</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ display: "flex", flexDirection: "column", gap: "10px" ,cursor:"pointer", scroll:"smooth"}} >
            {getUser && getUser.data.map((value) => {
              return (

                <div className="Mhover" style={{ display: "flex", borderBottom: '1px solid #ede5e5', gap: "10px", borderRadius: "5px", fontWeight: 'normal',padding:"10px"}}  onClick={()=>accessChat(value._id)} >
                  <div >
                    <Avatar  size={'md'} cursor={'pointer'} src={value.pic}   />
                  </div>
                  <div>
                  <div><Text>{value.name}</Text></div>
                  <div><Text>{value.email}</Text></div>
                   
                  </div>
                </div>
              )
            })}

            {/* <GetAllUserTable /> */}


          </ModalBody>


        </ModalContent>
      </Modal>
    </>
  )
}