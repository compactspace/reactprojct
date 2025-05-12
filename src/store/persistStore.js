import {
    combineReducers,
    configureStore
  } from "@reduxjs/toolkit";
  import { persistReducer } from "redux-persist";
  import storageSession from "redux-persist/es/storage/session";
  import cart from '../store/sliceEx01'



  const reducers = combineReducers({
    user: cart.reducer,
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