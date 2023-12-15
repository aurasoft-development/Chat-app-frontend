import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import { toast } from 'react-toastify'

const GroupChatModel = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const { user, chats, setChats } = ChatState();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.get(`/api/user/getalluser?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast.error("Error Occured!")
        }
    }
    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.warn("please fill all the feilds")
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const { data } = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            },
                config
            )
            setChats([data, ...chats])
            onClose()
            toast.success("New Group Chat Created!")
        } catch (error) {
            toast.warn("fields to create chats")
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== delUser._id)
        )
    }
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warn("User already added")
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };
    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        className='fontS sizeF'
                        display={"flex"}
                        justifyContent={"center"}
                        bg={'#258c60'}
                        color={'white'}
                        p={'20px !important'}
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"} bg={'white'}>
                        <FormControl>
                            <Input placeholder='ChatName' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users eg: John, rahul, jane' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {selectedUsers.map(u => (
                                <UserBadgeItem key={user._id} user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? <div>loading</div> : (
                            searchResult?.slice(0, 4).map(user =>
                                <UserListItem key={user._id} user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            )
                        )}
                    </ModalBody>

                    <ModalFooter bg={'#258c60'} display={'flex'} justifyContent={'space-evenly'}>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel