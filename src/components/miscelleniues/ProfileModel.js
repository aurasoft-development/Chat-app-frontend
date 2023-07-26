import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModel = ({user,children}) => {
    const {isOpen,onOpen,onClose} = useDisclosure();
  return <div>
    {children ? (<span onClick={onOpen}>{children}</span>
        ): (
            <IconButton 
            display={{base: "flex"}} 
            icon={<ViewIcon />} 
            onClick={onOpen}
            />
        )}
         <Modal size={"lg"}  isOpen={isOpen} onClose={onClose} isCentered >
        <ModalOverlay />
        <ModalContent  h="410px">
          <ModalHeader
          fontSize={'20px'}
          fontFamily={"Poppins,sans-serif"}
          display={'flex'}
          justifyContent={"center"}
          backgroundColor={"#258c60"}
          color={'white'}
          >{user.name}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody 
           display={"flex"}
           flexDir={"column"}
           alignItems={"center"}
           justifyContent={"space-between"}
           backgroundColor={"white"}
           fontSize={'20px'}
           fontFamily={"Poppins,sans-serif"}
           fontWeight={"600"}
           
          >
           <Image 
            marginTop={"15px"}          
            borderRadius={"full"}
            boxSize={"200px"}
            src={user.pic}
            alt={user.name}
           />
           <Text fontSize={{base: "28px", md: "20px"}}
           fontFamily={"Poppins,sans-serif"} >
            Email: {user.email} 
           </Text>
          </ModalBody>

          <ModalFooter backgroundColor={"#258c60"} display={'flex'} justifyContent={'space-evenly'}>
            <Button colorScheme='blue'  mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </div>
}

export default ProfileModel