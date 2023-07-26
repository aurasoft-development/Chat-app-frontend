import { Avatar, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Toast, Wrap, WrapItem, border, color, useDisclosure } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import GetAllUserTable from "./GetAllUserTable"


export default function GetUserModel() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [getUser, seGetUser] = useState("")

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
    allUser()
  }, [])

  return (
    <>
      <h3 onClick={onOpen}> All User List</h3>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Show All User List</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ display: "flex", flexDirection: "column", gap: "10px" ,cursor:"pointer" }}>
            {getUser && getUser.data.map((value) => {
              return (

                <div style={{ display: "flex", border: '1px solid green', gap: "10px", borderRadius: "5px", fontWeight: "bold" }}  >
                  <div>
                    <Avatar size={'sm'} cursor={'pointer'} src={value.pic} />
                  </div>
                  <div><Text>{value.name}</Text></div>
                  <div><Text>{value.email}</Text></div>
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