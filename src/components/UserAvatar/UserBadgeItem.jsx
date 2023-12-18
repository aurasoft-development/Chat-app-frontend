import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import React from 'react'
import '../../assets/css/UserAvatar/UserBadgeItem.css'

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      className="userbadge_item_container"
      variant="solid"
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;