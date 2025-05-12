import React, { useState, useEffect } from "react";
import styled from "styled-components";

import 사진이없어요 from "../../img2/사진이없어요.png";

import { io } from "socket.io-client";

import { useCookies } from "react-cookie";

import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components

import Calendar from "react-calendar";

import { useNavigate } from "react-router-dom";
import "../../../src/body/schedul.css";
import { ReservedModal } from "../modalcomponent/reservedmodal";

import back1 from "../../img2/backicon.jpg";
import back2 from "../../img2/backicon2.jpg";

import park from "../../img2/parkicon.jpg";
import time from "../../img2/timeicon.jpg";
import headcount from "../../img2/headcounticon.jpg";
import address from "../../img2/addresicon.jpg";
import axios from "axios";

const AllWrapper = styled.div`
  width: 480px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 17px 3px rgb(171 171 171 / 50%);
  position: relative;
  background-color: #fff !important;

  & .QnA {
    padding: 10px 0px;
    display: flex;
    width: 480px;
    background: white;
    /* position: fixed; */
    bottom: 0;

    justify-content: space-between;
    height: 50px;

    & .qnabtn {
      border-radius: 10px 10px 10px 10px;
      text-align: end;
      background-color: #ff5862;
      color: #fff;
      display: flex;
      align-items: center;

      /* & button{
            font-size: 18px;
            border: none;
        } */
    }
  }
`;

const ContentWrapper = styled.div`
  margin: 0;
  padding: 0;

  ///흠.. 아무튼 이상한데
  // header 더의 엄마 또는 조상의 width를 정해도
  // 자식 손주인 header 의 width: 100%; 는 따로논다.
  // 따라서 잘 모르겠지만 max-widht 480px를 적어주자..
  & .header {
    z-index: 13;
    height: 50px;
    max-width: 480px;
    width: 100%;
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;

    & img {
      height: 100%;
      width: 50px;
    }
  }

  & .contentbodywrapper {
    max-width: 480px;
    width: 480px;
    margin: 0px auto;
    height: 430px;

    & .imgarea {
      height: 430px;

      & .videobanner {
        height: 100%;
        width: 100%;

        object-fit: cover;
      }

      & .candidateimg {
        height: 10%;
      }

      & .mainimg {
        height: 85%;
        & img {
          height: 100%;
        }
      }
    }

    & .swipermcandidateimg {
      padding: 10px 20px;

      height: 100%;

      & img {
        height: 100%;
      }
    }
  }

  & .titlearea {
    position: relative;
    margin: 15px;
    margin-bottom: unset;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(230, 230, 230, 0.5);

    & .titlename {
      font-family: NanumSquare, "Noto Sans KR", sans-serif;
      margin-right: 0px;
      margin-bottom: 10px;
      font-weight: 400;
      font-size: 13px;
      line-height: 15px;
      color: #252525;
    }

    & .titleinfo {
      color: #252525;
      font-size: 18px;
      font-weight: 700;
      line-height: 20px;
      letter-spacing: -0.08px;
      margin-bottom: 15px;
    }
  }

  & .classdetailarea {
    display: flex;
    margin: 20px 15px;
    margin-bottom: unset;
    padding-bottom: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    & > .adress {
      display: flex;
      flex-flow: row;
      gap: 10px;
      color: #252525;
      font-size: 15px;
      font-weight: 700;
      align-items: center;
    }

    & > .park {
      display: flex;
      flex-flow: row;
      gap: 10px;
      color: #252525;
      font-size: 15px;
      font-weight: 700;
      align-items: center;
    }

    & > .time {
      display: flex;
      flex-flow: row;
      gap: 10px;
      color: #252525;
      font-size: 15px;
      font-weight: 700;
      align-items: center;
    }

    & > .headcount {
      display: flex;
      flex-flow: row;
      gap: 10px;
      color: #252525;
      font-size: 15px;
      font-weight: 700;
      align-items: center;
    }
  }

  & .close {
    width: 480px;
    /* position: fixed; */
    top: 380px;
    background-color: white;

    z-index: 100;
  }

  & .restseat {
    width: 80%;
    margin: 0 auto;
    display: grid;
    grid-gap: 60px;
    grid-template-columns: 20% 20% 20%;
  }

  & .one {
  }
  & .two {
  }
  & .three {
  }

  & .btn {
    margin: 10px auto;
    display: block;
    background-color: #ff5862;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    width: 80%;
    height: 50px;
  }
`;

