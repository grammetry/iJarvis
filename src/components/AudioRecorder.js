
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useReactMediaRecorder } from "react-media-recorder";
import { saveAs } from 'file-saver';


import { sttAPI,processAPI } from '../APIPath';
import { selectCurrentMessage, setShow, setMessage } from '../redux/store/currentMessage';
import log from "../utils/console";
import SoundWave from './SoundWave';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = forwardRef((props, ref) => {

    const [second, setSecond] = useState("00");
    const [minute, setMinute] = useState("00");
    const [isActive, setIsActive] = useState(false);
    const [counter, setCounter] = useState(0);

    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({

        setRecordStart: () => {
            log('recoder start');
            setIsActive(true);
            startRecording();
        },
        setRecordEnd: async () => {
            log('recoder end');
            pauseRecording();
            stopRecording();
            setIsActive(false);
        },
       

    }));

    const handleToggleRecord = () => {
        if (isActive) {
            setIsActive(false);
            pauseRecording();
            stopRecording();
        } else {
            setIsActive(true);
            startRecording();
        }   
    }


    useEffect(() => {
        let intervalId;

        if (isActive) {
            intervalId = setInterval(() => {
                const secondCounter = counter % 60;
                const minuteCounter = Math.floor(counter / 60);

                let computedSecond =
                    String(secondCounter).length === 1
                        ? `0${secondCounter}`
                        : secondCounter;
                let computedMinute =
                    String(minuteCounter).length === 1
                        ? `0${minuteCounter}`
                        : minuteCounter;

                setSecond(computedSecond);
                setMinute(computedMinute);

                setCounter((counter) => counter + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isActive, counter]);

    function stopTimer() {
        setIsActive(false);
        setCounter(0);
        setSecond("00");
        setMinute("00");
    }
    const {
        status,
        startRecording,
        stopRecording,
        pauseRecording,
        mediaBlobUrl
    } = useReactMediaRecorder({
        video: false,
        audio: true,
        echoCancellation: true
    });
   
    
    useEffect(() => {

        if (mediaBlobUrl){
            const mediaBlob = fetch(mediaBlobUrl)
            .then(response => response.blob())
            .then(blob => {
                const myFile = new File(
                    [blob],
                    "demo.wav",
                    { type: 'audio/wav' }
                );
        
                props.onStt(myFile);
            });
        }else{
            
            dispatch(setMessage('No audio file'));
            dispatch(setShow(true));
           
        }

    }, [mediaBlobUrl]);

    useEffect(() => {

            dispatch(setMessage('hello'));
            dispatch(setShow(true));
                
    }, []);

    useEffect(() => {

        //log('isActive')
        if (isActive)
            dispatch(setMessage('Recording...'));
        else
            dispatch(setMessage('Stop recording...'));

        dispatch(setShow(true));
            
    }, [isActive]);


    return (
        <div onClick={handleToggleRecord}>
            {
                (!isActive) ?
                ( <div className="icon" style={{height:40,overflowY:'hidden'}}><FontAwesomeIcon icon={faMicrophone} style={{width:36,height:36}}/></div>)
                :
                ( <div className="d-flex justify-content-center" style={{height:40,overflowY:'hidden'}}><SoundWave></SoundWave></div>)
            }
            
        </div>
    );
});
export default AudioRecorder;
