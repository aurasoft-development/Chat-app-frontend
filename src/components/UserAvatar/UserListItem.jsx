import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ handleFunction ,user}) => {
  // const { user } = ChatState();
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      // bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      // d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="10px"
      borderBottom={'1px solid #ede5e5'}
      display={'flex'}
    >
      <Avatar
        mr={2}
        size="md"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;