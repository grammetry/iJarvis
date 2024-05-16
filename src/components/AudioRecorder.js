
import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { saveAs } from 'file-saver';
import { sttAPI,processAPI } from '../APIPath';
import log from "../utils/console";

const AudioRecorder = forwardRef((props, ref) => {

    const [second, setSecond] = useState("00");
    const [minute, setMinute] = useState("00");
    const [isActive, setIsActive] = useState(false);
    const [counter, setCounter] = useState(0);

    useImperativeHandle(ref, () => ({

        setRecordStart: () => {
            console.log('recoder start');
            setIsActive(true);
            startRecording();
        },
        setRecordEnd: async () => {
            console.log('recoder end');
            pauseRecording();
            stopRecording();
            //await save();
            setIsActive(false);
        },
       

    }));


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
   
    //console.log("url", mediaBlobUrl);

    // const save= async()=>{

    //     if (mediaBlobUrl){
    //         const mediaBlob = await fetch(mediaBlobUrl)
    //         .then(response => response.blob())
    //         .then(blob => {
    //             const myFile = new File(
    //                 [blob],
    //                 "demo.wav",
    //                 { type: 'audio/wav' }
    //             );
        
    //             props.onStt(myFile);
    //         });
    //     }else{
    //         alert('No audio file');
    //     }
    // }

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
            alert('No audio file');
        }

    }, [mediaBlobUrl]);

    return (
        <div>
            {
                (isActive) ?
                ( <i className="fas fa-microphone" style={{ fontSize: '40px',color:'red'}}></i>)
                :
                ( <i className="fas fa-microphone" style={{ fontSize: '40px' }}></i>)
            }
           
        </div>
    );
});
export default AudioRecorder;
