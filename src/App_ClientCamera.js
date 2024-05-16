import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast, cssTransition } from 'react-toastify';

import './css/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import CustomCamera from './components/CustomCamera';
import AudioRecorder from './components/AudioRecorder';
import ChatBubble from './components/ChatBubble';

//import { WebSocketUtility } from './components/WebSocketUtility';
import WebSocketUtility from './components/WebSocketUtility.js';
import AutoSizer from 'react-virtualized-auto-sizer';
import Hotkeys from "react-hot-keys";
import fontawesome from '@fortawesome/fontawesome';
import ScrollToBottom from 'react-scroll-to-bottom';
import { faUser, faKey, faMicrophone } from '@fortawesome/fontawesome-free-solid';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import moment from 'moment';
import avatar from "./assets/avatar.png";
import log from "./utils/console";

import { predictAPI,processAPI,sttAPI,sttWS } from './APIPath';
import { selectCurrentMessage, setShow, setMessage } from './redux/store/currentMessage';

function App() {

    const [userName, setUsername] = useState('Mr. Innodisk');

    const dispatch = useDispatch();
    const show = useSelector(selectCurrentMessage).show;
    const message = useSelector(selectCurrentMessage).message;

    const [chatLog, setChatLog] = useState([{
        text: `Hello, ${userName}`,
        type: 'res',
        time: moment().format('YYYY-MM-DD HH:mm:ss')
    }]);
    const [inputValue, setInputValue] = useState('');

    const [canvas01Width, setCanvas01Width] = useState(0);
    const [canvas01Height, setCanvas01Height] = useState(0);

    const [canvas01, setCanvas01] = useState(null);
    const [canvas02, setCanvas02] = useState(null);

    const [hello, setHello] = useState('Good morning');
    
    const chatBoxRef = useRef(null);
    const audioRecorderRef = useRef(null);


    const canvas01Ref = useRef(null);
    const canvas02Ref = useRef(null);
    const camera01Ref = useRef(null);
    const camera02Ref = useRef(null);

    const messagesEndRef = useRef(null);

    const scrollingBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    };

    const setChatInput = async (myText) => {
        const myInput = {
            text: myText,
            type: 'req',
            time: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        

        setChatLog(Prev=>[...Prev,myInput]);
        setInputValue('');

        scrollingBottom();

        const uuid=await predictAction(inputValue);

        if (uuid) {
            //console.log('uuid',uuid);
            getPredictResult(uuid);
        }
    }

    const handleChatInput = async () => {
        //console.log('input text')
        //console.log(inputValue)
        if (inputValue !== '') {
            setChatInput(inputValue);
        }

    }

    const predictAction = async (text) => {     
        
        if (camera01Ref.current) {

            const base64 = camera01Ref.current.getShot();
            setCanvas01(base64);

            //console.log(base64)

            const formData = new FormData();
            formData.append("prompt", text);
            formData.append("image", base64);

            const res = await fetch(predictAPI, {
                method: 'POST',   
                body: formData,
            });
          
            const data = await res.json();
 
            return data.process_uuid;    

        }else{
            return null;
        }

    }

    const getPredictResult = async (uuid) => {

        const res = await fetch(`${processAPI}?process_uuid=${uuid}`, {
            method: 'GET'
        });
      
        const data = await res.json();

        console.log(data)

        if (data.status){
            if (data.status === 'done') {
                const myInput = {
                    text: data.message,
                    type: 'res',
                    time: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                setChatLog(Prev=>[...Prev,myInput]);
                scrollingBottom();  

                if (data.image){
                    setCanvas01('data:image/png;base64,'+data.image);
                }
            }
        }

        return data;    

    }

    const handleTextChange = (evt) => {
        setInputValue(evt.target.value);
    }

    const handleCamera01Shot = (evt) => {

        console.log('handleCamera01Shot');

        if (camera01Ref.current) {

            const base64 = camera01Ref.current.getShot();
            setCanvas01(base64)

        }

    }

    const handleCamera02Shot = (evt) => {

        console.log('handleCamera02Shot');
        if (canvas02Ref.current) {
            if (camera02Ref.current) {

                const base64 = camera02Ref.current.getShot();
                setCanvas02(base64)

            }
        }
    }

    const handleRecordToggle = () => {
        console.log('handle Record Toggle');
        if (camera01Ref.current) {

            camera01Ref.current.getAudio();


        }
    }

    const handleKeyDown = (keyName, e, handle) => {

        e.preventDefault();
        console.log('-- key code ---')
        console.log(e.code)
        if (e.code === 'Enter') {
            handleChatInput();
        }

        if (e.code === 'Space') {
            if (audioRecorderRef.current) {
                audioRecorderRef.current.setRecordStart();
            }
            
        }
    };

    const handleKeyUp = (keyName, e, handle) => {

        e.preventDefault();
        console.log('-- key code ---')
        console.log(e.code)
       
        if (e.code === 'Space') {
            if (audioRecorderRef.current) {
                audioRecorderRef.current.setRecordEnd();
            }
            
        }
    };

    const handleKeyPress=(target)=> {
        if (target.charCode == 13) {
            handleChatInput();
        }
    }

    const handleHello=()=>{
        const myHour= parseInt(moment().format('HH'));
        if (myHour>=0 && myHour<12){
            setHello('Good morning');
        }else if (myHour>=12 && myHour<18){
            setHello('Good afternoon');     
        }else{
            setHello('Good evening');
        }
    }

    async function getCameraDevices(){
        //await askForPermissions();
        var allDevices = await navigator.mediaDevices.enumerateDevices();
        var cameraDevices = [];
        for (var i=0;i<allDevices.length;i++){
          var device = allDevices[i];
          if (device.kind == 'videoinput'){
            cameraDevices.push(device);
          }
        }
        //return cameraDevices;
        console.log(cameraDevices)
        if (cameraDevices.length>0){
            console.log(cameraDevices[0].deviceId)
            camera01Ref.current.setCamera(cameraDevices[0].deviceId);
        }
        if (cameraDevices.length>1){
            console.log(cameraDevices[1].deviceId)
            camera02Ref.current.setCamera(cameraDevices[1].deviceId);
        }
    }

    const handleStt = async (myFile) => {   
        console.log(myFile);

        const base64 = camera01Ref.current.getShot();
        setCanvas01(base64);

        const formData = new FormData();
        formData.append("audio", myFile);

        const res = await fetch(sttAPI, {
            method: 'POST',   
            body: formData,
        });
        
        const data = await res.json();

        const uuid= data.process_uuid;

        if (uuid) { 
            getSttResult(uuid);
        }
        
    }

    const getSttResult = async (uuid) => {  
        
        const wsurl=`${sttWS}?process_uuid=${uuid}`;
        console.log(wsurl);
        const websocket = new WebSocketUtility(wsurl);
        websocket.setMessageCallback(async (message) => {
            console.log('Received message:', message);
            const myData=JSON.parse(message);
            if (myData.status==='done'){

                if (myData.message!==''){

                    setChatInput(myData.message);
                    
                    const uuid2=await predictAction(myData.message);

                    if (uuid2) {
                        //console.log('uuid2',uuid2);
                        getPredictResult(uuid2);
                    }
                }else{
                    alert('No voice detected');
                }
                websocket.stop();
            }
        });

        websocket.start();


    }

    useEffect(() => {

        if (show)
            toast(message, {
                style: {
                    backgroundColor: '#ed1b23',
                    width: 800,
                    height: 44,
                    fontSize:'16px',
                    minHeight: 44,
                    color: 'white',
                    left:-250
                },
                
                closeOnClick: true,
                position: "bottom-center",
                pauseOnHover: true,
                draggable: false,
                theme: "light",
            });
        dispatch(setShow(false));
        dispatch(setMessage(''));

    }, [show]);


    useEffect(() => {

        handleHello();

        getCameraDevices();

        log(show)
        log(message)

    }, []);

    return (
        
            <div className="App">

                <Hotkeys
                    keyName="Enter,Space"
                    //keyName="*"
                    onKeyDown={handleKeyDown.bind(this)}
                    onKeyUp={handleKeyUp.bind(this)}
                />

                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick={true}
                    closeButton={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    // bodyClassName={"my-toast-body"}

                />

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-9 my-camera-area" >
                            <div className="container">
                                <div className="row gap-3">
                                    <div className="col my-camera-cell">
                                        <div className='my-camera-frame '>
                                            <AutoSizer>
                                                {({ height, width }) => (
                                                    <div className="my-camera-container" style={{ width: (width - 5), height: (height - 7) }}>

                                                        <CustomCamera height={height} width={width} ref={camera01Ref}></CustomCamera>


                                                        <div style={{ position: 'absolute', left: -85, top: (height - 23) }}>
                                                            <div className="my-video-name" >CAM 1</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </AutoSizer>

                                        </div>
                                    </div>
                                    <div className="col my-camera-cell">
                                        <div className='my-camera-frame'>
                                            <AutoSizer>
                                                {({ height, width }) => (
                                                    <div style={{ width: (width - 5), height: (height - 7), backgroundColor: '#1e293b', borderRadius: '10px', position: 'relative' }}>

                                                        <CustomCamera height={height} width={width} ref={camera02Ref}></CustomCamera>


                                                        <div style={{ position: 'absolute', left: -85, top: (height - 23) }}>
                                                            <div className="my-video-name" >CAM 2</div>
                                                        </div>
                                                    </div>

                                                )}
                                            </AutoSizer>

                                        </div>
                                    </div>
                                </div>
                                <div className="row gap-3 mt-2">
                                    <div className="col my-camera-cell">
                                        <div className='my-camera-frame'>
                                            <AutoSizer>
                                                {({ height, width }) => (
                                                    <div className="d-flex align-items-center justify-content-center" style={{ width: (width - 5), height: (height - 7), backgroundColor: '#1e293b', borderRadius: '10px', position: 'relative' }}>

                                                        <img src={canvas01} style={{ maxWidth: '100%', maxHeight: '100%' }}></img>
                                                        <div style={{ position: 'absolute', left: -85, top: (height - 23) }}>
                                                            <div className="my-video-name" onClick={handleCamera01Shot} style={{ cursor: 'pointer' }}>Shot</div>
                                                        </div>
                                                    </div>

                                                )}
                                            </AutoSizer>

                                        </div>
                                    </div>
                                    <div className="col my-camera-cell">
                                        <div className='my-camera-frame'>
                                            <AutoSizer>
                                                {({ height, width }) => (
                                                    <div style={{ width: (width - 5), height: (height - 7), backgroundColor: '#1e293b', borderRadius: '10px', position: 'relative' }}>
                                                        <img src={canvas02} style={{ maxWidth: '100%', maxHeight: '100%' }}></img>
                                                        <div style={{ position: 'absolute', left: -85, top: (height - 23) }}>
                                                            <div className="my-video-name" onClick={handleCamera02Shot} style={{ cursor: 'pointer' }}>Shot</div>
                                                        </div>
                                                    </div>

                                                )}
                                            </AutoSizer>

                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <span className='my-footer-name'>Home Jarvis</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-3 my-chat-area position-relative">
                            <div className="container">
                                <div className="row mt-3">
                                    <div className="col d-flex justify-content-begin">
                                        <div className="my-hello">{hello}</div>
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    <div className="col">
                                        <div className="my-conversation-area">
                                            <div className="container">
                                                <div className="row mt-3">
                                                    <div className="col d-flex justify-content-begin">
                                                        <div className="my-name">{userName}</div>
                                                    </div>

                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col d-flex justify-content-begin">
                                                        <div className="my-name-tag">User Account</div>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col d-flex justify-content-begin">
                                                        <div className="my-date">{moment().format('ll')}</div>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col my-chat-box">


                                                        {chatLog.map((item, idx) => (
                                                            <ChatBubble item={item} key={idx}></ChatBubble>
                                                        ))}
                                                        <div ref={messagesEndRef}><div style={{ height: '60px' }}></div></div>
                                                    </div>

                                                </div>


                                            </div>
                                        </div>
                                        <div className="my-conversation-input">
                                            <div className="container">
                                                <div className="row mt-3">
                                                    <div className="col d-flex justify-content-center ">
                                                        <div className="my-micro" style={{ cursor: 'pointer' }} onClick={handleRecordToggle}>
                                                            <AudioRecorder onStt={handleStt} ref={audioRecorderRef}></AudioRecorder>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="row mt-1">
                                                    <div className="col d-flex justify-content-between">
                                                        <input type="text" className="form-control-lg my-text-input" placeholder="Type your message"
                                                            onChange={handleTextChange} value={inputValue} onKeyPress={handleKeyPress}
                                                        ></input>
                                                        <div className="my-enter" onClick={handleChatInput}>
                                                            <i className="fas fa-play" style={{ fontSize: '30px', marginTop: 5 }}></i>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='position-absolute top-0 end-0 d-flex align-items-end justify-content-start' style={{ width: 185, height: 140 }}>
                                <div className='my-avatar'>
                                    <img src={avatar}></img>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>



            </div>
        
    );
}

export default App;
