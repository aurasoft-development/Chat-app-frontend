import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Toast, useDisclosure } from "@chakra-ui/react"
import axios from "axios"
import { useEffect, useState } from "react"
import GetAllUserTable from "./GetAllUserTable"

export default function GetUserModel() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [getUser, seGetUser] = useState("")

  console.log("getuser---->", getUser)
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
          <ModalBody>
            {/* {getUser && getUser.data.map((value) => {

              <Text>name : {value.name}</Text>
            })} */}

             <GetAllUserTable />


          </ModalBody>


        </ModalContent>
      </Modal>
    </>
  )
}