import { TeacherMainBodyComponent } from "../component/TeacherMainBodyComponent/TeacherMainBodyComponent";
import { Header } from "../header/header";
import { setOnedayclass_numList } from "../store/manageMentSlice/manageMentSlice";
import { useDispatch } from "react-redux";
import { TeacherManagerHeader } from "../header/TeacherManagerHeader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
//import {ExistCookie} from '../component/ExistCookie/ExistCookie'

export const TeacherMainPage = () => {
  const dispatch = useDispatch();

  let [reservelist, setReserveList] = useState(null);

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let navi = useNavigate();

  const [cookies, setCookie] = useCookies(["role"]); // 쿠키 훅 주의:

  useEffect(() => {
    if (cookies.role != "teacher") {
      alert("권한이 없습니다.");
      navi("/");
    } else {
      axios
        .post(`http://${IP}:4000/teacher/getOnedayClassNumList`)
        .then((res) => {
          if (res.data.getList.length === 0) {
            dispatch(setOnedayclass_numList(undefined));
          } else {
            dispatch(setOnedayclass_numList(res.data.getList));
          }
        });
    }
  }, []);

  return (
    <>
      {cookies.role != "teacher" ? (
        <></>
      ) : (
        <>
          <TeacherMainBodyComponent
            reservelist={reservelist}
          ></TeacherMainBodyComponent>
        </>
      )}
    </>
  );
};
