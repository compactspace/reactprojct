import React from "react";

import { io } from "socket.io-client";
import styled, { css } from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

//let testid=window.localStorage.getItem('id');

import { useCookies } from "react-cookie";
const QuestionAllWrapper = styled.div`
  & #gobottom {
    width: 100px;
    height: 100px;
    width: 100px;
    height: 100px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("/icon/downIcon.png");
  }

  .actionadd {
    display: block;
    position: fixed;

    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;

    bottom: 100px;
    right: 0px;

    width: 100px;
    height: 100px;
    width: 100px;
    height: 100px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("icon/downIcon.png");
  }

  .actionadd2 {
    display: none;
  }

  margin: 0 auto;

  display: flex;
  flex-direction: column;

  & .header {
    background: #5988fe;
    // background: #FFF0F1;
    border-radius: 7px;
    padding: 20px 41px;
    font-style: normal;
    text-align: left;
    color: #ffffff !important;
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    // color: #FF5862;
  }

  & .chatarea {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* height: 1080px; */
    background: #e9f1fe;
    /* background-color: red; */

    & .chatinfo {
      overflow: auto;
      padding: 20px 20px;
      /* background-color: black; */

      & .lastMonthRecordWrapper {
        width: 30%;
        margin: 0 auto;
      }

      & .lastMonthRecord {
        width: 100%;
        text-align: center;
        font-weight: 600;
        color: #4a4a4a;
        font-family: "Arial", sans-serif; /* 기본 sans-serif 폰트 */
        font-size: 16px; /* 적당한 폰트 크기 */
        line-height: 1.6; /* 읽기 좋은 라인 높이 */

        background-color: rgba(110, 110, 110, 0.2);
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
}



      }

      & .me {
        display: flex;
        justify-content: end;

        & .messageheaderme {
          display: flex;
          justify-content: end;
        }

        & .timeme {
          display: flex;
          justify-content: end;
        }
      }

      & .massagecontenme {
        display: flex;
        justify-content: end;

        & .massageconten {
          background: white !important;
          color: black !important;
        }
      }

      & .other {
        display: flex;
        justify-content: start;

        & .massageconten {
          background: #306afe !important;
          color: #ffffff !important;
        }
      }

      & .messagearea {
        display: flex;
        flex-direction: column;

        & .massageconten {
          margin-bottom: 5px;

          border-radius: 7px;
          padding: 20px 50px;
          font-style: normal;
          font-weight: 800;
          font-size: 16px;
        }
      }
    }
  }
`;
const SubmitArea = styled.div`
  & .submitarea {
    background-color: #5988fe;

    /* height: 20%; */

    display: flex;
    flex-direction: column;

    & .textareaarea {
      /* height:80%; */
      display: grid;
      grid-template-columns: 10% 80% 10%;
      align-items: center;

      & .textarea {
        width: 100%;
        border: none;
        height: 100%;
        padding: 5px;
        box-sizing: border-box;
        /* border: solid 2px #1E90FF; */
        /* border-radius: 5px; */
        font-size: 16px;
        resize: both;
      }
    }

    & .submitbtnarea {
      display: flex;
      justify-content: center;
      height: 20%;
      align-items: center;

      & #toserver {
        border: none;
        // border-radius: 10px 10px;
        font-size: 10px;
        background: #306afe !important;
        color: #ffffff !important;
        width: 70px;
        height: 30px;
      }

      & #addfile {
        border: none;
        // border-radius: 10px 10px;
        font-size: 10px;
        background: #306afe !important;
        color: #ffffff !important;
        width: 70px;
        height: 30px;
      }
    }
  }
`;

