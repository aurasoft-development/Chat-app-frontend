import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from '../SingleChat';
import "../../assets/css/miscelleniues/ChatBox.css"

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box className='box_container'
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      w={{ base: '100%', md: '68%' }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox