import {CreateClassBodyComponent} from '../createclassComponent/CreateClassBodyComponent'

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
//import {ExistCookie} from '../component/ExistCookie/ExistCookie'
export const CreateClassComponent =  () => {

    let [myinfobtn, setMyinfobtn] = useState(true);
    let [myreservepage, setMyreservepage] = useState(true);
    let [reservelist, setReserveList] = useState(null);
    let [cookie,setCookies]=useCookies(['userid']);
    let IP 
    if(window.location.href.indexOf("localhost")==-1){
        IP= process.env.REACT_APP_SMARTPHONE_IP;
    }else{
        IP= "localhost"
    }

    let navi=useNavigate();

    //로그인 이 필요한지 묻는건데 우선 주석처리하자 지금은 필요없다.
//    useEffect(   () => {

//         axios.get(`http://${IP}:4000/hascookie`)
//             .then((res) => {
//                 console.log(res.data)
//                 if(res.data.cookiestatuscode!=1){
//                     alert("로그인이필요합니다.");
//                     navi('/phonelogin');
//                 }
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//         let id = cookie.userid;
//         let data = { "id": id };
//         let headers = { 'Content-Type': 'application/json' }

//         axios.post(`http://${IP}:4000/user/mypage`, data, headers).then((res) => {
//             console.log(res.data);

//             setReserveList(res.data);

//         }).catch((err) => { console.log("뭔가망") })

//     }, [])



    return (<>        

        <CreateClassBodyComponent reservelist={reservelist}>

        </CreateClassBodyComponent>
    </>)

}