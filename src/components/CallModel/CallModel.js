import { Avatar, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/model/CallModel.css'
const CallModel = () => {
    // eslint-disable-next-line
    const [data, setData] = useState(false)
    const { video } = ChatState();
    const history = useNavigate();
    const acceptCalls = () => {
        history(video.url)
    }
    const deleteNotification = async () => {
        history('/chat')
    }
    return <div className='fontS call_container'>
        <div>  <h1>Wellcome to audio page</h1> </div>
        <div className='call_div_main'>
            <div><Avatar size={'lg'} cursor={'pointer'} src={"user.pic.url"} /></div>
            <div><h2>{video.names}</h2></div>
            <div className='call_btn_main'>
                <div  ><Button style={{ background: "green" }} onClick={() => { setData(true); acceptCalls() }} >Accept Call</Button></div>
                <div><Button style={{ background: "red" }} onClick={() => deleteNotification()}>Reject Call</Button></div>
            </div>
        </div>
    </div>
}

export default CallModel