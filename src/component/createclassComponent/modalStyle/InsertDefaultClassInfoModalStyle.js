import styled, { css } from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const MessageAuthoarea = styled.div`
  & .modal {
    position: fixed;
    display: flex;
    /* flex-direction: column; */
    /* justify-content: center; */
    top: 0;
    /* left: 0; */
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

    @media (max-width: 609px) {
      justify-content: center;
    }
    @media (min-width: 610px) and (max-width: 900px) {
    }
  }

  .modalaction {
    display: flex !important;
  }

  .modal_body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 720px;
    width: 100%;

    & .cancleconfirmarea {
      display: flex;
      justify-content: space-around;
    }

    //메디아

    @media (min-width: 345px) and (max-width: 500px) {
      padding: 0 0;
      height: 500px; //모달의 세로크기
      width: 344px; //모달의 가로크기
    }

    @media (min-width: 501px) and (max-width: 609px) {
      padding: 0 0;
      height: 400px; //모달의 세로크기
      width: 400px; //모달의 가로크기
    }
    @media (min-width: 610px) and (max-width: 900px) {
      left: 50%;
      height: 600px; //모달의 세로크기
      width: 400px; //모달의 가로크기
    }
    & .getauthoareapwd {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      & .alertinfo {
        display: none;
      }

      .noactioninfo {
        display: block !important;
        color: red;
      }
      .yesactioninfo {
        display: block !important;
        color: green;
      }
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
    height: 200px;
    & textarea {
      width: 100%;
      height: 100%;
    }

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

export const InsertDefaultClassInfoModalStyle = ({
  수업정보상태,
  set수업정보상태,
  기본클래스정보모달열기,
  set기본클래스정보모달열기,
}) => {
  useEffect(() => {
    console.log(수업정보상태);
  }, [수업정보상태]);

  const inputhandlerDefault = (e) => {
    const name = e.target.name; // input의 name 속성
    const value = e.target.value; // input에 입력된 값

    console.log(`name : ${name}  value:  ${value}`);

    if (name == "ClassIntro" || name == "ClassLocation") {
      set수업정보상태((prevState) => ({
        ...prevState, // 이전 상태 유지
        [name]: value, // 해당 필드만 업데이트
      }));
    } else if (defaultValiCheck(name, value)) {
      // 상태 업데이트 시 불필요한 렌더링을 방지하기 위해 객체 구조를 유지하고, 해당 값만 수정
      set수업정보상태((prevState) => ({
        ...prevState, // 이전 상태 유지
        [name]: value, // 해당 필드만 업데이트
      }));
    }
  };

  const defaultValiCheck = (name, value) => {
    switch (name) {
      case "Park":
        if (value == "가능" || value == "불가능") {
          document
            .getElementById("noalertpark")
            .classList.remove("noactioninfo");
          document
            .getElementById("yesalertpark")
            .classList.add("yesactioninfo");
          return true;
        } else {
          document.getElementById("noalertpark").classList.add("noactioninfo");
          document
            .getElementById("yesalertpark")
            .classList.remove("yesactioninfo");
          return false;
        }

      case "PlayTime":
        let regex = /^[0-9]{1,4}(분)$/;
        console.log(regex.test(value));
        if (regex.test(value)) {
          document
            .getElementById("noalertplaytime")
            .classList.remove("noactioninfo");
          document
            .getElementById("yesalertplaytime")
            .classList.add("yesactioninfo");
          return true;
        } else {
          document
            .getElementById("noalertplaytime")
            .classList.add("noactioninfo");
          document
            .getElementById("yesalertplaytime")
            .classList.remove("yesactioninfo");
          return false;
        }

      case "Playinguser":
        let Playingregex = /^(최대)[0-9]{1,4}(명)$/;
        let Playinguser = value;
        console.log(Playingregex.test(Playinguser));
        //yesalertplayinguser
        if (Playingregex.test(Playinguser)) {
          document
            .getElementById("noalertplayinguser")
            .classList.remove("noactioninfo");
          document
            .getElementById("yesalertplayinguser")
            .classList.add("yesactioninfo");
          return true;
        } else {
          document
            .getElementById("noalertplayinguser")
            .classList.add("noactioninfo");
          document
            .getElementById("yesalertplayinguser")
            .classList.remove("yesactioninfo");
          return false;
        }
    }
  };

  return (
    <>
      <MessageAuthoarea>
        <div className="modal" id="modal">
          <div className="modal_body" id="modal_body">
            <h2>클래스 기본 정보 기입</h2>
            <div className="getauthoareaWrapper">
              <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                <span>지역:</span>
                <input
                  name="ClassLocation"
                  placeholder="해당 클래스 지역을 행정시 까지만 적어주세요 ex 군포시, 안양시"
                  id="classlocation"
                  onChange={inputhandlerDefault}
                  type="text"
                  value={수업정보상태?.ClassLocation}
                />
              </div>
              <div className="getauthoarea getauthoareapwd" id="parkarea">
                <span>주차:</span>
                <input
                  name="Park"
                  placeholder="주차가능 여부를 가능,불가능 으로만 적어주세요 ex 가능, 불가능"
                  id="park"
                  onChange={inputhandlerDefault}
                  value={수업정보상태?.Park}
                ></input>
              </div>
              <div className="getauthoareapwd">
                <span className="alertinfo" id="noalertpark">
                  가능 또는 불가능 으로만 적어주세요
                </span>
                <span className="alertinfo" id="yesalertpark">
                  옳바르게 작성하셨습니다.
                </span>
              </div>
              <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                <span>이용시간:</span>
                <input
                  name="PlayTime"
                  placeholder="이용시간을  xx분 으로 적어주세요 ex 45분"
                  id="playtime"
                  onChange={inputhandlerDefault}
                  type="text"
                  value={수업정보상태?.PlayTime}
                ></input>
              </div>
              <div className="getauthoareapwd">
                <span className="alertinfo" id="noalertplaytime">
                  xx분 으로만 작성해주세요 ex :1분, 60분
                </span>
                <span className="alertinfo" id="yesalertplaytime">
                  옳바르게 작성하셨습니다.
                </span>
              </div>
              <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                <span>이용인원:</span>
                <input
                  name="Playinguser"
                  placeholder="최대 이용인원수를 최대xx명 으로 적어주세요 ex 최대12명"
                  id="playinguser"
                  onChange={inputhandlerDefault}
                  type="text"
                  value={수업정보상태?.Playinguser}
                ></input>
              </div>
              <div className="getauthoareapwd">
                <span className="alertinfo" id="noalertplayinguser">
                  최대xx명 으로만 작성해주세요 ex :최대10명
                </span>
                <span className="alertinfo" id="yesalertplayinguser">
                  옳바르게 작성하셨습니다.
                </span>
              </div>
            </div>

            <div className="goauthoarea getauthoareapwd" id="newpwdarea">
              <h2> 클래스 소개 내용을 기입 </h2>
              <textarea
                name="ClassIntro"
                placeholder="클래스 내용을 간략히 소개해주세요"
                id="classintro"
                onChange={inputhandlerDefault}
                value={수업정보상태?.ClassIntro}
              ></textarea>
            </div>

            <div
              onClick={() => {
                set기본클래스정보모달열기(!기본클래스정보모달열기);
              }}
            >
              닫기
            </div>
          </div>
        </div>
      </MessageAuthoarea>
    </>
  );
};