export const ShowCreateClassBody = ({ 수업정보상태 }) => {
  //  fordbobj null
  //  onedayimg null
  console.log(수업정보상태.reserve_img);
  console.log("길이는 왜:  ", 수업정보상태.reserve_img.length);

  let [cookie, setCookie] = useCookies(["userid"]);

  //   let onedayclass_num = props.onedayclass_num;

  //스크립트를 심는 기법이다.
  const script1 = document.createElement("script");
  script1.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
  script1.type = "text/javascript";
  script1.async = true;
  document.head.appendChild(script1);

  let naviegate = useNavigate();
  const [choiceclick, setChoiceclick] = useState([]);
  const [openmodal, setOpenmodal] = useState(false);
  const [choiceday, setChoiceday] = useState(null);
  const [choiceforforDB, setChoiceforforDB] = useState(null);

  const [open, setOpen] = useState(false);

  //페이징을 위한 state이다.
  let [review, setReivew] = useState(null);

  //문의 신청을 위한 소켓 state이다.
  let [chatsocket, setChatSocket] = useState(null);

  let test;

  let isWeekend;
  let choice;
  //   useEffect(() => {
  //     test = document.getElementsByClassName(
  //       "react-calendar__tile react-calendar__month-view__days__day"
  //     );

  //     let restseat1 = document.getElementsByClassName("one");
  //     let restseat2 = document.getElementsByClassName("two");
  //     let restseat3 = document.getElementsByClassName("three");
  //     //console.log(test)
  //     for (let k = 0; k < test.length; k++) {
  //       test[k].addEventListener("click", (e) => {
  //         // e.stopPropagation();

  //         isWeekend = e.currentTarget.className.indexOf("weekend");

  //         //어쩔수 없다. 지금 이벤트가, 서로 겹치고 난리라 e.target != e.currentTarget 기법을 활용
  //         //e.currentTarget 는 진짜 이벤트가 걸린걸 가르키고
  //         // e.target 는 이벤트가 전파된 놈까지 감지함
  //         if (e.target != e.currentTarget) {
  //           choice = e.target.getAttribute("aria-label");
  //         } else {
  //           choice = e.target.firstChild.getAttribute("aria-label");
  //         }

  //         if (isWeekend == -1) {
  //           alert("주말예약만 가능합니다.");
  //           return;
  //         }

  //         //aria-label

  //         //아이고 혈압이야.. 한글로 년 월 일 처리 되어있네
  //         let years = choice.split("년")[0].replace("년", "").trim();
  //         let month = choice.split("년")[1].split("월")[0].trim();
  //         let day = choice.split("년")[1].split("월")[1].replace("일", "").trim();

  //         // console.log("년: "+years);
  //         // console.log("월: "+month);
  //         if (month.length == 1) {
  //           month = "0" + month;
  //         }
  //         if (day.length == 1) {
  //           day = "0" + day;
  //         }
  //         let choiceforforDB = years + "-" + month + "-" + day;

  //         console.log(choiceforforDB);
  //         setChoiceforforDB(choiceforforDB);
  //         //주의 해라,, 지금 계속 요청하면 express 서버에서 Error: Too many connections 에러를 뿜는다.
  //         axios
  //           .get(
  //             "http://localhost:4000/noneuser/checkoutrest?onedayclass_num=" +
  //               `${props.onedayclass_num}` +
  //               "&openday=" +
  //               `${choiceforforDB}`
  //           )
  //           .then((result) => {
  //             let rest = result.data.rest;
  //             console.log(result.data);
  //             // console.log("반영이 않되는듯 왜? 스테이트가 변해야 하니까!! 어떻게? setState함수로!")

  //             if (rest == -1) {
  //               close = rest;
  //               console.log("잠시후 다시 시도해주세요");
  //             } else if (0 < rest || rest <= 10) {
  //               close = rest;

  //               restseat1[0].innerHTML = `<span>${rest}</span> <span>자리 남음</span>`;
  //             } else {
  //               close = rest;

  //               restseat1[0].innerHTML = `<span>예약완료</span> <span>0자리 남음</span>`;
  //             }
  //           })
  //           .catch(() => {
  //             console.log("뭔가 에러");
  //           });

  //         //나중에 데이터베이스에 한 클래스가 3개 타임으로 한다면 수정하자.
  //         // if (k in props.dayinfo) {
  //         //     // let restseat1 = document.getElementsByClassName("one");
  //         //     restseat1[0].innerHTML = `<span>${props.dayinfo[k][0]}</span> <span>${props.dayinfo[k][1]}</span>`
  //         //     // restseat1[0].innerHTML = `<span>${props.dayinfo[k][1]}</span>`
  //         //     restseat2[0].innerHTML = `<span>${props.dayinfo[k][2]}</span><span>${props.dayinfo[k][3]}</span>`
  //         //     restseat3[0].innerHTML = `<span>${props.dayinfo[k][4]}</span><span>${props.dayinfo[k][5]}</span>`
  //         // }
  //         // else {
  //         //     restseat1[0].innerText = ""
  //         //     restseat2[0].innerText = ""
  //         //     restseat3[0].innerText = ""

  //         // }
  //       });
  //     }
  //     //개별 페이지 리뷰
  //     axios
  //       .get(
  //         "http://localhost:4000/user/reivew?limit=0 &onedayclass_num=" +
  //           `${onedayclass_num}`
  //       )
  //       .then((res) => {
  //         // console.log(res.data);
  //         // console.log(res.data.reviews);
  //         setReivew(res.data);
  //       });

  //     let socket = io("http://localhost:5000/forteacheralter");
  //     setChatSocket(socket);
  //   }, []);

  //잠시 모달테스트용 클릭함수
  const Modal = () => {
    if (choiceforforDB == undefined || choiceforforDB == null) {
      alert("날짜를 달력에서 먼저 선택해주세요");
      return;
    }

    setOpenmodal(true);
  };

  let 등록된사진이없어요 = [0, 1, 2, 3, 4, 5];

  SwiperCore.use(Autoplay);
  return (
    <>
      <AllWrapper className="AllWrapper">
        <ContentWrapper>
          <div className="contentbodywrapper">
            <div className="imgarea">
              <div className="mainimg">
                {수업정보상태.reserve_img.length != 0 ? (
                  <>
                    {수업정보상태.reserve_img[0].indexOf("http") == 0 ? (
                      <>
                        <video className="videobanner" muted autoPlay loop>
                          {/* 

                                주의사항
                                호스팅 사이트가 https://www.pexels.com/ko-kr/videos/

                                라 작성자들이 동영상 지우거나 하면 동영상 못불러올 가능성도있음 에러나면 주소 링크 의심해볼것

                            https://videos.pexels.com/video-files/17486817/17486817-uhd_2560_1440_60fps.mp4
                            
                            https://videos.pexels.com/video-files/9968970/9968970-uhd_2560_1440_25fps.mp4
                            
                            
                            */}
                          <source
                            src="https://videos.pexels.com/video-files/17486817/17486817-uhd_2560_1440_60fps.mp4"
                            type="video/mp4"
                          />
                          <strong>
                            Your browser does not support the video tag.
                          </strong>
                        </video>
                      </>
                    ) : (
                      <>
                        <Swiper
                          className="swipermainimg"
                          style={{ height: "100%" }}
                          slidesPerView={1}
                        >
                          {수업정보상태.reserve_img.map((obj, index) => (
                            <SwiperSlide Slide class="swiper-slide">
                              {choiceclick.length == 0 ? (
                                <>
                                  <img
                                    style={{ width: "100%" }}
                                    src={`${obj}`}
                                  ></img>
                                </>
                              ) : choiceclick[0] != null ? (
                                <>
                                  <img
                                    style={{ width: "100%" }}
                                    // src={`${onedayimg[choiceclick[0]]}`}
                                  ></img>
                                </>
                              ) : (
                                <></>
                              )}
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Swiper
                      className="swipermainimg"
                      style={{ height: "100%" }}
                      slidesPerView={1}
                    >
                      {등록된사진이없어요.map((obj, index) => (
                        <SwiperSlide Slide class="swiper-slide">
                          <img
                            style={{ width: "100%" }}
                            src={사진이없어요}
                          ></img>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </>
                )}
              </div>
              <div className="candidateimg">
                <Swiper
                  className="swipermcandidateimg"
                  style={{ padding: "5px 4px !important" }}
                  slidesPerView={7}
                >
                  {수업정보상태.reserve_img.length != 0 ? (
                    <>
                      {수업정보상태.reserve_img.map((obj, index) => (
                        <SwiperSlide Slide class="swiper-slide">
                          <img
                            className="candidatelist"
                            style={{ width: "57.33px" }}
                            src={`${obj}`}
                            onClick={
                              obj[0].indexOf("http") == 0
                                ? (this.disabled = true)
                                : () => {
                                    let deep1 = [...choiceclick];
                                    deep1[0] = index;
                                    setChoiceclick(deep1);
                                  }
                            }
                            className="imgs"
                          ></img>
                        </SwiperSlide>
                      ))}
                    </>
                  ) : (
                    <>
                      {등록된사진이없어요.map((obj, index) => (
                        <SwiperSlide Slide class="swiper-slide">
                          <img
                            style={{ width: "100%" }}
                            src={사진이없어요}
                          ></img>
                        </SwiperSlide>
                      ))}
                    </>
                  )}
                </Swiper>
              </div>
            </div>
          </div>

          <div className="classdetailarea">
            <div className="adress">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${address}`}></img>
              </div>

              <div>[{수업정보상태.ClassLocation}]</div>
            </div>
            <div className="park">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${park}`}></img>
              </div>
              <div>
                <span>[{수업정보상태.Park}]</span>
              </div>
            </div>
            <div className="time">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${time}`}></img>
              </div>
              <div>
                <span>[{수업정보상태.PlayTime}]</span>
              </div>
            </div>
            <div className="headcount">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${headcount}`}></img>
              </div>
              <div>
                <span>[{수업정보상태.Playinguser}]</span>
              </div>
            </div>
          </div>

          <div className="schedul">
            <Calendar></Calendar>

            <div className="restseat">
              <div className="restseats">
                <div></div>
                <div className="one"></div>
              </div>
              <div className="restseats">
                <div className="two"></div>
              </div>
              <div className="restseats">
                <div className="three"></div>
              </div>
            </div>
          </div>

          <div className="QnA">
            <div
              className="qnabtn"
              onClick={() => {
                alert(
                  "미리보기 창으로 \n 클래스 정상 등록시 \n 학생들이 \n 선생님들에게 채팅을요청합니다."
                );
              }}
            >
              1대1 문의하기
            </div>
          </div>
        </ContentWrapper>
      </AllWrapper>
      {openmodal ? (
        <>
          <ReservedModal
            device={"PC"}
            openmodal={openmodal}
            choiceforforDB={choiceforforDB}
          ></ReservedModal>
        </>
      ) : (
        <> null</>
      )}
    </>
  );
};
