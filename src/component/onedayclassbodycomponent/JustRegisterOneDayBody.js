import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { io } from "socket.io-client";

import { useCookies } from "react-cookie";
import { DateAndCal } from "../../syntax/날짜객체와달력/DateAndCal";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components

import { Scheduler } from "./schedul";
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

    justify-content: end;
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

const Reivewwrapper = styled.div`
  padding-top: 30px !important;

  & .reivewarea {
    display: flex;
    justify-content: space-between;
  }

  & .reviewtextarea {
    padding: 24px 18px;
    border-radius: 5px;
    background-color: #f8f8f8;
    margin-bottom: 10px;
    max-height: 120px;
  }

  & .reviewheader {
    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;
  }

  & .reviewimg {
    width: 40px;
    height: 40px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    margin-right: 10px;
  }

  //css

  & .reviewbody {
    margin-top: 10px;
    height: 105px;
    font-size: 14px;
  }

  & .writereview {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  & .justname {
    text-align: center;

    color: #212121;
    border-radius: 3px 3px 3px 3px;
  }
`;

export const JustRegisterOneDayBody = (props) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }
  //console.log(props);

  let [cookie, setCookie] = useCookies(["userid"]);

  //let testid=window.localStorage.getItem('id');

  let id = cookie.userid;

  // console.log("testid::  "+testid)

  let onedayclass_num = props.onedayclass_num;

  let userId = window.localStorage.getItem("userId");

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

  //리뷰리스트를 담고 있는 스테이트
  let [reviewList, setReviewList] = useState(null);
  let [totalReviewCnt, setTotalReviewCnt] = useState(null);

  // 각각 이전 페이지, 다음 페이지 를 담고있을 스테이트
  const [stReviewPage, SetStReviewPage] = useState(0);
  const [edReviewPage, SetEdReviewPage] = useState(10);

  const [공정한리뷰니, set공정한리뷰니] = useState(true);

  //문의 신청을 위한 소켓 state이다.
  let [chatsocket, setChatSocket] = useState(null);

  useEffect(() => {
    axios
      .post(`http://${IP}:4000/user/reivew`, {
        cPage: 0,
        onedayclass_num: onedayclass_num,
      })
      .then((res) => {
        //{reviewList: Array(0), totalReviewCnt: 3}

        // console.log(res.data);
        // console.log(res.data.reviewList);
        setReviewList(res.data.reviewList);
        setTotalReviewCnt(res.data.totalReviewCnt);
      });

    let socket = io(`http://${IP}:5000/forteacheralter`);
    setChatSocket(socket);
  }, []);

  const backreview = () => {
    let test = stReviewPage - 10 <= 0;

    if (test) {
      alert("처음페이지 입니다.");
      return;
    }

    let possibleSt = test ? 0 : stReviewPage - 10;

    getPagingReviewList(possibleSt);
    SetStReviewPage(possibleSt);
    SetEdReviewPage(possibleSt + 10);
  };

  const [endFlag, setEndFlag] = useState(false);
  const nextreview = () => {
    //
    let test = edReviewPage >= totalReviewCnt;

    let possibleEd = test ? edReviewPage - 10 : edReviewPage;

    if (test) {
      alert("마지막페이지 입니다.");
      return;
    }

    getPagingReviewList(possibleEd);
    SetEdReviewPage(possibleEd + 10);
    SetStReviewPage(possibleEd);
  };

  //페이징 버튼계산 로그용
  // useEffect(() => {
  //   console.log(
  //     `stReviewPage: ${stReviewPage},  edReviewPage: ${edReviewPage}`
  //   );
  // }, [stReviewPage, edReviewPage]);

  const getPagingReviewList = (cPage) => {
    axios
      .post(`http://${IP}:4000/user/reivew`, {
        cPage: cPage,
        onedayclass_num: onedayclass_num,
      })
      .then((res) => {
        setReviewList(res.data.reviewList);
      });
  };

  //잠시 모달테스트용 클릭함수
  const Modal = () => {
    if (choiceday === null) {
      alert("날짜를 달력에서 먼저 선택해주세요");
      return;
    }
    setOpenmodal(true);
  };

  const handleDataFromChild = (data) => {
    setChoiceday(data);
  };

  useEffect(() => {
    console.log(`choiceday:  ${choiceday}`);
  }, [choiceday]);

  SwiperCore.use(Autoplay);
  return (
    <>
      <button onClick={Modal}>모달테스트 버튼</button>
      <AllWrapper className="AllWrapper">
        <ContentWrapper>
          <div className="header">
            <div className="leftheader">
              {props.vmatch ? (
                <>
                  <img
                    src={`${back1}`}
                    onClick={() => {
                      naviegate("/pmain");
                    }}
                  ></img>
                </>
              ) : (
                <>
                  <img
                    src={`${back2}`}
                    onClick={() => {
                      naviegate("/pmain");
                    }}
                  ></img>
                </>
              )}
            </div>
            <div className="rightheader"></div>
          </div>
          <div className="contentbodywrapper">
            <div className="imgarea">
              <div className="mainimg">
                {props.이미지리스트[0]?.indexOf("http") == 0 ? (
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
                      {props.이미지리스트.map((obj, index) => (
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
                                src={`${props.이미지리스트[choiceclick[0]]}`}
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
              </div>
              <div className="candidateimg">
                <Swiper
                  className="swipermcandidateimg"
                  style={{ padding: "5px 4px !important" }}
                  slidesPerView={7}
                >
                  {props.이미지리스트.map((obj, index) => (
                    <SwiperSlide Slide class="swiper-slide">
                      <img
                        className="candidatelist"
                        style={{ width: "57.33px" }}
                        src={`${obj}`}
                        onClick={
                          obj[0]?.indexOf("http") == 0
                            ? (this.disabled = true)
                            : () => {
                                let deep1 = [...choiceclick];
                                deep1[0] = index;
                                setChoiceclick(deep1);
                              }
                        }
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          <div className="classdetailarea">
            <div className="adress">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${address}`}></img>
              </div>
              <div>{props.fordbobj.ClassLocation}</div>
              <div>{}주소링크</div>
            </div>
            <div className="park">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${park}`}></img>
              </div>
              <div>
                {props.fordbobj.Park == "준비중" ? (
                  <span>[채팅문의 주세요]</span>
                ) : (
                  props.fordbobj.Park
                )}
              </div>
            </div>
            <div className="time">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${time}`}></img>
              </div>
              <div>
                {props.fordbobj.PlayTime == "준비중" ? (
                  <span>[채팅문의 주세요]</span>
                ) : (
                  props.fordbobj.PlayTime
                )}
              </div>
            </div>
            <div className="headcount">
              <div style={{ height: "20px" }}>
                <img style={{ height: "100%" }} src={`${headcount}`}></img>
              </div>
              <div>
                {props.fordbobj.Playinguser == "준비중" ? (
                  <span>[채팅문의 주세요]</span>
                ) : (
                  props.fordbobj.Playinguser
                )}
              </div>
            </div>
          </div>

          <div className="schedul">
            <DateAndCal onSend={handleDataFromChild}></DateAndCal>
          </div>

          <div className="QnA">
            {/*위치가 지금 마음에 안들면 맨 밑에있는 걸 그대로 주석 해체하면서
                     css position을 fixed만 추가해라
                    */}
            <div
              className="qnabtn"
              onClick={() => {
                // let testid=window.localStorage.getItem('id');
                if (id == "" || id == null) {
                  alert("로그인이필요합니다.");
                  return;
                } else {
                  chatsocket.emit("chatapplication", {
                    id: id,
                    onedayclass_num: onedayclass_num,
                  });

                  chatsocket.on("confirm", (data) => {
                    console.log(data);
                    if (data.resstatus == 1) {
                      alert("채팅방으로이동합니다.");
                      naviegate("/qna/" + onedayclass_num + "/" + id);
                    } else {
                      alert("상담이지연중입니다. 잠시후 다시 시도해주세요");
                    }
                  });
                  // naviegate('/qna/'+onedayclass_num);
                }
              }}
            >
              1대1 문의하기
            </div>
          </div>
          <Reivewwrapper className="reivewwrapper">
            <div className="reivewarea">
              <h3>후기 {totalReviewCnt} 개</h3>
              <h3
                onClick={() => {
                  if (id == "" || id == null) {
                    alert("로그인이필요합니다.");
                    return;
                  }
                  if (공정한리뷰니) {
                    axios
                      .post(`http://${IP}:4000/user/checkreceipt`, {
                        onedayclass_num: onedayclass_num,
                      })
                      .then((res) => {
                        const { usingStatus } = res.data;

                        if (usingStatus === 1) {
                          naviegate("/writingreview/" + onedayclass_num);
                        } else if (usingStatus === -100) {
                          set공정한리뷰니(false);
                          alert(
                            "공정한 리뷰 작성 후기를 지향 합니다.\n 이용한 횟수만큼 후기작성이 가능합니다."
                          );
                        } else {
                          set공정한리뷰니(false);
                          alert(
                            "공정한 리뷰 작성 후기를 위해 먼저\n 클래스를 이용해주셔야 합니다."
                          );
                        }
                      });
                  }
                }}
              >
                후기 작성하기
              </h3>
            </div>
            <div className="justline"></div>
            {reviewList == null ? (
              <>
                <h3>준비중</h3>
              </>
            ) : reviewList != null ? (
              <>
                <div
                  onClick={() => {
                    backreview();
                  }}
                >
                  이전 리뷰
                </div>
                {reviewList.map((v) => {
                  let index = v.review_create_at.indexOf("T");
                  // console.log("T의 인덱스: " + index);
                  let review_create_at = v.review_create_at.substr(0, index);
                  // console.log(review_create_at);

                  return (
                    <>
                      <div key={v.review_num} className="reviewtextarea">
                        <div className="reviewheader">
                          <div
                            className="reviewimg"
                            style={{
                              backgroundImage:
                                "url(" +
                                `${
                                  v.review_img == "noimg"
                                    ? "../imgss/defaultreviewimg.jpg"
                                    : "나중사진경로삽입"
                                }` +
                                ")",
                            }}
                          ></div>
                          <div className="justname">{v.review_name}</div>
                        </div>
                        <div className="justreveiwcreateat">
                          리뷰번호:{v.review_num} 작성일:{review_create_at}
                        </div>
                        <div className="reviewbody">
                          <div className="writereview" onError={() => {}}>
                            {v.review_comment}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}

                <div
                  onClick={() => {
                    nextreview();
                  }}
                >
                  다음
                </div>
              </>
            ) : (
              <>
                <h3
                  style={{
                    textAlign: "center",
                    backgroundColor: "#FF5862",
                    color: "#fff",
                    borderRadius: " 3px 3px 3px 3px",
                  }}
                >
                  등록된 후기가없어요
                </h3>
              </>
            )}
          </Reivewwrapper>
        </ContentWrapper>
      </AllWrapper>
      {openmodal ? (
        <>
          {/* 현재 수정으로 넘길 프롭스 application_day={choiceday} 는 잠시 삭제해봄 ,openclass_id={props.openclass_id} 도 잠시 삭제 */}
          <ReservedModal
            device={"PC"}
            openmodal={openmodal}
            choiceday={choiceday}
            fordbobj={props.fordbobj}
          ></ReservedModal>
        </>
      ) : (
        <> null</>
      )}
    </>
  );
};
