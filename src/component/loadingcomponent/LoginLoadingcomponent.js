import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
// import { changeauthtoken } from '../../store/store';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

//네이버 로그인후 콜백 url을 이 컴포넌트로 설정하자.
export const LoginLoadingComponent = () => {

    let [cookie, setCookie] = useCookies(['userid']);
    const navigate = useNavigate();

    const [local, setLocal] = useState(null);
    let dispatch = useDispatch();
    // alert(window.location.href)
    //device=phone
    let idx = window.location.href.indexOf("phone")
    let pcidx=window.location.href.indexOf("PC");
    let code;
    if (idx == -1 && pcidx==-1) {
        
        code = window.location.href.split("=")[1]
    }
    else {
        code = window.location.href.split("=")[2]
    }


    console.log(window.location.href.split("="))
    var data = {
        code: code
    }


    let IP;

    if (window.location.href.indexOf("localhost") == -1) {
        IP = process.env.REACT_APP_SMARTPHONE_IP;
    } else {
        IP = "localhost";
    }


    useEffect(() => {

        axios.get(`http://${IP}:4000/naver`, { params: data }).then((
            result) => {
            // console.log("result 값은")
            // console.log(result);
            let { accessToken } = result.data
            let { userId } = result.data


            localStorage.setItem("token", accessToken);
            localStorage.setItem("userId", userId)

            if (localStorage.getItem("token") == null) {

                alert("토큰널")
                if (idx == -1) {
                    window.location.replace('/openclass');
                } else {
                    window.location.replace('/smain');
                }

            } else {

                alert("토큰널아님")
                let { userid } = result.data;
                if (idx == -1 && pcidx ==-1) {
                    setCookie('tid', userid);
                    window.localStorage.setItem("teacher", "teacher");
                    window.location.replace('/openclass');
                } else {
                    setCookie('userid', userid);
                   if(pcidx==-1){

                       window.location.replace('/smain');
                   }
                   window.location.replace('/pmain');
                }
            }


        }).catch((err) => {
            console.log(err)
            alert("뭔가에러")
        })


    })



    //이유는 모르겟으나 아래 주석 코드는 useEffect 속에 있어야 작동함

    // if (localStorage.getItem("token") == null) {
    //     console.log("이프문 널인 경우")
    //     console.log(localStorage.getItem("token"))
    //     // dispatch(changeauthtoken(localStorage.getItem("token"))); 
    //     dispatch(changeauthtoken(true));          
    //     navigate('/main');    
    // } else {
    //     console.log("엘스문 널이 아닌경우")
    //     console.log(localStorage.getItem("token"))
    //     // dispatch(changeauthtoken(localStorage.getItem("token")))   
    //     dispatch(changeauthtoken(false));   
    //     navigate('/main')
    // }


    // let str="http://localhost:3000/LoginLoadingComponent?device=phone&code=vNoiMCQRf7UCaKG8nm&state=STATE_STRING"

    // let idx=str.indexOf("phone")


}