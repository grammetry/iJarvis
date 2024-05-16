import { useReactMediaRecorder } from "react-media-recorder";
import React, { useEffect, useState } from "react";
import { saveAs } from 'file-saver';
import { sttAPI,processAPI } from '../APIPath';

const AudioRecorder = (props) => {
    const [second, setSecond] = useState("00");
    const [minute, setMinute] = useState("00");
    const [isActive, setIsActive] = useState(false);
    const [counter, setCounter] = useState(0);
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
    console.log("url", mediaBlobUrl);

  


    return (
        <div
            className="my-recorder"
            style={{
                border: "1px solid black",
                backgroundColor: "black",
                width: "700px"
            }}
        >
            <div
                style={{
                    border: "1px solid #bd9f61",
                    height: "40px",
                    backgroundColor: "#bd9f61",

                }}
                className="d-flex align-items-center"
            >
                <h4
                    style={{
                        marginLeft: "10px",
                        textTransform: "capitalize",
                        fontFamily: "sans-serif",
                        fontSize: "24px",
                        color: "white",
                        paddingTop: "12px"
                    }}
                >
                    {status}
                </h4>
            </div>


            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        <video src={mediaBlobUrl} controls loop />
                    </div>
                    <div className="col-6">
                        <div className=""
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                            }}
                        >
                            <button
                                style={{
                                    backgroundColor: "black",
                                    borderRadius: "8px",
                                    color: "white"
                                }}
                                onClick={stopTimer}
                            >
                                Clear
                            </button>
                            <div style={{ marginLeft: "70px", fontSize: "54px" }}>
                                <span className="minute">{minute}</span>
                                <span>:</span>
                                <span className="second">{second}</span>
                            </div>

                    <div style={{ marginLeft: "20px", display: "flex" }}>
                        <label
                            style={{
                                fontSize: "15px",
                                fontWeight: "Normal"
                                // marginTop: "20px"
                            }}
                            htmlFor="icon-button-file"
                        >
                            <h3 style={{ marginLeft: "15px", fontWeight: "normal" }}>
                                Press the Start to record
                            </h3>
                            <div>
                                <button
                                    style={{
                                        padding: "0.8rem 1rem",
                                        border: "none",
                                        marginLeft: "15px",
                                        fontSize: "1rem",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        fontWeight: "bold",
                                        backgroundColor: "#42b72a",
                                        color: "white",
                                        transition: "all 300ms ease-in-out",
                                        transform: "translateY(0)"
                                    }}
                                    onClick={() => {
                                        if (!isActive) {
                                            startRecording();
                                        } else {
                                            pauseRecording();
                                        }

                                        setIsActive(!isActive);
                                    }}
                                >
                                    {isActive ? "Pause" : "Start"}
                                </button>
                                <button
                                    style={{
                                        padding: "0.8rem 1rem",
                                        border: "none",
                                        backgroundColor: "orange",
                                        marginLeft: "15px",
                                        fontSize: "1rem",
                                        cursor: "pointer",
                                        color: "white",
                                        borderRadius: "5px",
                                        fontWeight: "bold",
                                        transition: "all 300ms ease-in-out",
                                        transform: "translateY(0)"
                                    }}
                                    onClick={() => {
                                        stopRecording();
                                        pauseRecording();
                                    }}
                                >
                                    Stop
                                </button>
                                <button
                                    style={{
                                        padding: "0.8rem 1rem",
                                        border: "none",
                                        backgroundColor: "#df3636",
                                        marginLeft: "15px",
                                        fontSize: "1rem",
                                        cursor: "pointer",
                                        color: "white",
                                        borderRadius: "5px",
                                        fontWeight: "bold",
                                        transition: "all 300ms ease-in-out",
                                        transform: "translateY(0)"
                                    }}
                                    onClick={async() => {
                                        const mediaBlob = await fetch(mediaBlobUrl)
                                        .then(response => response.blob());
                                    
                                        const myFile = new File(
                                            [mediaBlob],
                                            "demo.wav",
                                            { type: 'audio/wav' }
                                        );

                                        props.onStt(myFile);

                                        // console.log(myFile)

                                        // let FileSaver = require('file-saver');
                                        // FileSaver.saveAs(myFile);

                                        // const base64 = camera01Ref.current.getShot();
                                        // setCanvas01(base64);
                            
                                        //console.log(base64)
                            
                                        // const formData = new FormData();
                                        // formData.append("audio", myFile);

                                        // const res = await fetch(sttAPI, {
                                        //     method: 'POST',   
                                        //     body: formData,
                                        // });
                                      
                                        // const data = await res.json();

                                        // const uuid= data.process_uuid;

                                        // if (uuid){
                                        //     console.log(uuid)
                                        // }

                                        
                             
                                        
                            

                                        
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </label>
                    </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};
export default AudioRecorder;
