// import { ViewIcon } from '@chakra-ui/icons';
import { Avatar, Button, Image, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return <div className='fontS sizeF'>
    {children ? (<span onClick={onOpen}>{children}</span>
    ) : (
      <Avatar size={'md'} cursor={'pointer'} src={user.pic?.url} onClick={onOpen} />
    )}
    <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered >
      <ModalOverlay />
      <ModalContent h="410px">
        <ModalHeader
          className='fontS sizeF'
          display={'flex'}
          justifyContent={"center"}
          backgroundColor={"#258c60"}
          color={'white'}
          p={'20px !important'}
        >{user.name}</ModalHeader>
        <ModalBody
          className='sizeF'
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          backgroundColor={"white"}
          // fontSize={'20px'}
          fontWeight={"600"}

        >
          <Image
            marginTop={"15px"}
            borderRadius={"full"}
            boxSize={"200px"}
            src={user.pic?.url}
            alt={user.name}
          />
          <Text
            className='fontS'
            fontSize={{ base: "28px", md: "15px" }}
          >
            Email: {user.email}
          </Text>
        </ModalBody>

        <ModalFooter className='sizeF' backgroundColor={"#258c60"} display={'flex'} justifyContent={'space-evenly'}>
          <Button colorScheme='blue' onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </div>
}

export default ProfileModel