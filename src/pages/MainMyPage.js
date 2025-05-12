import { MyPage } from "../body/mypage";
import { Header } from "../header/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
//import {ExistCookie} from '../component/ExistCookie/ExistCookie'
export const MainMyPage = () => {
  let [myinfobtn, setMyinfobtn] = useState(true);
  let [myreservepage, setMyreservepage] = useState(true);
  let [reservelist, setReserveList] = useState(null);
  let [cookie, setCookies] = useCookies(["userid"]);
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let navi = useNavigate();
  useEffect(() => {
    axios
      .get(`http://${IP}:4000/hascookie`)
      .then((res) => {
        //    console.log(res.data);
        if (res.data.cookiestatuscode != 1) {
          alert("로그인이필요합니다.");
          navi("/phonelogin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    let id = cookie.userid;
    let data = { id: id };
    let headers = { "Content-Type": "application/json" };
  }, []);

  return (
    <>
      <Header
        vmatch={"true"}
        myinfobtn={myinfobtn}
        myreservepage={myreservepage}
      ></Header>

      <MyPage reservelist={reservelist}></MyPage>
    </>
  );
};
