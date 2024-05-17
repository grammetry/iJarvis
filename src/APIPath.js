// const localhost = 'http://10.204.16.53';
// const wsLocalhost = 'ws://10.204.16.53';
// const port = ':9527';

// const localhost = 'http://localhost';
// const wsLocalhost = '';
// const port = '';

const localhost = `http://${window.location.host}`;
const wsLocalhost = `ws://${window.location.host}`;
const port = '';

// ProjectPage
export const predictAPI = `${localhost}${port}/predict`;

export const processAPI= `${localhost}${port}/process`;

export const sttAPI= `${localhost}${port}/stt`;

export const cameraWS= `${wsLocalhost}${port}/camera`; 

export const sttWS= `${wsLocalhost}${port}/websocket/stt`; 

export const predictWS = `${wsLocalhost}${port}/websocket/predict`;