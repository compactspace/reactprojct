import styled, { css } from "styled-components";
import axios from "axios";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const MyInfoWrapper = styled.div`
  padding: 10px 10px;

  & .authowrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
    background: #f5f7fa;
    height: 58px;
    margin-top: 16px;
    padding: 12px 16px;
    & .inconarea {
      display: flex;
      font-size: 14px;
      font-weight: 600;
      color: #49627a;
    }

    & .authobtnarea {
      font-size: 14px;
      font-weight: 600;
      color: #49627a;

      & #authosuccess {
        color: #0068bd !important;
      }
    }
  }

  & .myinfowrapper {
    display: flex;
    flex-direction: column;
    gap: 50px;

    & .infowrapper {
      display: flex;

      @media (max-width: 410px) {
        flex-direction: column;
        width: 100%;
      }

      justify-content: space-between;

      & .infoarea {
        display: flex;
        flex-direction: column;

        @media (max-width: 410px) {
          width: 100%;
        }

        @media (min-width: 411px) {
          width: 50%;
        }

        & .infoheader {
          color: #707070;
          display: flex;
          line-height: 16px;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 600;

          & #duplicbtn {
            color: #4ab56a;
          }

          & #duplicarea {
            width: 80%;
            display: flex;
            justify-content: space-between;
          }
        }

        .dupliccheckaction {
          gap: 20px;
        }

        & .infocontent {
          max-width: 480px;
          display: flex;
          justify-content: space-between;
          background-color: #fafafa;
          border: 1.5px solid #fafafa;
          width: 80%;

          @media (max-width: 609px) {
            width: 100%;
          }

          & .read {
            padding: 10px 10px;
            display: flex;
            align-items: center;
            width: 100%;

            & input {
              background-color: #fafafa;
              display: inline-block;
              height: 40px;
              width: 100%;
              border: none;
            }
          }

          & .changeinput::-webkit-input-placeholder {
            color: #de4b50;
          }
        }
      }
    }
  }
`;
const ReadAndWriteWRapper = styled.div`
  & .cut {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #ebebeb;
  }

  & .change {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .actionchange {
    display: none;
  }

  & span {
    display: inline-block;
    width: 100%;
    height: 100%;
    font-family: "Noto Sans KR";
    font-weight: 400;
    font-size: 16px;
    color: #707070;
    text-align: center;
    line-height: 30px !important;
    padding: 0 16px;
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 10px;
    background-color: #fafafa;
    @media (max-width: 609px) {
      padding: 0 0;
    }
    @media (min-width: 610px) and (max-width: 900px) {
      padding: 0 16px;
    }
  }

  & .changemyinfomodal {
    display: flex;
  }

  & .changemyinfomodal {
    display: none;
  }

  .actionchangemyinfomodal {
    display: flex;
    justify-content: space-around;
  }
`;
// 문자인증
const MessageAuthoarea = styled.div`
  & .modal {
    position: fixed;
    display: flex;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);

    & #oldpwdyes {
      display: none;
    }

    .oldpwdyesaction {
      display: block !important;
      color: #00c73c;
    }

    & #oldpwdno {
      display: none;
    }

    .oldpwdnoaction {
      display: block !important;
      color: #de4b50;
    }
  }

  .modalaction {
    display: flex !important;
  }

  .modal_body {
    max-width: 600px;
    min-width: 600px;
    min-height: 300px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    & .cancleconfirmarea {
      display: flex;
      justify-content: space-around;
    }

    & .getauthoareapwd {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    & .getauthoareaWrapper {
      display: flex;
      flex-direction: column;

      & .getauthoarea {
        /* display: flex;
                        justify-content: center; */
        height: 50px;
        vertical-align: middle;
        width: 100%;
      }

      & input {
        display: inline-block;
        width: 80%;
        border: none;
        border-bottom: 1px solid;
      }

      & #getauthomeseeage {
        align-items: center;
        display: flex;
      }
    }

    & .getauthoarea {
      /* display: flex;
                        justify-content: center; */
      height: 50px;
      vertical-align: middle;
      width: 100%;
    }
    & input {
      display: inline-block;
      width: 80%;
      border: none;
      border-bottom: 1px solid;
      margin-bottom: 10px;
    }

    & .samemeseeage {
      display: inline-block;
      background-color: #e4e4e4;
      border-color: #e4e4e4;
      color: #999;
      width: 80%;
      height: 50px;
      & .samebtn {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }

    & #goauthoarea {
      margin-bottom: 20px;

      & #timeoutarea {
        display: block;
        color: #da1a32;
      }
    }

    position: fixed;
    top: 50%; //모달을 화면가운데 놓기위함.

    padding: 40px;

    text-align: center;

    background-color: rgb(255, 255, 255); //모달창 배경색 흰색
    border-radius: 10px; //테두리
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15); //테두리 그림자

    transform: translateY(-50%); //모듈창열었을때 위치설정 가운데로
  }

  .action_getauthoarea {
    display: none !important;
  }

  /* & .goauthoarea{
            display: none;

        } */

  .action_goauthoarea {
    display: block !important;
  }

  & #newpwdarea {
    display: flex;
    flex-direction: column;
    & input {
      display: inline-block;
    }

    & #noequal {
      display: none;
    }

    & #equal {
      display: none;
    }
  }

  .actionnoequal {
    display: inline-block !important;
  }

  .actionequal {
    display: inline-block !important;
  }
`;

