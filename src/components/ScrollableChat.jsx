import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from './Context/ChatProvider'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser, } from "../config/ChatLogic";
import moment from 'moment';


const ScrollableChat = ({ messages }) => {
    const formattedTimestamp = moment(messages.timestamp).format('MMMM Do YYYY, h:mm:ss a');
    const { user } = ChatState();
    // var today = new Date();
    // var time = today.getHours() + ":" + today.getMinutes()
    return (
        <ScrollableFeed> 
             <div> ({formattedTimestamp}):</div>
            {messages &&
                messages.map((m, i) => (
                    <div className="fontS" style={{ display: "flex" }} key={m._id}>
                        {/* {m.time <= tt ? ("12:00PM") : ("")} */}
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                    <Avatar
                                        mt="7px"
                                        mr={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                    />
                                </Tooltip>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#258c60" : "#ededed"
                                    }`,
                                color: `${m.sender._id === user._id ? "white" : ""
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                borderRadius: "20px",
                                padding: "5px 20px",
                                maxWidth: "75%",
                                fontSize: "15px",
                                fontWeight: "bold",
                            }}
                        >
                           
                            <div style={{ display: "flex", gap: "5px", alignItems: "end" }}>
                                <div>{m.content}</div>
                                <div style={{ fontSize: "10px" }} >{m.time}</div>
                            </div>

                            {/* {m.createdAt} */}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;