export const QnABody = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [cookies, setCookie] = useCookies(["userid"]);

  
  let { onedayclass_num, id } = useParams();

  let [allmessage, setAllmessage] = useState([]);

  let [cntcheck, setCntcheck] = useState(false);
  let [mysocket, setMysocket] = useState(null);
  let [room_num, setRoom_num] = useState(null);

  var value;

  const messages = useRef();

  const [cPage, setCpage] = useState(0);

  const [preveCpage, setPreveCpage] = useState(-1);

  const [lastMonthRecord, setLastMonthRecord] = useState(undefined);
  const [nextMonthRecod, setNextMonthRecod] = useState(undefined);
  const [nextBackChoice, setNextBackChoice] = useState(null);

  const [pageBlock, setPageBlock] = useState(0);
  const calculFnc = (totalCnt) => {
    // 10개의 개시글을 가진 페이지가 몇개니
    let pageNunit = Math.ceil(totalCnt / 10);

    //console.log(`10개의 개시글을 가진 페이지가 몇개니:  ${pageNunit}`);
    setPageBlock(pageNunit);
  };

  const scrollTest = (e) => {
    const children = e.target.children;

    const chatarea = e.target; // 현재 스크롤이 발생한 요소
    const clientHeight = chatarea.clientHeight; // chatarea의 높이
    const scrollTop = chatarea.scrollTop; // chatarea의 스크롤 위치
    const scrollHeight = chatarea.scrollHeight; // chatarea의 전체 콘텐츠 높이

    // // 현재 스크롤 위치 + 창의 높이 (스크롤 끝 위치)
    let currentscroll = scrollTop + clientHeight;

    // console.log("chatarea 높이(clientHeight):", clientHeight);
    // console.log("현재 스크롤 위치(scrollTop):", scrollTop);
    // console.log("전체 콘텐츠 높이(scrollHeight):", scrollHeight);
    // console.log("현재 스크롤 끝 위치(currentscroll):", currentscroll);

    if (scrollTop === 0 && cPage < pageBlock) {
      setCpage((cPage + 1) * 10);
      setPreveCpage((cPage - 10) * 10);
    }

    if (clientHeight + scrollTop === scrollHeight) {
      if (cPage != 0) {
        setCpage((cPage - 10) * 10);
      }
    }
  };

  //내일 수정 현재 cPage와 setNextBackChoice 의 상태변화가 꼬임
  const MonthRecordList = (e) => {
    //setNextBackChoice
    const dataVarValue = e.target.dataset.var;

    // 원시 타입이라면 객체로 래핑하여 업데이트
    setNextBackChoice(dataVarValue);

    setCpage(1);
    setCpage(0);
    setPreveCpage(1);
    setPreveCpage(0);
    console.log(`cpage ${cPage}  dataVarValue:${dataVarValue} `);
  };

  useEffect(() => {
    //console.log(`현재페이지:  ${cPage}`);
    let socket = io(`http://${IP}` + ":5000/enterance");

    let lastMonth = undefined;

    // console.log(
    //   `월초기화시 cPage ${cPage}  그리고 이고 ${preveCpage}   그리고 이전 타겟  월  ${lastMonthRecord}   다음 타겟 월 ${nextMonthRecod} `
    // );

    if (cPage === 0 && preveCpage === 0 && lastMonthRecord != "") {
      lastMonth = lastMonthRecord;
      console.log(
        `월초기화시 cPage ${cPage}  그리고 타켓 월  ${lastMonth}   그리고 이고 ${preveCpage}`
      );
    }

    let nextMonth = undefined;
    if (cPage === 0 && preveCpage === 0 && nextMonthRecod != "") {
      nextMonth = nextMonthRecod;
      console.log(
        `월초기화시 cPage ${cPage}  그리고 타켓 월  ${lastMonth}   그리고 이고 ${preveCpage}`
      );
    }

    //채팅 내역을 담을 배열
    let newarr;
    //채팅 내역 배열의 요소 객체
    let newobj;
    if (nextBackChoice === "next") {
      lastMonth = undefined;
    } else {
      nextMonth = undefined;
    }

    socket.emit("enterancedata", {
      id: id,
      onedayclass_num: onedayclass_num,
      cPage: cPage,
      lastMonthRecord: lastMonth,
      nextMonthRecord: nextMonth,
    });

    socket.on("enterancedata", (data) => {
      setRoom_num(data.room_num);
      let totalCnt = data.totalCnt;
      calculFnc(totalCnt);

      setLastMonthRecord(data.lastMonthRecord);
      setNextMonthRecod(data.nextMonthRecord);

      newarr = new Array();

      data.excute.map((content) => {
        let dialogue_createdA = content.dialogue_createdAt.substr(
          0,
          content.dialogue_createdAt.indexOf("T")
        );
        //  console.log(content);
        newobj = new Object();

        let wirter = cookies.userid;

        if (content.writer == `${wirter}`) {
          newobj.writerMe = content.writer;
          newobj.contentMe = content.content;
          newobj.createdAt = content.dialogue_createdAt;
        } else {
          newobj.writerOther = content.writer;
          newobj.contentOther = content.content;
          newobj.createdAt = content.dialogue_createdAt;
        }
        newarr.push(newobj);
        newobj = null;
      });

      if (socket.connected) {
        setCntcheck(true);
        setMysocket(socket);
      }

      setAllmessage(newarr);
    });
  }, [cPage, nextBackChoice]);

  let [isbottom, setIsbottom] = useState("false");
  window.addEventListener("scroll", () => {
    let scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
    let windowHeight = window.innerHeight; // 스크린 창
    let fullHeight = document.body.scrollHeight; //  margin 값은 포함 x

    let currentscroll = parseInt(scrollLocation) + parseInt(windowHeight);

    // console.log("scrollLocation:   " + scrollLocation);
    if (currentscroll >= fullHeight) {
      setIsbottom("true");
    } else if (scrollLocation <= 560) {
      setIsbottom("false");
    }
  });

  useEffect(() => {
    console.log("유즈이펙트후: " + isbottom);

    if (isbottom == "true") {
      setStyle("true");
    }
    if (isbottom == "false") {
      setStyle("false");
    }
  }, [isbottom]);

  let [style, setStyle] = useState(null);
  useEffect(() => {
    //   console.log("style 유즈이펙트후: " + style);

    if (style == "true") {
      let gobottom = document.getElementById("gobottom");

      gobottom.classList.remove("actionadd");
      gobottom.classList.add("actionadd2");
    } else {
      let gobottom = document.getElementById("gobottom");

      gobottom.classList.add("actionadd");
      gobottom.classList.remove("actionadd2");
    }
  }, [style]);

  const TextChange = (e) => {
    value = document.getElementById("text").value;
  };

  //웹소켓으로 서버로 채팅내역을 보낸다.
  const ToServer = () => {
    // 학생이 들어왔다면 학생아이디가, 선생이 들어왔다면 선생의 아이디가.
    let writer = cookies.userid;

    mysocket.emit("chatstart", { value, writer, room_num });
    let newobj = new Object();
    newobj.writerMe = writer;
    newobj.contentMe = value;
    //  newobj.createdAt=content.dialogue_createdAt;
    let deep = [...allmessage];
    deep.push(newobj);
    setAllmessage(deep);
    document.getElementById("text").value = null;
  };

  //클라이언트 쪽의 웹소캣으로 서버가 주는 데이터를 듣고 상데방의 채팅내역을 받는다.
  if (mysocket != undefined && mysocket != null) {
    mysocket.on("chatstart", (res) => {
      let newobj = new Object();

      newobj.writerOther = res.writerOther;
      newobj.contentOther = res.contentOther;
      newobj.createdAt = res.createdAt;
      let deep = [...allmessage];

      deep.push(newobj);
      setAllmessage(deep);
    });
  }

  // useEffect(() => {
  //   console.log(allmessage);
  // }, [allmessage]);

  const ToJoinOnedayclass = () => {
    alert("선생님이 상담중입니다 잠시만 기다려주세용");
  };

  //밑 컴포넌트의 리턴부의 map에서 반복적으로 호출할 채팅내역을 담는 함수
  let Showlist = (e) => {
    let chatlist = new Array();
    for (let key of Object.keys(e)) {
      if (key == "writerMe") {
        if (e[key] == null) {
        } else {
          let today = new Date();
          chatlist.push(
            <div className="todaycut" data-val={e.createdAt}>
              <div className="me">
                <div className="messagearea">
                  <div className="messageheaderme">
                    <div className="messageheader">{e.writerMe}</div>
                  </div>

                  <div className="massagecontenme">
                    <div
                      className="massageconten"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {" "}
                      {e.contentMe}
                    </div>
                  </div>
                  <div className="timeme">
                    <div className="time">{e.createdAt}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      } else if (key == "writerOther") {
        if (e[key] == "" || e[key] == "") {
        } else {
          let today = new Date();
          chatlist.push(
            <div className="todaycut" data-val={e.createdAt}>
              <div className="other">
                <div className="messagearea">
                  <div className="messageheader">{e.writerOther}</div>
                  <div
                    className="massageconten"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {" "}
                    {e.contentOther}
                  </div>
                  <div className="time">{e.createdAt}</div>
                </div>
              </div>
            </div>
          );
        }
      }
    }
    return chatlist;
  };

  const scrollToBottom = () => {
    messages.current?.scrollIntoView({ behavior: "smooth" });
  };

  const Gobottom = () => {
    console.log(messages.current);
    messages.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <QuestionAllWrapper className="QuestionAllWrapper">
        <div className="header">선생님질문방</div>
        <div
          className="chatarea"
          style={{
            height: "860px",
          }}
        >
          <div
            className="chatinfo"
            onScroll={scrollTest}
            style={{
              height: "860px",
              overflowY: "scroll",
            }}
          >
            <div
              style={{
                height: "870px",
              }}
            >
              {lastMonthRecord != undefined && (
                <div className="lastMonthRecordWrapper">
                  <div
                    className="lastMonthRecord"
                    data-var="back"
                    onClick={(e) => MonthRecordList(e)}
                  >
                    이전 {lastMonthRecord}메시지보기
                  </div>
                </div>
              )}
              {allmessage.map((e, idx) => {
                return Showlist(e);
              })}

              {nextMonthRecod != undefined && (
                <div className="lastMonthRecordWrapper">
                  <div
                    className="lastMonthRecord"
                    data-var="next"
                    onClick={(e) => MonthRecordList(e)}
                  >
                    다음 {nextMonthRecod != undefined && nextMonthRecod}
                    메시지보기
                  </div>
                </div>
              )}

              <div ref={messages}></div>
            </div>
          </div>
        </div>

        <SubmitArea className="SubmitArea">
          {cntcheck ? (
            <>
              <div className="submitarea">
                <div className="textareaarea">
                  <div className="addfilearea submitbtnarea">
                    <button id="addfile">+</button>
                  </div>

                  <textarea
                    className="textarea"
                    id="text"
                    onChange={TextChange}
                  ></textarea>

                  <div className="submitbtnarea">
                    <button id="toserver" onClick={ToServer}>
                      전송
                    </button>
                  </div>
                </div>

                <input id="id" type="hidden" value={id}></input>
              </div>
            </>
          ) : (
            <>
              <button onClick={ToJoinOnedayclass}>연결지연중입니다.</button>
            </>
          )}
        </SubmitArea>

        <div className="gobottom" id="gobottom" onClick={Gobottom}>
          <div id="gobottombtn"></div>
        </div>
      </QuestionAllWrapper>
    </>
  );
};
