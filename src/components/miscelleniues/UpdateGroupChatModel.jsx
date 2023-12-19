import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  Box,
  Spinner,
  Avatar,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { toast } from "react-toastify";
import '../../assets/css/miscelleniues/UpdateGroupChatModel.css'
import { generateHeaders } from "../../config/ChatLogic";
import commonApiRequest from "../../api/commonApi";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const headers = generateHeaders(`${user.token}`)
      const { data } = await commonApiRequest('get', `/api/user/getalluser?search=${search}`, {}, headers)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occured!")
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const headers = generateHeaders(`${user.token}`)
      const { data } = await commonApiRequest('put', `/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName,
      }, headers)
      setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occured!")
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!")
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can and someone!")
      return;
    }

    try {
      setLoading(true);
      const headers = generateHeaders(`${user.token}`)
      const { data } = await commonApiRequest('put', `/api/chat/groupadd`, { chatId: selectedChat._id, userId: user1._id, }, headers)
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!")
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone!")
      return;
    }

    try {
      setLoading(true);
      const headers = generateHeaders(`${user.token}`)
      const { data } = await commonApiRequest('put',`/api/chat/groupremove`, { chatId: selectedChat._id, userId: user1._id, }, headers)
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      toast.success("Left User Successful")
    } catch (error) {
      toast.error("Error Occured!")
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <Avatar size={'md'} cursor={'pointer'} src={user.pic?.url} onClick={onOpen} />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent className="fontS">
          <ModalHeader
            className="updateGroup_header"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody className="updateGroup_body">
            <Box className="updateGroup_box">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                borderColor={"blackAlpha.300"}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="blue"
                ml={1}
                mb={3}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                borderColor={"blackAlpha.300"}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter className="update-group">
            <Button onClick={() => handleRemove(user)} colorScheme="blue">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;