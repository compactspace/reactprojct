import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storageSession from "redux-persist/es/storage";
import cookie from '../리덕스Persist/store'



const reducers = combineReducers({
  user: cookie.reducer,
});


const persistConfig = {
  key: "root",				// reducer의 어느 지점에서부터 데이터를 저장할 건지
  storage: storageSession,	//sessionStorage에 저장
  whitelist: ["user"],		// blacklist: 제외할 것 지정
};


const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer
});

export default store;