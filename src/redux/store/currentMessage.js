import { createSlice } from "@reduxjs/toolkit";

const init = {
    message: '',
    show: false
}

export const currentMessage = createSlice({
    name: "currentMessage",
    initialState: init,
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        setShow: (state, action) => {
            state.show = action.payload;
        },
    },
});



export const selectCurrentMessage = (state) => state.currentMessage;

export const { setMessage,setShow } = currentMessage.actions;  // 輸出action

export default currentMessage.reducer;