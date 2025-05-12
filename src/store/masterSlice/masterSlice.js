import { createSlice } from "@reduxjs/toolkit";

// 마스터 왼쪽 메뉴바 선택 슬라이스
export const ManuSelect = createSlice({
  name: "manuSelect",
  initialState: {
    targetMenu: false,
    MenuName: "",
  },
  reducers: {
    setTargetMenu(state, action) {
      const menuName = action.payload;

      // 메뉴이름이 빈 값이 아니라면 기존 메뉴를 초기화
      if (menuName !== "") {
        state.MenuName = "";
        state.targetMenu = false;
      }

      // 새로운 메뉴로 업데이트
      state.MenuName = menuName;
      state.targetMenu = true;
    },
  },
});

// 액션 생성자 export
export const { setTargetMenu } = ManuSelect.actions;

// 리듀서 export
export default ManuSelect.reducer;
