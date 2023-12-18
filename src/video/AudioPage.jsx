import React, { useEffect, useState } from 'react'
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import '../assets/css/model/AudioModel.css'
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
    const [avatar, setAvatar] = useState("");
    const [valumeAvatar, setValumeAvatar] = useState("");
    const [getMember, setGetMember] = useState("")
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [getMemberId, setGetMemberId] = useState("");
    const { user } = ChatState();
    const { id } = useParams()
    const history = useNavigate();
    // const img = ""

    const [roomId] = useState(id)
    let rtcClient;
    let rtmClient;
    let channel;
    // let getMemberId
    const token = null
    const appid = process.env.REACT_APP_APPID;

    const rtcUid = Math.floor(Math.random() * 2032)
    const rtmUid = String(Math.floor(Math.random() * 2032))

    const initRtm = async () => {

        rtmClient = AgoraRTM.createInstance(appid)
        await rtmClient.login({ 'uid': rtmUid, 'token': token })

        channel = rtmClient.createChannel(roomId)
        await channel.join()

        await rtmClient.addOrUpdateLocalUserAttributes({ 'name': user?.name, 'userRtcUid': rtcUid.toString(), 'userAvatar': user?.pic?.url })

        // console.log();

        getChannelMembers()

        window.addEventListener('beforeunload', leaveRtmChannel)

        channel.on('MemberJoined', handleMemberJoined)
        // channel.on('MemberLeft', handleMemberLeft)
    }

    const initRtc = async () => {
        rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        //rtcClient.on('user-joined', handleUserJoined)
        rtcClient.on("user-published", handleUserPublished)
        rtcClient.on("user-left", handleUserLeft);


        await rtcClient.join(appid, roomId, token, rtcUid)
        audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        audioTracks.localAudioTrack.setMuted()
        await rtcClient.publish(audioTracks.localAudioTrack);

        initVolumeIndicator()
    }

    let initVolumeIndicator = async () => {

        //1
        AgoraRTC.setParameter('AUDIO_VOLUME_INDICATION_INTERVAL', 200);
        rtcClient.enableAudioVolumeIndicator();

        //2
        rtcClient.on("volume-indicator", volumes => {
            volumes.forEach((volume) => {
                //3
                try {
                    let item = document.getElementsByClassName(`user-avatar-${volume.uid}`)[0]
                    if (volume.level >= 50) {
                        item.style.borderColor = '#00ff00'
                    } else {
                        item.style.borderColor = "#fff"
                    }
                } catch (error) {
                    console.error(error)
                }

            });
        })
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
        setGetMemberId(MemberId)
        let { name, userRtcUid, userAvatar } = await rtmClient.getUserAttributesByKeys(MemberId, ['name', 'userRtcUid', 'userAvatar'])
        setGetMember(name)
        setAvatar(userAvatar)
        setValumeAvatar(userRtcUid)
        setIsRunning(true)
    }

    let handleMemberLeft = async () => {
        setGetMember("")
        setGetMemberId("hyy")
        // window.location.reload()
        // document.getElementById(getMemberId).remove()
        history("/chat");

    }

    let getChannelMembers = async () => {
        let members = await channel.getMembers()
        for (let i = 1; members.length > i; i++) {
            const { name, userRtcUid, userAvatar } = await rtmClient.getUserAttributesByKeys(members[1], ['name', 'userRtcUid', 'userAvatar'])
            setGetMember(name)
            setAvatar(userAvatar)
            setValumeAvatar(userRtcUid)
            setIsRunning(true)
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

    useEffect(() => {
        if (isRunning === true) {
            setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
    }, [isRunning]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };
    return (
        <>

            <div className='main_model_audio'>
                <div>
                    <div className='audio_body'>
                        <div className='audio_main_div'>
                            <img id='vavatar' className={`user-avatar-${valumeAvatar}`} src={`${avatar}`} alt='demo' />
                            <span id={getMemberId}>{getMember}</span>
                            {getMember ? <span> {formatTime(time)}</span> : <span>Ringing...</span>}
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