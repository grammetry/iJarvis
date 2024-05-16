import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { FaVideo, FaMicrophone, FaVideoSlash, FaMicrophoneSlash } from 'react-icons/fa';
import { useReactMediaRecorder } from "react-media-recorder";
import log from "../utils/console";

// function ToggleButton({ onChange, status }) {
const CustomCamera = forwardRef((props, ref) => {

    const myvideo = useRef(null);
    const canvasRef = useRef(null);

    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);


    // const {
    //     status,
    //     startRecording,
    //     stopRecording,
    //     pauseRecording,
    //     mediaBlobUrl
    // } = useReactMediaRecorder({
    //     video: false,
    //     audio: true,
    //     echoCancellation: true
    // });


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

            if (audioswitch) {
                setaudio(false);
                //stopRecording()
                closeAudio();
            }

            else {
                setaudio(true);
                //recordStream();
                openAudio();
            }


            //handleAudio();
        }

    }));

    const [myVideoStream, setMyVideoStream] = useState(null);
    const [myAudioStream, setMyAudioStream] = useState(null);
    const [myAudioRecorder, setMyAudioRecorder] = useState(null);
    const [videoswitch, setvideo] = useState(true);
    const [audioswitch, setaudio] = useState(true);

    const [chunks, setChunks] = useState([]);

    const [deviceId, setDeviceId] = useState('');


    let audioRecorder = null;


    const openAudio = async () => {
        console.log('open audio');

        // if (audioRecorder) {
        //     console.log('audio recorder exist!')
        //     audioRecorder.start();
        // } else {
        //     console.log('audio recorder create:')
        //     const mediaConstraints = {
        //         audio: {
        //             echoCancellation: true,
        //             noiseSuppression: true,
        //             sampleRate: 44100,
        //         },
        //     }
        //     const audioStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
        //     setMyAudioStream(audioStream);

        //     audioRecorder = new MediaRecorder(audioStream);
        //     // setMyAudioRecorder(audioRecorder);

        //     audioRecorder.ondataavailable = (event) => {
        //         if (event.data.size > 0) {

        //             console.log('audio event.data.size --->', event.data.size);
        //             setChunks(prev => [...prev, event.data]);
        //         }
        //     }

        //     audioRecorder.onstop = () => {
        //         const blob = new Blob(chunks, {
        //             //type: 'video/webm;codecs=vp9',
        //             type: 'audio/wav',
        //         })

        //         chunks = []
        //         const blobUrl = URL.createObjectURL(blob)


        //         console.log("recording end")
        //         console.log(blobUrl)
        //     }

        //     audioRecorder.start()
        // }

    }

    const closeAudio = () => {
        console.log('close audio');
        //let audioRecorder=myAudioRecorder;
        if (audioRecorder) {
            audioRecorder.stop();
            console.log('stop audio');
        } else {
            console.log('audio not exist');
        }
    }


    useEffect(() => {
        if (deviceId!==''){
            navigator.mediaDevices
            .getUserMedia({ 
                video: {
                    //deviceId: '7cb4fc0c7e733868c954d64e0f58915250041b41dbc0f74c1d2fa6fee037245c'
                    deviceId: deviceId,
                    // optional: [
                    //     {sourceId: deviceId}
                    // ]
                }, 
                audio: false })
            .then((stream) => {
                myvideo.current.srcObject = stream;
                myvideo.current.autoplay = true;
                myvideo.current.muted = false;
                setMyVideoStream(stream);
                //recordStream();
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

    const handleAudio_xx = () => {
        if (audioswitch) {
            console.log('--- set close ---')
            console.log('array length=', chunks.length)
            if (myVideoStream) {
                myVideoStream.getTracks().forEach(function (track) {
                    if (track.readyState === "live" &&
                        track.kind === "audio") {
                        track.enabled = false;
                    }
                });
            }
            //setChunks([]);

        } else {
            console.log('--- set open ---')
            //setChunks([]);
            console.log('array length=', chunks.length)
            if (myVideoStream) {
                myVideoStream.getTracks().forEach(function (track) {
                    if (track.readyState === "live" &&
                        track.kind === "audio") {
                        track.enabled = true;
                    }
                });
            }

        }
    };

    const handleAudio = () => {

    };

    // useEffect(() => {

    //     console.log(`width=${props.width}`)
    //     console.log(`height=${props.height}`)

    // }, [props]);

    let mediaConstraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
    }

    async function captureMediaDevices() {
        const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
        return stream
    }


    let recorder = null

    async function recordStream() {
        //const stream = await captureMediaDevices()

        console.log('record the stream')

        if (myVideoStream) {

            recorder = new MediaRecorder(myVideoStream)

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {

                    console.log('event.data.size --->', event.data.size);
                    setChunks(prev => [...prev, event.data]);

                    // if (audioswitch){
                    //     // console.log(event.data)
                    //     // chunks.push(event.data)

                    //     // let myChunks=chunks;
                    //     // myChunks.push(event.data);
                    //     setChunks(prev=>[...prev,event.data])

                    //    // setArray(oldArray => [newValue,...oldArray] );

                    // }else{
                    //     // const blob = new Blob(chunks, {
                    //     //     //type: 'video/webm;codecs=vp9',
                    //     //     type: 'audio/wav',
                    //     // })

                    //     setChunks([]);

                    //     //setChunks(prev=>[...prev,event.data])

                    //     // chunks = []
                    //     // const blobUrl = URL.createObjectURL(blob)


                    //     // console.log("recording end")
                    //     // console.log(blobUrl)
                    // }
                }
            }

            recorder.onstop = () => {
                const blob = new Blob(chunks, {
                    //type: 'video/webm;codecs=vp9',
                    type: 'audio/wav',
                })

                chunks = []
                const blobUrl = URL.createObjectURL(blob)


                console.log("recording end")
                console.log(blobUrl)
            }

            recorder.start(200)

        } else {
            console.log('stream not exist')
        }
    }


    // function stopRecording() {
    //     if (myAudioStream) {
    //         myAudioStream.getTracks().forEach((track) => {

    //             if (track.kind === "audio") {
    //                 track.enabled = false;
    //             }
    //         })
    //     }

    // }



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
