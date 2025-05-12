import { io } from "socket.io-client";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useParams } from "react-router-dom";
import { ExistCookie } from "../component/ExistCookie/ExistCookie";
import { useCookies } from "react-cookie";
const QuestionAllWrapper = styled.div`
  margin: 0 auto;
  max-width: 344px;
  /* max-height: 990px;  */
  /* height: 890px; */

  display: flex;
  flex-direction: column;

  /* & #gobottom{
    width: 100px;
    height: 100px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("/icon/downIcon.png");
  } */

  .actionadd {
    display: block;
    position: fixed;

    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;

    bottom: 50px;
    right: 20px;

    width: 50px;
    height: 50px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-image: url("/icon/downIcon.png");
  }

  .actionadd2 {
    display: none;
  }

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
    overflow: auto;
    height: 650px;
    background: #e9f1fe;
    /* background-color: red; */

    & .chatinfo {
      /* height: 100%; */
      padding: 20px 20px;
      /* background-color: black; */

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
    }

    & .other {
      display: flex;
      justify-content: start;

      & .massageconten {
        background: #306afe !important;
        color: #ffffff !important;
      }
    }

    & .time {
      font-size: 10px;
    }

    & .messageheader {
      font-size: 13px;
    }

    & .messagearea {
      display: flex;
      flex-direction: column;

      & .massageconten {
        margin-bottom: 5px;
        /* max-width: 100px; */

        border-radius: 7px;
        padding: 10px 20px;
        font-style: normal;
        font-weight: 800;
        font-size: 13px;
      }
    }
  }

  & .chatarea::-webkit-scrollbar {
    width: 10px;
  }
  & .chatarea::-webkit-scrollbar-thumb {
    background-color: #2f3542;
    border-radius: 10px;
  }

  & .chatarea::-webkit-scrollbar-track {
    background-color: grey;
    border-radius: 10px;
    box-shadow: inset 0px 0px 5px white;
  }

  /* .action{
    z-index: 10000;
    position: fixed;
    bottom: 0px;
    background-color:red;
    width: 100px;
    height: 100px;

 } */
`;

const SubmitArea = styled.div`
  & .submitarea {
    background-color: #5988fe;
    /* height: 20%; */
    position: fixed;
    bottom: 0px;

    /* position: absolute;
    top:0px */

    display: flex;
    flex-direction: column;
    width: 344px;

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
      justify-content: end;
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

export const PhoneQnABody = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [cookies, setCookie] = useCookies(["userid"]);

  let { onedayclass_num, id } = useParams();

  let testid = window.localStorage.getItem("id") || id;

  let [myvalue, setMyValue] = useState(null);
  let [othervalue, setOthervalue] = useState(null);

  let [allmessage, setAllmessage] = useState([]);

  let [cntcheck, setCntcheck] = useState(false);
  let [mysocket, setMysocket] = useState(null);
  let [room_num, setRoom_num] = useState(null);
  // let [chatlist, setchatlist] = useState(new Array());
  const endOfMessagesRef = useRef(null);

  // let [mychatlist, setmychatlist] = useState(new Array());
  let [isbottom, setIsbottom] = useState("false");

  let navi = useNavigate();

  var value;

  useEffect(() => {
    let socket = io(`http://${IP}` + ":5000/enterance");
    let newarr;
    let newobj;
    socket.emit("enterancedata", { id: id, onedayclass_num: onedayclass_num });
    socket.on("enterancedata", (data) => {
      setRoom_num(data.room_num);
      newarr = new Array();

      data.excute.map((content) => {
        newobj = new Object();
        let dialogue_createdA = content.dialogue_createdAt.substr(
          0,
          content.dialogue_createdAt.indexOf("T")
        );
        if (content.writer == `${id}`) {
          newobj.writerMe = content.writer;
          newobj.contentMe = content.content;
          newobj.createdAt = dialogue_createdA;
        } else {
          newobj.writerOther = content.writer;
          newobj.contentOther = content.content;
          newobj.createdAt = dialogue_createdA;
        }
        newarr.push(newobj);
        newobj = null;
      });

      if (socket.connected) {
        setCntcheck(true);
        setMysocket(socket);
      }
      // setAllmessage(newarr);
     
      setAllmessage(newarr);
    });
  }, []);

  var 최하단스크롤;

  if (document.getElementById("chatarea") != null || undefined) {
    let 채팅영역 = document.getElementById("chatarea");

    document.getElementById("chatarea").addEventListener("scroll", () => {
      let scrollLocation = 채팅영역.scrollTop; // 현재 스크롤바 위치
      let windowHeight = 채팅영역.innerHeight; // 스크린 창
      let fullHeight = 채팅영역.scrollHeight; //  margin 값은 포함 x

      let currentscroll = parseInt(scrollLocation) + parseInt(windowHeight);

      if (scrollLocation >= 750) {
        setIsbottom("true");
      } else if (scrollLocation <= 600) {
        setIsbottom("false");
      }
    });
  }

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

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const Gobottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const TextChange = () => {
    value = document.getElementById("text").value;
  };

  //웹소켓으로 서버로 채팅내역을 보낸다.
  const ToServer = () => {
    // 학생이 들어왔다면 학생아이디가, 선생이 들어왔다면 선생의 아이디가.
    let writer = cookies.userid;
    mysocket.emit("chatstart", { value, writer, room_num });

    let newobj = new Object();
    newobj.writerMe = id;
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

  const ToJoinOnedayclass = () => {
    alert("선생님이 상담중입니다 잠시만 기다려주세용");
  };

  //밑 컴포넌트의 리턴부의 map에서 반복적으로 호출할 채팅내역을 담는 함수
  let Showlist = (e) => {
    let chatlist = new Array();

    // console.log((e.me!=undefined)+ " "+(e.other!=''))

    for (let key of Object.keys(e)) {
      //   console.log("key:  "+key)

      if (key == "writerMe") {
        if (e[key] == null) {
        } else {
          let today = new Date();
          chatlist.push(
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
          );
        }
      } else if (key == "writerOther") {
        if (e[key] == "" || e[key] == "") {
        } else {
          let today = new Date();
          chatlist.push(
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
          );
        }
      }
    }
    return chatlist;
  };

  return (
    <>
      <QuestionAllWrapper className="QuestionAllWrapper">
        <div className="header">문의방</div>
        <div className="chatarea" id="chatarea">
          <div className="chatinfo">
            {allmessage.map((e, idx) => {
              return Showlist(e);
            })}
          </div>
          <SubmitArea className="SubmitArea" ref={endOfMessagesRef}>
            {cntcheck ? (
              <>
                <div className="submitarea">
                  {/* <input id='text' onChange={TextChange}></input> */}

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
        </div>

        <div className="gobottom" id="gobottom" onClick={Gobottom}>
          <div id="gobottombtn"></div>
        </div>
      </QuestionAllWrapper>
    </>
  );
};
