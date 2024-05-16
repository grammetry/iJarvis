import {
    useEffect, useState,
    useRef
} from "react";
import {
    FaVideo, FaMicrophone,
    FaVideoSlash, FaMicrophoneSlash
} from 'react-icons/fa';
 
export default function App() {
    const [mystream, setmystream] = useState(null);
    const [videoswitch, setvideo] = useState(true);
    const [audioswitch, setaudio] = useState(true);
    const myvideo = useRef(null);
 
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                myvideo.current.srcObject = stream;
                myvideo.current.autoplay = true;
                myvideo.current.muted = false;
                setmystream(stream);
            });
    }, []);
 
    const handleVideo = () => {
        if (videoswitch) {
            setvideo(false);
            mystream.getTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "video") {
                    track.enabled = false;
                }
            });
        } else {
            setvideo(true);
            mystream.getTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "video") {
                    track.enabled = true;
                }
            });
        }
    };
    const handleAudio = () => {
        if (audioswitch) {
            setaudio(false);
            mystream.getTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "audio") {
                    track.enabled = false;
                }
            });
        } else {
            setaudio(true);
            mystream.getTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "audio") {
                    track.enabled = true;
                }
            });
        }
    };
    return (
        <div>
 
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <img src=
                    "https://media.geeksforgeeks.org/gfg-gg-logo.svg" />
            </div>
 
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px",
                    marginTop: "10px"
                }}
            >
                <video ref={myvideo}
                    style={{
                        width: "800px", height: "600px",
                        transform: "scaleX(-1)"
                    }}>
                </video>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
            }}>
                <button
                    onClick={handleVideo}
                    style={{
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "grey",
                        color: "white"
                    }}
                    title=
                    {videoswitch ?
                        "Turn off video" :
                        "Turn on video"}
                >
                    {videoswitch ? (
                        <FaVideo style={{ fontSize: '1.3rem' }} />
                    ) : (
                        <FaVideoSlash style={{ fontSize: '1.3rem' }} />
                    )}
                </button>
                <button
                    onClick={handleAudio}
                    style={{
                        marginLeft: "10px",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "grey",
                        color: "white"
                    }}
                    title=
                    {audioswitch ?
                        "Turn off audio" :
                        "Turn on audio"}
                >
                    {audioswitch ? (
                        <FaMicrophone
                            style={{ fontSize: '1.3rem' }} />
                    ) : (
                        <FaMicrophoneSlash
                            style={{ fontSize: '1.3rem' }} />
                    )}
                </button>
            </div>
        </div>
    );
}