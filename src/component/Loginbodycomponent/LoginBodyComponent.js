import styled, { css } from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const PhoneLoginBodyAllwrapper = styled.div`
  & .headerarea {
    width: 90%;
    margin: 0 auto;
    & p {
      text-align: center;
      font-family: "Noto Sans KR";
      font-weight: 100;
      font-size: 30px;
      color: #000;
      line-height: 1.35;
    }
  }

  & .formloginarea {
    width: 90%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;

    & .sign {
      display: flex;
      flex-direction: column;

      & span {
        font-family: "Noto Sans KR";
        font-weight: 800;
        font-size: 16px;
        color: #000;
        line-height: 1.5;
        display: inline-block;
      }

      & input {
        display: inline-block;
        width: 100%;
        height: 40px;
        font-family: "Noto Sans KR";
        font-weight: 400;
        font-size: 18px;
        color: #000;
        /* padding: 0 20px; */
        border-bottom: 1px solid #ddd;
        vertical-align: middle;
        background: #fff;
        position: relative;
      }

      & #submit {
        display: block;
        width: 100%;
        height: 50px;
        font-family: "Noto Sans KR";
        font-weight: 400;
        font-size: 18px;
        color: #000;
        text-align: center;
        line-height: 50px;
        background: #fff;
        border: 1px solid #777;
        border-radius: 16px;
        -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
      }
    }

    & .cutline > p {
      font-family: "Noto Sans KR";
      font-weight: 800;
      font-size: 24px;
      color: #000;
      line-height: 1.5;
    }

    & .naverlogo {
      width: 86px;
      height: 16px;
      background-image: url(/assets/web/img/sign/logo_naver.png);
    }
  }
`;

export const LoginBodyComponent = () => {
  // console.log(window.location.host)

  const [cookies, setCookie] = useCookies(["userid"]); // 쿠키 훅
  let [tid, setTid] = useState(null);
  let [password, setPassWord] = useState(null);

  let [idsigncheck, setIdSigncheck] = useState(false);
  let [pwsigncheck, setPwSigncheck] = useState(false);
  let [idstate, setIdstate] = useState(null);
  let [passwordstate, setpasswordstate] = useState(null);

  let navi = useNavigate();

  let IdChange = () => {
    tid = document.getElementById("tid").value;
    setIdSigncheck(true);
    setTid(tid);
    if (tid == "" || tid == undefined || tid == null) {
      setIdSigncheck(false);
      setTid(null);
    }
  };
  let PwChange = () => {
    password = document.getElementById("pwd").value;
    setPwSigncheck(true);
    setPassWord(password);
    if (password == "" || password == undefined || password == null) {
      setPwSigncheck(false);
      setPassWord(null);
    }
  };

  const Login = () => {
    console.log("tid.  ", tid);
    if (tid != undefined && password != undefined) {
      let data = { tid: tid, password: password };
      let url = `http://localhost:4000/teacher/login`;
      let headers = { "content-type": "application/json" };

      axios
        .post(url, data, { headers })
        .then((res) => {
          let { loginstatuscode, onedayclass_num } = res.data;
          alert(loginstatuscode + "  " + onedayclass_num);

          if (loginstatuscode == 1) {
            //  setCookie('tid',tid,'privilege',"teacher",'onedayclass_numm',3);
            // 흐음. 나중 서비스를 확장하면    onedayclass_num 을 배열로 처리해서 넣자.
            // 지금은 한선생이 하나의 클래스만 등록한다고 생각.
            window.localStorage.setItem("teacher", "teacher");
            window.localStorage.setItem("onedayclass_num", onedayclass_num);
            alert("그냥 로그인바디?");
            setCookie("userid", tid);

            navi("/openclass");
            return;
          } else {
            // alert("아이디는 신원찬 과 큐티민지 뿐입니다.!");
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        });
    }
  };

  const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID; // 발급받은 클라이언트 아이디

  const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI; // Callback URL

  const STATE = "flase";

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=STATE_STRING&redirect_uri=http://${IP}:3000/LoginLoadingComponent`;
  const NaverLogin = () => {
    //어쩔수 없다. 우선 네이버 에이피아이 호출시 기록에 남기지 않도록 replace 로 하자 이는 캐쉬에 쌓이지 않는다.
    // 그다음 콜백 url이 LoginLoadingComponent 인데 거기서도
    //replace 로 기록에 남기지 않을 것이다..
    //이게 뒤로가기 막기 최선임..
    window.location.replace(NAVER_AUTH_URL);
  };

  // const location = useLocation();

  // // console.log(location );

  // let naviegate = useNavigate();
  // useEffect(() => {
  // }, [location])
  // const NaverLogOut = () => {
  //     localStorage.clear();
  //     // dispatch(changeauthtoken(false));
  //     // window.location.replace('/main');
  //     naviegate('/main')
  // }
  // //    let dispatch=useDispatch();

  return (
    <>
      <PhoneLoginBodyAllwrapper className="PhoneLoginBodyAllwrapper">
        <div className="headerarea">
          <p>반갑습니다. 로그인 하고 더 큰 혜택을 즐기세요!</p>
        </div>

        <div className="formloginarea">
          <div className="inputarea">
            <div className="idarea sign">
              <span>아이디</span>
              <input type="text" id="tid" onChange={IdChange}></input>
            </div>
          </div>

          <div className="inputarea">
            <div className="pwarea sign">
              <span>비밀번호</span>
              <input type="password" id="pwd" onChange={PwChange}></input>
            </div>
          </div>
          <div className="inputarea" id="submit">
            <div className="pwarea sign">
              <span>로그인</span>
              <button id="submit" onClick={Login}>
                로그인
              </button>
            </div>
          </div>

          <div className="cutline">
            <p>쉽고 간편한 로그인</p>
          </div>
          <div className="inputarea" id="naverlogin">
            <div className="pwarea sign">
              <span>네이버</span>
              <button id="submit" className="naverlogo" onClick={NaverLogin}>
                네이버로그인
              </button>
            </div>
          </div>
        </div>
      </PhoneLoginBodyAllwrapper>
    </>
  );
};
