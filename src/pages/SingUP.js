import styled, { css } from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AllWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
`;

const SingUPAllwrapper = styled.div`
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: 486px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;

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

      & #noregex {
        display: none;
      }

      & #yesregex {
        display: none;
      }

      .yesaction {
        text-align: center;
        display: inline-block !important;
        width: auto;
        border-radius: 4px;
        background-color: #03c75a;
        color: #fff;
      }

      .noaction {
        text-align: center;
        display: inline-block !important;
        width: auto;
        border-radius: 4px;
        background-color: #f4361e;
        color: #fff;
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

    & .cutline .singup {
      display: flex;
      justify-content: space-between;
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

export const PSingUP = () => {
  let navi = useNavigate();

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let tell;
  let regex;

  const TellChange = () => {
    tell = document.getElementById("tell").value;
    let result = /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
    regex = result.test(tell);

    //  console.log("형식:  "+ result.test(tell));

    if (result.test(tell)) {
      document.getElementById("yesregex").classList.add("yesaction");

      document.getElementById("noregex").classList.remove("noaction");
    } else {
      document.getElementById("noregex").classList.add("noaction");
      document.getElementById("yesregex").classList.remove("yesaction");
    }
  };

  let [인증번호받음, 셋인증번호] = useState();
  const GetauthoMessage = () => {
    document.getElementById("tell").value = null;

    console.log("인증번호 요청전 regex:  " + regex);

    if (regex) {
      let data = { phonNum: tell };
      let headers = { "content-type": "application/json" };

      axios
        .post(`http://${IP}:4000/user/messageautho`, data, { headers })
        .then((res) => {
          셋인증번호("받음");
          alert("발송해드린 인증번호를 보내주세요");
        })
        .catch((err) => {
          alert("에러");
        });
    } else {
      alert("핸드폰 번호를 입력해주세요");
    }
  };

  let authonum;
  const AuthNumChange = () => {
    authonum = document.getElementById("authonum").value;
    console.log("authonum:    " + authonum);
  };

  const GoAuthoCheck = () => {
    //authocheck
    console.log("클릭후 authonum: ", authonum);
    if (authonum == undefined) {
      alert("받은 인증번호를 입력해주세요");
      return;
    }

    let data = { authonumber: authonum };
    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/user/authocheck`, data, { headers })
      .then((res) => {
        let { authostatuscode } = res.data;

        if (authostatuscode == 1) {
          alert("인증에 완료하셧습니다 회원가입창으로 이동합니다.");
          navi("/memberjoin");
        } else {
          alert("발송해드린 인증번호를 다시 보내주세요");
        }
      })
      .catch((err) => {});
  };

  return (
    <>
      <AllWrapper>
        <SingUPAllwrapper className="PhoneLoginBodyAllwrapper">
          <div className="headerarea">
            {인증번호받음 == "받음" ? (
              <>
                <p>간편 문자인증</p>
              </>
            ) : (
              <>
                <p>인증번호 보내기</p>
              </>
            )}
          </div>

          <div className="formloginarea">
            {인증번호받음 == "받음" ? (
              <>
                <div className="inputarea">
                  <div className="idarea sign">
                    <span>인증번호입력</span>
                    <input
                      type="text"
                      id="authonum"
                      onChange={AuthNumChange}
                      placeholder="문자로 받으신 인증번호를 입력해주세요"
                    ></input>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="inputarea">
                  <div className="idarea sign">
                    <span>전화번호</span>
                    <input
                      type="text"
                      id="tell"
                      onChange={TellChange}
                      placeholder="핸드폰 번호를 입력해주세요"
                    ></input>
                    <span id="noregex">잘못된형식입니다.</span>
                    <span id="yesregex">옳바른형식입니다.</span>
                  </div>
                </div>

                {/* <div className="inputarea">
                                <div className="pwarea sign">
                                    <span>생년월일</span>
                                    <input type="password" id="birth" ></input>
                                </div>
                            </div> */}
                <div className="cutline">
                  <p>인증번호 요청</p>
                </div>
              </>
            )}

            {인증번호받음 == "받음" ? (
              <>
                <div className="inputarea" id="goauthocheck">
                  <div className="pwarea sign">
                    <span>요청</span>
                    <button
                      id="submit"
                      className="naverlogo"
                      onClick={GoAuthoCheck}
                    >
                      인증하기
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="inputarea" id="naverlogin">
                  <div className="pwarea sign">
                    <span>요청</span>
                    <button
                      id="submit"
                      className="naverlogo"
                      onClick={GetauthoMessage}
                    >
                      인증번호요청
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SingUPAllwrapper>
      </AllWrapper>
    </>
  );
};
