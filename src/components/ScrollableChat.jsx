import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from './Context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, } from "../config/ChatLogic";
import '../assets/css/ScrollableChat.css'


const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div className="fontS fontS sc_div_main" key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic.url}
                                    />
                                </Tooltip>
                            )}
                        <span
                            className="scrollablechat_span"
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#258c60" : "#ededed"
                                    }`,
                                color: `${m.sender._id === user._id ? "white" : ""
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                            }}
                        >

                            <div className="scrollablechat_div">
                                <div>{m.content}</div>
                                <div className="sc_div">{m.time}</div>
                            </div>
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;