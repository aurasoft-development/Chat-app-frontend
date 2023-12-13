// import { ViewIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import '../assets/css/AudioModel.css'
import img from '../assets/image/image.jpg'
import AgoraRTC from "agora-rtc-sdk-ng"
import AgoraRTM from "agora-rtm-sdk"
import { ChatState } from '../components/Context/ChatProvider';
import { useNavigate, useParams } from 'react-router-dom';

function AudioPage() {
    const [audioTracks] = useState({
        localAudioTrack: null,
        remoteAudioTracks: {},
    });
    const [micMuted, setMicMuted] = useState(true);
    const [avatar] = useState(img);
    const [getMember, setGetMember] = useState("")
    const { user } = ChatState();
    const { id } = useParams()
    const history = useNavigate();


    const [roomId] = useState(id)
    let rtcClient;
    let rtmClient;
    let channel;
    let getMemberId
    const token = null
    const appid = "d833589916f543f7a7f82c34a937fee3"

    const rtcUid = Math.floor(Math.random() * 2032)
    const rtmUid = String(Math.floor(Math.random() * 2032))

    const initRtm = async () => {

        rtmClient = AgoraRTM.createInstance(appid)
        await rtmClient.login({ 'uid': rtmUid, 'token': token })

        channel = rtmClient.createChannel(roomId)
        await channel.join()

        await rtmClient.addOrUpdateLocalUserAttributes({ 'name': user?.name, 'userRtcUid': rtcUid.toString(), 'userAvatar': avatar })

        // console.log();

        getChannelMembers()

        window.addEventListener('beforeunload', leaveRtmChannel)

        channel.on('MemberJoined', handleMemberJoined)
        channel.on('MemberLeft', handleMemberLeft)
    }

    const initRtc = async () => {
        rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        //rtcClient.on('user-joined', handleUserJoined)
        rtcClient.on("user-published", handleUserPublished)
        rtcClient.on("user-left", handleUserLeft);


        await rtcClient.join(appid, roomId, token, rtcUid)
        audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        audioTracks.localAudioTrack.setMuted(micMuted)
        await rtcClient.publish(audioTracks.localAudioTrack);

        // initVolumeIndicator()
    }

    let handleUserPublished = async (user, mediaType) => {
        await rtcClient.subscribe(user, mediaType);

        if (mediaType === "audio") {
            audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack]
            user.audioTrack.play();
        }
    }

    let handleUserLeft = async (user) => {

        delete audioTracks.remoteAudioTracks[user.uid]
        document.getElementById(user.uid).remove()
    }

    let handleMemberJoined = async (MemberId) => {
        alert("join member")
        getMemberId = MemberId;
        let { name } = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid', 'userAvatar'])
        setGetMember(name)
    }

    let handleMemberLeft = async (getMemberId) => {
        history("/chat");
        setGetMember("")
        document.getElementById(getMemberId).remove()

    }

    let getChannelMembers = async () => {
        let members = await channel.getMembers()
        for (let i = 1; members.length > i; i++) {
            const { name } = await rtmClient.getUserAttributesByKeys(members[1], ['name', 'userRtcUid', 'userAvatar'])
            setGetMember(name)
        }
    }

    const toggleMic = async () => {
        if (micMuted) {
            setMicMuted(false)
        } else {
            setMicMuted(true)
        }
        audioTracks.localAudioTrack.setMuted(micMuted)
    }
    const enterRoom = async () => {
        initRtc()
        initRtm()
    }

    let leaveRtmChannel = async () => {
        await channel.leave()
        await rtmClient.logout()
    }

    let leaveRoom = async () => {
        audioTracks.localAudioTrack.stop()
        audioTracks.localAudioTrack.close()
        rtcClient.unpublish()
        rtcClient.leave()

        leaveRtmChannel()
    }

    useEffect(() => {
        enterRoom()
        // eslint-disable-next-line
    }, [])

    return (
        <>

            <div className='main_model_audio'>
                <div>
                    <div className='audio_body'>
                        <div className='audio_main_div'>
                            <Avatar height={100} width={100} src={img} />
                            <span id={getMemberId}>{getMember}</span>
                            <span>Ringing...</span>
                        </div>
                    </div>

                    <div className='Audio_model_footer'>
                        <div className='footer_mice' onClick={() => toggleMic()}>{micMuted === true ? <MicIcon fontSize='medium' /> : <MicOffIcon fontSize='medium' />}</div>
                        <div className='footer_call_end' onClick={() => { leaveRoom(); handleMemberLeft() }} ><CallEndIcon fontSize='medium' /></div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AudioPage;