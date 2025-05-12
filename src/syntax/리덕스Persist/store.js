
import { createSlice } from '@reduxjs/toolkit'



let cookie = createSlice({
    name: "userid",
    initialState: null,
    reducers: {
        putUserid(state, x) {
            console.log(x)
            state = x;
            return state;
        },

        deleUserid() {
            return null;
        }

    }
})
export const { putUserid, deleUserid } = cookie.actions;

export default cookie;


