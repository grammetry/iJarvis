import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { FaVideo, FaMicrophone, FaVideoSlash, FaMicrophoneSlash } from 'react-icons/fa';
import log from "../utils/console";

const CustomCamera = forwardRef((props, ref) => {

    const myvideo = useRef(null);
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({

        setCamera: (uuid) => {
            setDeviceId(uuid);
        },
        getShot: () => {
            console.log('get shot')

            if (canvasRef.current) {
                canvasRef.current.width = myvideo.current.videoWidth;
                canvasRef.current.height = myvideo.current.videoHeight;
                const myContext = canvasRef.current.getContext('2d');
                myContext.drawImage(myvideo.current, 0, 0, myvideo.current.videoWidth, myvideo.current.videoHeight);
                return canvasRef.current.toDataURL();
            } else {
                return '';
            }

        },
        getCurrentWidth: () => {
            return myvideo.current.videoWidth ? myvideo.current.videoWidth : 0;
        },
        getCurrentHeight: () => {
            return myvideo.current.videoHeight ? myvideo.current.videoHeight : 0;
        },
        getAudio: () => {

         
        }

    }));

    const [myVideoStream, setMyVideoStream] = useState(null);
    const [videoswitch, setvideo] = useState(true);
    const [audioswitch, setaudio] = useState(true);

    const [chunks, setChunks] = useState([]);

    const [deviceId, setDeviceId] = useState('');

    useEffect(() => {
        if (deviceId!==''){
            navigator.mediaDevices
            .getUserMedia({ 
                video: {  
                    deviceId: {
                        exact: deviceId,
                    }
                }, 
                audio: false })
            .then((stream) => {
                myvideo.current.srcObject = stream;
                myvideo.current.autoplay = true;
                myvideo.current.muted = false;
                setMyVideoStream(stream);
            });
        }
       
    }, [deviceId]);

    const handleVideo = () => {
        if (videoswitch) {
            setvideo(false);
            myVideoStream.getTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "video") {
                    track.enabled = false;
                }
            });
        } else {
            setvideo(true);
            myVideoStream.getTracks().forEach(function (track) {
                if (track.readyState === "live" &&
                    track.kind === "video") {
                    track.enabled = true;
                }
            });
        }
    };

    return (
        <div>
            <div className="my-video-container">
                {
                    ((props.width > 0) && (props.height > 0)) &&
                    <>
                        <video ref={myvideo} height={props.height - 7} width={props.width}>
                        </video>

                    </>
                }

                {
                    ((props.width > 0) && (props.height > 0)) &&
                    <div className="my-video-tag d-flex flex-row" style={{ left: (props.width - 100) }}><span className="my-dot"></span><span className="my-rec">REC</span></div>

                }

            </div>
            <canvas style={{ backgroundColor: 'transparent', visibility: 'hidden' }} ref={canvasRef}></canvas>

        </div>
    );
});

export default CustomCamera;
