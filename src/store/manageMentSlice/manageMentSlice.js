import { createSlice } from "@reduxjs/toolkit";

export const onedayclass_numList = createSlice({
  name: "onedayclass_numList",
  initialState: [],
  reducers: {
    setOnedayclass_numList(state, action) {
      return action.payload;
    },
  },
});
export const { setOnedayclass_numList } = onedayclass_numList.actions;