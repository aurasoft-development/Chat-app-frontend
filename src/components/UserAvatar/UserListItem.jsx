import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import '../../assets/css/UserAvatar/UserListItem.css'

const UserListItem = ({ handleFunction, user }) => {
  return (
    <Box
      className="userlistItem_container"
      onClick={handleFunction}
    >
      <Avatar
        mr={2}
        size="md"
        cursor="pointer"
        name={user.name}
        src={user.pic.url}
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