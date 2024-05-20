import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaVideo, FaMicrophone, FaVideoSlash, FaMicrophoneSlash } from 'react-icons/fa';
import log from "../utils/console";
import WebSocketUtility from './WebSocketUtility.js';
import { cameraWS } from '../APIPath';
import { selectCurrentMessage, setShow, setMessage } from '../redux/store/currentMessage';


const ServerCamera = forwardRef((props, ref) => {

    const myvideo = useRef(null);
    const canvasRef = useRef(null);

    const dispatch = useDispatch();

    const blobToBase64=async (blob)=> {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
    }


    const setServerCamera = async (myIndex) => {  
        
        const wsurl=`${cameraWS}?index=${myIndex}`;
        console.log(wsurl);
      
        try {

            var ws = new WebSocket(wsurl);
            ws.binaryType = 'blob';
            ws.onmessage = async(event) => {
                // var image = document.getElementById('bytes');
                // image.src = URL.createObjectURL(event.data);
                //console.log(event.data);

                const aaa=await blobToBase64(event.data);
                const bbb=aaa.replace("data:text/plain;base64,", "data:image/png;base64,");
                myvideo.current.src=bbb;

                //console.log(aaa)
                // if (myvideo.current) {
                //     myvideo.current.src = URL.createObjectURL(event.data);
                //     //myvideo.current.src = URL.revokeObjectURL(event.data);
                    
                // }   
            };
            
        } catch (error) {

            dispatch(setMessage(`Connect camera failed`));
            dispatch(setShow(true));

            
        }
      
        



    }

    const mseQueue = []
    let mseSourceBuffer
    let mseStreamingStarted = false

    const Utf8ArrayToStr = (array) => {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 7:
                    out += String.fromCharCode(c);
                    break;
                case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    const pushPacket = () => {

        //const videoEl = document.querySelector('#mse-video')
        const videoEl = myvideo.current
        let packet

        if (!mseSourceBuffer.updating) {
            if (mseQueue.length > 0) {
                packet = mseQueue.shift()
                mseSourceBuffer.appendBuffer(packet)
            } else {
                mseStreamingStarted = false
            }
        }
        if (videoEl.buffered.length > 0) {
            if (typeof document.hidden !== 'undefined' && document.hidden) {
                // no sound, browser paused video without sound in background
                videoEl.currentTime = videoEl.buffered.end((videoEl.buffered.length - 1)) - 0.5
            }
        }
    }

    const readPacket = (packet) => {

        if (!mseStreamingStarted) {
            mseSourceBuffer.appendBuffer(packet[0])
            mseStreamingStarted = true
            return
        }
        mseQueue.push(packet)
        if (!mseSourceBuffer.updating) {
            pushPacket()
        }
    }

    const startPlay = (videoEl, url) => {
        
        videoEl.pause();
        videoEl.currentTime =0;
        videoEl.srcObject =null;
       

        const mse = new MediaSource()

        log('mse')
        log(mse)


        videoEl.src = window.URL.createObjectURL(mse)
        mse.addEventListener('sourceopen', function () {
            const ws = new WebSocket(url)
            log('try ws connect...')

            ws.binaryType = 'arraybuffer'
            ws.onopen = function (event) {
                console.log('Connect to ws')
            }
            ws.onmessage = async (event)=> {

                //console.log(event.data)
                const data = new Uint8Array(event.data)
                if (data[0] === 9) {
                    // let mimeCodec
                    // const decodedArr = data.slice(1)
                    // if (window.TextDecoder) {
                    //     mimeCodec = new TextDecoder('utf-8').decode(decodedArr)
                    // } else {
                    //     mimeCodec = Utf8ArrayToStr(decodedArr)
                    // }
                    // mseSourceBuffer = mse.addSourceBuffer('video/mp4; codecs="' + mimeCodec + '"')
                    // mseSourceBuffer.mode = 'segments'
                    // mseSourceBuffer.addEventListener('updateend', pushPacket)
                } else {
                    //const base64=await blobToBase64(event.data);
                    readPacket(event.data)
                }
            }
        }, false)

        videoEl.load();
    }

    const dataUrlToBase64 = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
          reader.onerror = reject;
        });
      };

    useImperativeHandle(ref, () => ({

        setCamera: (uuid) => {
            setDeviceId(uuid);
        },
        getShot: async () => {
            
            const textBase64=await dataUrlToBase64(myvideo.current.src)
            const imageBase64=textBase64.replace("data:text/plain;base64,", "data:image/png;base64,");
            return imageBase64;
            
        },
        getCurrentWidth: () => {
            return myvideo.current.videoWidth ? myvideo.current.videoWidth : 0;
        },
        getCurrentHeight: () => {
            return myvideo.current.videoHeight ? myvideo.current.videoHeight : 0;
        },
       

    }));

    const [myVideoStream, setMyVideoStream] = useState(null);
    const [videoswitch, setvideo] = useState(true);
    const [audioswitch, setaudio] = useState(true);

    const [chunks, setChunks] = useState([]);

    const [deviceId, setDeviceId] = useState('');

    
    useEffect(() => {   

        if (props.index >= 0) {
            setServerCamera(props.index);
        }


    }, [props.index]);


    return (
        
            <div className="my-video-container d-flex align-items-center justify-content-center" style={{width:props.width,height:props.height,padding:'0px 0px'}}>
               
                    <img ref={myvideo} style={{ maxWidth: props.width, maxHeight: props.height}}>
                    </img>
                    <div className="my-video-tag d-flex flex-row" style={{ left: (props.width - 100) }}><span className="my-dot"></span><span className="my-rec">REC</span></div>

                

            </div>
            

        
    );
});

export default ServerCamera;
