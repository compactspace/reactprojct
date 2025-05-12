import { createSlice } from "@reduxjs/toolkit";

//  핸드폰번호인증 상태 슬라이스 정의
export const PhoneAutho = createSlice({
  name: "createClassAuto",
  initialState: {
    핸드폰인증: false,
  },
  reducers: {
    set핸드폰인증(state, action) {
      state.핸드폰인증 = !state.핸드폰인증;
    },
  },
});

//  핸드폰번호인증 상태 슬라이스 정의
export const BusinessnumberAutho = createSlice({
  name: "BusinessnumberAutho",
  initialState: {
    사업자등록번호인증: false,
  },
  reducers: {
    set사업자등록번호인증(state, action) {
      state.사업자등록번호인증 = !state.사업자등록번호인증;
    },
  },
});

// 액션 생성자 export
export const { set핸드폰인증 } = PhoneAutho.actions;
// 액션 생성자 export
export const { set사업자등록번호인증 } = BusinessnumberAutho.actions;