export const MyInfoBodyComponent = () => {
  let [openmodal, setOpenmodal] = useState();
  let navi = useNavigate();
  const OpenModal = () => {
    if (!openmodal) {
      setOpenmodal(true);
    } else {
      setOpenmodal(false);
    }
  };

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let phoneregex;
  let phonNum;
  const PhoneNumChange = () => {
    phonNum = document.getElementById("phonNum").value;
    let result = /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
    phoneregex = result.test(phonNum);
  };

  let today = new Date();

  let hours = today.getHours(); // 시
  let minutes = today.getMinutes(); // 분
  let seconds = today.getSeconds(); // 초

  let milliseconds = today.getMilliseconds(); // 밀리초

  console.log(hours + ":" + minutes + ":" + seconds + ":" + milliseconds);

  var timeout;
  var time;
  var min;
  var sec;

  const [인증번호왔니, set인증번호왔니] = useState(false);
  const GetAuthoMeseeage = () => {
    if (phonNum == null || phonNum == undefined) {
      alert("먼저 핸드폰 번호를 입력해주세요");
      document.getElementById("phonNum").value = null;
      phonNum = null;
      return;
    }

    if (!phoneregex) {
      alert("핸드폰 형식에 맞지 않습니다 다시 입력해주세요");
      document.getElementById("phonNum").value = null;
      phonNum = null;
      return;
    }

    let data = { phonNum: phonNum };
    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/user/messageautho`, data, { headers })
      .then((res) => {
        document
          .getElementById("getauthoarea")
          .classList.add("action_getauthoarea");
        alert("핸드폰으로 받은 인증번호를 입력해주세용");
        set인증번호왔니(true);
        document
          .getElementById("goauthoarea")
          .classList.add("action_goauthoarea");

        time = 60;
        min = "";
        sec = "";

        timeout = setInterval(function () {
          min = parseInt(time / 60);
          sec = time % 60;

          console.log(min + "분 " + sec + "초"); //아웃
          time--;
          document.getElementById("timeoutarea").innerHTML = min + ":" + sec;
          if (time < 0) {
            clearInterval(timeout);
            alert("시간을 초과하였습니다.\n 인증번호를 재 요청 해주세요");
            time = 180;
            min = "";
            sec = "";
            document.getElementById("timeoutarea").innerHTML = "";
            axios
              .get(`http://${IP}:4000/user/messageauthotimeout`)
              .then((res) => {
                if (res.data.authostatuscode == -1) {
                  alert("시간이 지났습니다.\n 다시 인증번호를 요청해주세요");
                }
              });
          }
        }, 1000);
      })
      .catch((err) => {});
  };

  let authonumberregex;
  let authonumber;
  const AuthonumberNumChange = () => {
    authonumber = document.getElementById("authonumber").value;
    let result = /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
    authonumberregex = result.test(authonumber);
  };

  let [authocheck, setAuthocheck] = useState(false);

  let [내정보객체, set내정보객체] = useState(null);
  const GoAuthonumberNumChange = () => {
    // if (!authonumberregex || authonumber == null || authonumber == undefined) {
    //     alert("핸드폰 형식에 맞지 않습니다 다시 입력해주세요");
    //     document.getElementById("phonNum").value = null;
    //     phonNum = null;
    //     return;
    // }
    clearInterval(timeout);

    time = 180;
    min = "";
    sec = "";
    document.getElementById("timeoutarea").innerHTML = "";

    let data = { authonumber: authonumber };
    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/user/myinfoauthocheck`, data, { headers })
      .then((res) => {
        let { authostatuscode } = res.data;
        if (authostatuscode == 1) {
          alert(
            "인증되셨습니다.\n 개인정보 보호를 위해 \n 가려있던 개인정보가 노출됩니다."
          );
          axios.post(`http://${IP}:4000/user/showmyinfo`).then((res) => {
            //내일 여기서 부터 res.data.authostatuscode 1 -1 로 분기처리하라
            let { myinfo } = res.data;

            //   console.log(myinfo)
            set내정보객체(myinfo);
            setAuthocheck(true);
          });
        } else if (authostatuscode == -1) {
          alert("발송해드린 인증번호와.\n일치하지 않습니다. ");
          return;
        }
      })
      .catch((err) => {});
  };

  let changeobj = new Object();
  changeobj = { id: null, user_tell: null, user_name: null, email: null };

  const IdChange = () => {
    changeobj.id = document.getElementById("id").value;
    console.log("changeobj   idCheck:  ", changeobj, idCheck);

    //변경 아이디 확인해 두고 또 아이디 살작바꾸면 idCheck는 투루 이기 때문에 처리
    //이게다 이용자들이 상식밖의 행동을 해서 그럼
    if (idCheck) {
      idCheck = false;
    }

    //다지우면 찌거기 빈문자열남음
    if (changeobj.id == "") {
      changeobj.id = null;
    }
  };

  const TellChange = () => {
    changeobj.user_tell = document.getElementById("tell").value;
    //다지우면 찌거기 빈문자열남음
    if (changeobj.user_tell == "") {
      changeobj.user_tell = null;
    }
  };
  const NameChange = () => {
    changeobj.user_name = document.getElementById("name").value;
    //다지우면 찌거기 빈문자열남음
    if (changeobj.user_name == "") {
      changeobj.user_name = null;
    }
  };
  const EmailChange = () => {
    changeobj.email = document.getElementById("email").value;
    //다지우면 찌거기 빈문자열남음
    if (changeobj.email == "") {
      changeobj.email = null;
    }
  };

  let idCheck = false;
  const IdDuplicCheck = () => {
    if (changeobj.id == undefined || changeobj.id == null) {
      alert("변경하실 아이디를 먼저 입력해주세요");
      return;
    }
    let data = { id: changeobj.id };
    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/user/duplicid`, data, { headers })
      .then((res) => {
        if (res.data.dulicstatuscode == 1) {
          alert("변경 가능한 아이디 입니다.");
          idCheck = true;
        } else {
          alert("이미 사용중인 아이디 입니다.");
        }
      });
  };

  let [내정보변경버튼, set내정보변경버튼] = useState(false);
  const OpenChangeMyInfoModal = () => {
    if (!authocheck) {
      alert("정보 보호를 위해 문자인증이 먼저 필요합니다.");
      return;
    }
    document.getElementById("change").classList.add("actionchange");
    document
      .getElementById("changemyinfomodal")
      .classList.add("actionchangemyinfomodal");
    set내정보변경버튼(true);
  };

  const CloseChangeMyInfoModal = () => {
    document.getElementById("change").classList.remove("actionchange");
    document
      .getElementById("changemyinfomodal")
      .classList.remove("actionchangemyinfomodal");
    set내정보변경버튼(false);
  };

  const ChangeMyInfo = () => {
    let nullprevent = 0;
    let 정보갯수 = 0;
    for (let key in changeobj) {
      정보갯수++;
      if (changeobj[key] == null || undefined) {
        nullprevent++;
      }
    }

    if (정보갯수 == nullprevent) {
      alert("변경할 사항이 없습니다.");
      nullprevent = 0;
      정보갯수 = 0;
      return;
    }

    // changeobj = { "id": null, "user_tell": null, "user_name": null, "email": null }

    if (!authocheck) {
      alert("정보 보호를 위해 문자인증이 먼저 필요합니다.");
      return;
    }
    let data = changeobj;

    if ((changeobj.id != undefined || changeobj.id != null) && !idCheck) {
      alert(
        "아이디변경 까지는 중복확인이 필요합니다.\n 중복확인 초록색버튼을 눌러주세요"
      );
      return;
    }

    let headers = { "content-type": "application/json" };

    console.log(changeobj);
    axios
      .post(`http://${IP}:4000/user/changemyinfo`, data, { headers })
      .then((res) => {
        if (res.data.updatestatuscode == 1) {
          alert("개인정보 변경 되었습니다.");
          setAuthocheck(true);
          set내정보객체(res.data.myinfo);
        } else {
          alert("잠시후 다시 시도해주세요");
        }
      });
  };

  //주의 할것은 이건 스테이트 이기 때문에 만약 개인정보를 인풋창에 입력하고
  // 비밀번호 변경 스테이트 변경시 인풋창에는 입력된 것처럼 보이나  기존 자바스크립트 값들은 언디파인으로 재 초기화 됨을 주의하자...
  //따라서 적절히 아래 코드를 추가할것이다.
  let [changepwdmodal, setChangepwdmodal] = useState(false);
  const ChangePassWordModal = () => {
    if (!authocheck) {
      alert("정보 보호를 위해 문자인증이 먼저 필요합니다.");
      return;
    }

    console.log(changeobj);

    // 뭔가 꼬여서 잠시 주석처리
    // document.getElementById('id').value = null;
    // document.getElementById('tell').value = null;
    // document.getElementById('name').value = null;
    // document.getElementById('email').value = null;

    setChangepwdmodal(true);
  };

  let oldpwd;
  const PassWordChange = () => {
    oldpwd = document.getElementById("oldpwd").value;
  };

  let [oldpwdcheck, setOldpwdcheck] = useState(false);
  const OldPassWordCheck = () => {
    if (oldpwd == undefined || oldpwd == null) {
      alert("먼저 기존 사용 비밀번호를 입력해주세요");

      return;
    }

    let data = { password: oldpwd };
    let headers = {
      "content-type": "application/json",
    };

    axios
      .post(`http://${IP}:4000/user/oldpwdcheck`, data, { headers })
      .then((res) => {
        if (res.data.statuscode == 1) {
          alert("기존 비밀번호 확인");
          setOldpwdcheck(true);
          document.getElementById("oldpwdyes").classList.add("oldpwdyesaction");
          document
            .getElementById("oldpwdno")
            .classList.remove("oldpwdnoaction");
        } else if (res.data.statuscode == 0) {
          alert("기존 비밀번호 를 다시 확인해주세요");
          document
            .getElementById("oldpwdyes")
            .classList.remove("oldpwdyesaction");
          document.getElementById("oldpwdno").classList.add("oldpwdnoaction");
        }
      })
      .catch((err) => {});
  };

  let newpwd1;
  const NewPwd1 = () => {
    if (!oldpwdcheck) {
      alert("기존비번을 먼저 확인해주세요");
      return;
    }

    newpwd1 = document.getElementById("newpwd1").value;
  };

  const Cleaer = () => {
    console.log("클리어 클릭 newpwd2 :  ", newpwd2);
    if (newpwd2 != undefined || newpwd2 != null) {
      document.getElementById("newpwd1").value = null;
      document.getElementById("newpwd2").value = null;
    }
  };

  let newpwd2;
  let newpwdcheck = false;
  const NewPwd2 = () => {
    if (!oldpwdcheck) {
      alert("기존비번을 먼저 확인해주세요");
      return;
    }

    newpwd2 = document.getElementById("newpwd2").value;

    console.log("newpwd1,newpwd2, ", newpwd1, newpwd2);

    if (newpwd1 == newpwd2) {
      document.getElementById("noequal").classList.remove("actionnoequal");
      document.getElementById("equal").classList.add("actionequal");
      newpwdcheck = true;
    } else {
      document.getElementById("noequal").classList.add("actionnoequal");
      document.getElementById("equal").classList.remove("actionequal");
      newpwdcheck = false;
    }
  };

  const GoNewPWDChange = () => {
    console.log("newpwdcheck newpwd2, ", newpwdcheck, newpwd2);
    if (newpwdcheck && newpwd2 != undefined) {
      let data = { password: newpwd2 };
      let headers = {
        "content-type": "application/json",
      };

      axios
        .post(`http://${IP}:4000/user/changenewpwd`, data, { headers })
        .then((res) => {
          if (res.data.PwdChangeStatusCode == 1) {
            alert("비밀번호 변경에 성공하였습니다. \n 로그인창으로 이동합니다");
            navi("/login");
          }
        })
        .catch((err) => {});
    } else {
      alert("새롭게 변경할 비밀번호를 작성해주세요");
    }
  };

  return (
    <>
      <div className="RightAllwrapper">
        <div className="Rightwrapper">
          <div className="pagetitle" id="pagetitle"></div>
          <div className="pagecontent">
            <div className="pageheader">나의정보확인 및 변경</div>
            <MyInfoWrapper>
              <div className="authowrapper">
                <div className="inconarea">
                  <div className="img"></div>
                  <div>개인정보 확인 및 변경을위해 먼저 인증을 해주세요</div>
                </div>
                <div className="authobtnarea">
                  {authocheck ? (
                    <>
                      <div className="authobtn" id="authosuccess">
                        인증성공
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="authobtn"
                        id="authobtn"
                        onClick={OpenModal}
                      >
                        인증하기
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="myinfowrapper">
                <div className="infowrapper">
                  <div className="infoarea">
                    <div className="infoheader">
                      <span>성함</span>
                    </div>
                    <div className="infocontent">
                      <div className="read writie">
                        {내정보객체 == null ? (
                          <>
                            <input
                              placeholder="개인정보보호를 위해 먼저 인증을해주세요"
                              readOnly
                            ></input>
                          </>
                        ) : (
                          <>
                            {내정보변경버튼 ? (
                              <>
                                <input
                                  className="changeinput"
                                  placeholder={`새롭게 변경하실 성함을 입력해주세요`}
                                  id="name"
                                  onChange={NameChange}
                                ></input>
                              </>
                            ) : (
                              <>
                                <input
                                  placeholder={`현재성함: ${내정보객체.user_name}`}
                                  id="name"
                                ></input>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="infoarea">
                    <div className="infoheader">
                      <span>닉네임</span>
                    </div>
                    <div className="infocontent">
                      <div className="read writie">
                        {내정보객체 == null ? (
                          <>
                            <input
                              placeholder="개인정보보호를 위해 먼저 인증을해주세요"
                              readOnly
                            ></input>
                          </>
                        ) : (
                          <>
                            {내정보변경버튼 ? (
                              <>
                                {/* 닉네임은 db에 컬럼이 없으니 나중 만들고 클릭함수등 추가 */}
                                <input
                                  className="changeinput"
                                  placeholder={`새롭게 변경하실 닉네임을 입력해주세요`}
                                ></input>
                              </>
                            ) : (
                              <>
                                <input placeholder={`미기입`}></input>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="infowrapper">
                  <div className="infoarea">
                    <div className="infoheader">
                      <span>핸드폰번호</span>
                    </div>
                    <div className="infocontent">
                      <div className="read writie">
                        {내정보객체 == null ? (
                          <>
                            <input
                              placeholder="개인정보보호를 위해 먼저 인증을해주세요"
                              readOnly
                            ></input>
                          </>
                        ) : (
                          <>
                            {내정보변경버튼 ? (
                              <>
                                <input
                                  className="changeinput"
                                  placeholder={`새롭게 변경하실 핸드폰을 입력해주세요`}
                                  id="tell"
                                  onChange={TellChange}
                                ></input>
                              </>
                            ) : (
                              <>
                                <input
                                  placeholder={`현재번호: ${내정보객체.user_tell}`}
                                ></input>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="infoarea">
                    <div className="infoheader">
                      <span>이메일</span>
                    </div>
                    <div className="infocontent">
                      <div className="read writie">
                        {내정보객체 == null ? (
                          <>
                            <input
                              placeholder="개인정보보호를 위해 먼저 인증을해주세요"
                              readOnly
                            ></input>
                          </>
                        ) : (
                          <>
                            {내정보변경버튼 ? (
                              <>
                                <input
                                  className="changeinput"
                                  placeholder={`새롭게 변경하실 이메일을 입력해주세요`}
                                  id="email"
                                  onChange={EmailChange}
                                ></input>
                              </>
                            ) : (
                              <>
                                <input
                                  placeholder={`현재이메일: ${내정보객체.email}`}
                                ></input>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="infowrapper">
                  <div className="infoarea">
                    <div className="infoheader" id="dupliccheck">
                      {내정보객체 == null ? (
                        <>
                          <span>사용중인아이디</span>
                        </>
                      ) : (
                        <>
                          <div id="duplicarea">
                            <span>사용중인아이디</span>{" "}
                            <span id="duplicbtn" onClick={IdDuplicCheck}>
                              아이디중복확인
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="infocontent">
                      <div className="read writie">
                        {내정보객체 == null ? (
                          <>
                            <input
                              placeholder="개인정보보호를 위해 먼저 인증을해주세요"
                              readOnly
                            ></input>
                          </>
                        ) : (
                          <>
                            {내정보변경버튼 ? (
                              <>
                                <input
                                  className="changeinput"
                                  placeholder={`새롭게 변경하실 아이디를 입력해주세요`}
                                  id="id"
                                  onChange={IdChange}
                                ></input>
                              </>
                            ) : (
                              <>
                                <input
                                  placeholder={`현재ID: ${내정보객체.id}`}
                                ></input>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="infoarea">
                    <div className="infoheader">
                      <span>가입일</span>
                    </div>
                    <div className="infocontent">
                      <div className="read writie">
                        {내정보객체 == null ? (
                          <>
                            <input
                              placeholder="개인정보보호를 위해 먼저 인증을해주세요"
                              readOnly
                            ></input>
                          </>
                        ) : (
                          <>
                            <input
                              placeholder={`가입일: ${내정보객체.create_signup}`}
                            ></input>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pageheader">개인정보 수정 및 비밀번호 변경</div>

              <ReadAndWriteWRapper>
                <div className="cut"></div>
                <div className="change" id="change">
                  <div className="changemyinfo ">
                    <div onClick={OpenChangeMyInfoModal}>
                      <span>개인정보수정</span>
                    </div>
                  </div>
                  <div className="changemypassword ">
                    <div onClick={ChangePassWordModal}>
                      <span>비밀번호변경</span>
                    </div>
                  </div>
                </div>

                <div className="changemyinfomodal" id="changemyinfomodal">
                  <div className="changemyinfo ">
                    <div onClick={CloseChangeMyInfoModal}>
                      <span>취소</span>
                    </div>
                  </div>
                  <div className="changemypassword ">
                    <div onClick={ChangeMyInfo}>
                      <span>개인정보변경</span>
                    </div>
                  </div>
                </div>
              </ReadAndWriteWRapper>
            </MyInfoWrapper>
          </div>
        </div>
      </div>

      {openmodal ? (
        <>
          <MessageAuthoarea>
            <div className="modal" id="modal">
              <div className="modal_body" id="modal_body">
                <h2>인증번호 요청하기</h2>
                <div className="getauthoarea" id="getauthoarea">
                  {/*  쫌있다 와서 여기서 id 값 과 체인지 클릭 에 비밀번호 확인 컨트롤러 만들어주자. */}
                  <input
                    placeholder="핸드폰번호를 입력해주세요"
                    id="phonNum"
                    onChange={PhoneNumChange}
                  />
                  <div
                    className="samemeseeage"
                    id="getauthomeseeage"
                    onClick={GetAuthoMeseeage}
                  >
                    <div className="samebtn">
                      {" "}
                      {인증번호왔니 ? "인증번호 재요청" : "인증번호 요청"}{" "}
                    </div>
                  </div>
                </div>
                {인증번호왔니 && (
                  <div className="goauthoarea getauthoarea" id="goauthoarea">
                    <input
                      placeholder="받으신 인증번호를입력해주세요"
                      id="authonumber"
                      onChange={AuthonumberNumChange}
                    />
                    <span id="timeoutarea"></span>
                    <div
                      className="samemeseeage"
                      id="getauthomeseeage"
                      onClick={GoAuthonumberNumChange}
                    >
                      <div className="samebtn">인증</div>
                    </div>
                  </div>
                )}

                <div className="cancleconfirmarea">
                  <div
                    onClick={() => {
                      clearInterval(timeout);
                      setOpenmodal(false);
                      axios
                        .get(`http://${IP}:4000/user/messageauthotimeout`)
                        .then((res) => {
                          if (res.data.authostatuscode == -1) {
                            alert("취소하셨습니다.");
                          }
                        });
                    }}
                  >
                    취소
                  </div>
                  <div
                    onClick={() => {
                      clearInterval(timeout);
                      setOpenmodal(false);
                    }}
                  >
                    확인
                  </div>
                </div>
              </div>
            </div>
          </MessageAuthoarea>
        </>
      ) : (
        <></>
      )}

      {changepwdmodal ? (
        <>
          <MessageAuthoarea>
            <div className="modal" id="modal">
              <div className="modal_body" id="modal_body">
                <h2>비밀번호변경</h2>
                <div className="getauthoareaWrapper">
                  <h2>사용중인 비밀번호 확인</h2>
                  <div
                    className="getauthoarea getauthoareapwd"
                    id="getauthoarea"
                  >
                    <input
                      placeholder="기존비밀번호를 입력해주세요"
                      id="oldpwd"
                      onChange={PassWordChange}
                      type="password"
                    ></input>
                    <div id="getauthomeseeage" onClick={OldPassWordCheck}>
                      확인
                    </div>
                  </div>
                  <div id="oldpwdyes">사용하시던 비밀번호 확인</div>
                  <div id="oldpwdno">사용하시던 비밀번호 불일치</div>
                </div>

                <div className="goauthoarea getauthoareapwd" id="newpwdarea">
                  <h2>새롭게 사용하실 비밀번호</h2>
                  <input
                    placeholder="새롭게사용하실 비밀번호를입력해주세요"
                    id="newpwd1"
                    onClick={Cleaer}
                    onChange={NewPwd1}
                    type="password"
                  ></input>

                  <input
                    placeholder="다시한번 입력해주세요"
                    id="newpwd2"
                    onChange={NewPwd2}
                    type="password"
                  ></input>
                  <span id="noequal">비밀번호가 일치하지 않습니다.</span>
                  <span id="equal">비밀번호가 일치</span>
                  <div id="getauthomeseeage" onClick={GoNewPWDChange}>
                    변경하기
                  </div>
                </div>
                <div
                  onClick={() => {
                    setChangepwdmodal(false);
                  }}
                >
                  확인
                </div>
              </div>
            </div>
          </MessageAuthoarea>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
