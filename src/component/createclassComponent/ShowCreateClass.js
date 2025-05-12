import React, { useEffect, useState } from "react";

import { ShowCreateClassBody } from "../../component/createclassComponent/ShowCreateClassBody";
import { useHistory, useParams } from "react-router-dom";

export const ShowCreateClass = ({ 수업정보상태 }) => {
  let oneday41 =
    "https://videos.pexels.com/video-files/17486817/17486817-uhd_2560_1440_60fps.mp4";

  const [vmatch, setVmatch] = useState(false);
  const [fordb, setFordb] = useState(null);

  // 아래 훅은 옆의 윈도우객체로 받고 쌩쇼를 해야 원하는걸 뽑는걸 console.log(window.location.pathname)
  // 간단히 해주는 훅인듯
  let { id } = useParams();

  let data = { onedayclass_num: id };
  let detailinfoarr;

  const [paramid, setParamid] = useState([0, 1, 2, 3, 4]);

  // console.log(id == paramid[id])

  // const [onedayimg, setOnedayimg] = useState([oneday11, oneday12, oneday13, oneday14, oneday15, oneday16, oneday17])

  // const [onedayimg2, setOnedayimg2] = useState([oneday21, oneday22, oneday23, oneday24, oneday25, oneday26, oneday27])

  // const [onedayimg3, setonedayimg3] = useState([oneday31, oneday32, oneday33, oneday34, oneday35, oneday36, oneday37]);

  // const [onedayimg4, setonedayimg4] = useState([oneday41, oneday42, oneday43, oneday44, oneday45, oneday46, oneday47]);

  // const [onedayimg5, setonedayimg5] = useState([oneday51, oneday52, oneday53, oneday54, oneday55, oneday56, oneday57]);

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

  // let imgarray = [onedayimg, onedayimg2, onedayimg3,onedayimg4,onedayimg5];

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
      <ShowCreateClassBody
        onedayclass_num={0}
        vmatch={vmatch}
        fordbobj={fordb}
        수업정보상태={수업정보상태}
        onedayinfo={onedayinfo}
        dayinfo={dayinfo}
      ></ShowCreateClassBody>
      {/* {id == paramid[id] ?
            <ShowCreateClassBody onedayclass_num={0} vmatch={vmatch} fordbobj={fordb} onedayimg={onedayimg} onedayinfo={onedayinfo} dayinfo={dayinfo} >
            
            
            </ShowCreateClassBody>

            :
            <>
                <h1>잘못들어옴 ㅅㄱ</h1>
            </>}
        */}
    </>
  );
};
