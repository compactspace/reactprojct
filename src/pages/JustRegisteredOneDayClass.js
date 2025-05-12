import React, { useEffect, useState } from "react";

import { JustRegisterOneDayBody } from "../component/onedayclassbodycomponent/JustRegisterOneDayBody";
import { useHistory, useParams } from "react-router-dom";

import axios from "axios";

global.Buffer = global.Buffer || require("buffer").Buffer;

export const JustRegisteredOneDayClass = () => {
  let IP;

  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let oneday41 =
    "https://videos.pexels.com/video-files/17486817/17486817-uhd_2560_1440_60fps.mp4";

  const [vmatch, setVmatch] = useState(false);
  const [fordb, setFordb] = useState(null);
  const [이미지리스트, set이미지리스트] = useState(null);

  // 아래 훅은 옆의 윈도우객체로 받고 쌩쇼를 해야 원하는걸 뽑는걸 console.log(window.location.pathname)
  // 간단히 해주는 훅인듯
  let { id } = useParams();

  let data = { onedayclass_num: id };
  let detailinfoarr;
  useEffect(() => {
    
    axios
      .post(
        `http://${IP}:4000/noneuser/justregisterOneDayClasspage`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": `application/json`,
          },
        }
      )
      .then((res) => {
        let { classinfo, imglist } = res.data;

        //   console.log(classinfo);

        let classinfoObject = classinfo[0];

        //  console.log(imglist);
        let imgList = new Array();
        for (let i = 0; i < imglist.length; i++) {
          let buffer = new Buffer.from(imglist[i].reserve_img);
          imgList.push(buffer.toString());
        }

        // console.log(imgList);
        // console.log(classinfoObject);

        // detailinfoarr = OneDayclassinfoObj.onedayclass_info.split('_');

        let fordbobj = {
          onedayclass_name: classinfoObject.onedayclass_name,
          onedayclass_num: classinfoObject.onedayclass_num,
          onedayclass_price: classinfoObject.onedayclass_price,
          ClassIntro: classinfoObject.ClassIntro,
          ClassLocation: classinfoObject.ClassLocation,
          Park: classinfoObject.Park,
          PlayTime: classinfoObject.PlayTime,

          Playinguser: classinfoObject.Playinguser,

          onedayclass_playinfo: classinfoObject.onedayclass_playinfo,

          reserve_img: classinfoObject.reserve_img,
        };

        // console.log(fordbobj);
        console.log(imgList);
        setFordb(fordbobj);
        set이미지리스트(imgList);
        // setOnedayinfo(detailinfoarr);
      });
  }, []);

  const [onedayinfo, setOnedayinfo] = useState(["--불러오는중--"]);

  const [dayinfo, setDayinfo] = useState({
    0: ["10자리", "11:00~12:00", "10자리", "2:00~3:00", "마감", "4:00~6:00"],
    1: ["1자리", "11:00~12:00", "1자리", "2:00~3:00", "10자리", "4:00~6:00"],
    2: ["22자리", "11:00~12:00", "2자리", "2:00~3:00", "10자리", "4:00~6:00"],
    3: [
      "13자리",
      "11:00~12:00",
      "4자리",
      "2:00~3:00",
      "오후 10시반 마감",
      "4:00~6:00",
    ],
    4: ["15자리", "11:00~12:00", "11자리", "2:00~3:00", "11자리", "4:00~6:00"],
    5: ["11자리", "11:00~12:00", "7자리", "2:00~3:00", "14자리", "4:00~6:00"],
  });

  useEffect(() => {
    //네브바 색 반전은 뷰포트 기준 1320 부터 걸자.
    window.addEventListener("scroll", (e) => {
      // console.log(`ScrollY 는 뷰포트 기준->>> ${window.scrollY}`)
      if (window.scrollY >= 1320) {
        setVmatch(true);
      } else {
        setVmatch(false);
      }
    }); // 윈도우 이벤트 리스너 종료
  }, [vmatch]); // 유즈이펙트 종료

  return (
    <>
      {fordb == null ? (
        <>
          <h1>-----------loding</h1>
        </>
      ) : (
        <>
          <JustRegisterOneDayBody
            onedayclass_num={id}
            vmatch={vmatch}
            fordbobj={fordb}
            이미지리스트={이미지리스트}
            onedayinfo={onedayinfo}
            dayinfo={dayinfo}
          ></JustRegisterOneDayBody>
        </>
      )}
    </>
  );
};
