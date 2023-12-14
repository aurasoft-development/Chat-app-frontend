import { Avatar, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';

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
    // useEffect(() => {
    //     setTimeout(() => {
    //         deleteNotification()
    //     }, 10000)
    //     // eslint-disable-next-line
    // }, [])
    console.log("video---->", video);
    return <div className='fontS' style={{ display: 'flex', justifyContent: "center", flexDirection: "column", gap: "40px" }}>
        <div>  <h1>Wellcome to audio page</h1> </div>
        <div style={{ border: "1px solid yellow", width: "300px", height: "300px", padding: "20px", display: 'flex', flexDirection: "column", justifyContent: 'center', gap: '40px' }}>
            <div><Avatar size={'lg'} cursor={'pointer'} src={"user.pic.url"} /></div>
            <div><h2>{video.names}</h2></div>
            <div style={{ display: 'flex', gap: "10px" }}>
                <div  ><Button style={{ background: "green" }} onClick={() => { setData(true); acceptCalls() }} >Accept Call</Button></div>
                <div><Button style={{ background: "red" }} onClick={() => deleteNotification()}>Reject Call</Button></div>
            </div>
        </div>
    </div>
}

export default CallModel