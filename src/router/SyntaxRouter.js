import React, { useState } from "react";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { PersistTestPage } from "../syntax/리덕스Persist/리덕스Persist"



import store from "../syntax/리덕스Persist/persist";

let persistor = persistStore(store); //새로 고침, 종료해도 지속될 store 생성
//index.js 에서 호출될 컴포넌트임
function StartRouter3() {



    return (


        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <PersistTestPage></PersistTestPage>
            </PersistGate>
        </Provider>

    )


}

export default StartRouter3;