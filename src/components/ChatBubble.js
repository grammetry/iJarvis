import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { FaVideo, FaMicrophone, FaVideoSlash, FaMicrophoneSlash } from 'react-icons/fa';
import log from "../utils/console";

// function ToggleButton({ onChange, status }) {
const ChatBubble = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({

        setChecked: (myValue) => {
            //setIsChecked(myValue);
        }

    }));

    const [mystream, setmystream] = useState(null);
    const [videoswitch, setvideo] = useState(true);
    const [audioswitch, setaudio] = useState(true);
    const myvideo = useRef(null);

    useEffect(() => {

    }, []);

    const handleVideo = () => {

    };

    const handleAudio = () => {

    };



    return (
        <div className="container" style={{padding:0,overflowX:'hidden',overflowY:'hidden'}}>
            <div className="row">
                <div className={(props.item.type === 'res') ? "col d-flex justify-content-begin" : "col d-flex justify-content-end"} style={{overflowX:'hidden'}}>
                    <div className={(props.item.type === 'res') ? "my-bubble-res" : "my-bubble-req"}>
                        {props.item.text}
                    </div>
                </div>
            </div>
            <div className="row">
                <div className={(props.item.type === 'res') ? "col d-flex justify-content-begin" : "col d-flex justify-content-end"} style={{overflowX:'hidden'}}>
                    <div className="my-bubble-time">
                        {props.item.time.substr(11,5)}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ChatBubble;
