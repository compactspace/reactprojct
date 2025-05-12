import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CreateClassComponent } from "../component/createclassComponent/CreateClassComponent";
import { InsertCreateClass } from "../component/createclassComponent/insertCreateClass/InsertCreateClass";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";

import { PhonAurho } from "../component/createclassComponent/phonAurho/PhonAurho";

import axios from "axios";
import { BusinessAutho } from "../component/createclassComponent/businessAutho/BusinessAutho";
import {
  set핸드폰인증,
  set사업자등록번호인증,
} from "../store/createClassSlice/createClassSlice";
export const AllWrapper = styled.div`
  position: relative;
  top: 100px;

  margin: 0 auto;
  max-width: 720px;
  display: flex;
  flex-direction: column;

  gap: 20px;

  & .stepheaderarea {
    display: flex;
    justify-content: space-between;

    .headeraction {
      height: 100%;
      color: #ff5862;
      font-size: 18px;
      font-weight: bold;
      box-shadow: 0px 3px 0px 0 #ff5862;
    }
  }

  & .stepbodywrapper {
    max-height: 572px;
    min-height: 572px;
  }

  & .stepbodyarea {
    display: flex;
    flex-direction: column;

    & .alert {
      font-size: 20px;
      font-weight: bold;
      padding: 0 0 5px 0;
    }

    & .alerttext {
      font-size: 13px;
    }

    & .teacherauthoarea {
      display: flex;
      flex-direction: column;
      gap: 20px;
      text-align: center;
      background: #f3f5f7;
      padding: 50px 0;
      height: 400px;

      & img {
        height: 200px;
      }

      & .getauthobtn {
        border: 1px solid #ff5862;
        background-color: #ff5862;
        color: #fff;
        padding: 10px 10px;
        width: 30%;
        margin: 10px auto;
      }
      .getauthobtnaction {
        display: none;
      }

      & #goauthoarea {
        display: none;
      }
    }
    .goauthoareaaction {
      display: block !important;
    }
  }
`;

export const CreateClassPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    document.getElementById("header1").classList.add("headeraction");
  }, []);
  // 리덕스에서 상태 가져오기
  let 핸드폰인증여부 = useSelector((state) => {
    return state.PhoneAutho;
  });

  let 사업자번호인증여부 = useSelector((state) => {
    return state.BusinessnumberAutho;
  });

  let 공공데이터서비스키 =
    "GhRJv8ycxRRBetiPJrJJn0wvxKyRWvfo%2B2%2FLp7Ei65PuIROQI7IcZ48p%2F71i%2FpNLUzaRgv9nVNsqXRNNIW4I6w%3D%3D";

  let naiv = useNavigate();
  let [cookie, setCookie] = useCookies(["userid"]);
  let [사업자등록번호, set사업자등록번호] = useState(undefined);
  let IP;

  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const 인증번호받기 = () => {
    axios
      .post(`http://${IP}:4000/teacher/messageautho`)
      .then((res) => {
        if (res.data.statuscode == -1) {
          alert(
            "회원가입시  \n 핸드폰번호를 기입하지 않으셨습니다. \n 개인정보 수정란에서 \n 핸드폰번호를 입력해주세요"
          );
          naiv("/generallogin");
          return;
        }

        if (res.data.statuscode == 0) {
          alert("먼저 로그인을 필요로 합니다. \n 로그인창으로 이동합니다.");
          naiv("/generallogin");
          return;
        }

        alert("발송해드린 인증번호로 \n 인증을 진행해주세요");
        document
          .getElementById("getauthobtn")
          .classList.add("getauthobtnaction");
        document
          .getElementById("goauthoarea")
          .classList.add("goauthoareaaction");
      })
      .catch((err) => {});
  };

  let authonumber;
  const 인증번호입력 = () => {
    if (authonumber == "" || authonumber == " ") {
      document.getElementById("authonumber").value = null;
      return;
    }
    authonumber = document.getElementById("authonumber").value;
  };

  const goManageMentPage = () => {
    dispatch(set핸드폰인증(false));
    dispatch(set사업자등록번호인증(false));
  };

  useEffect(() => {
    console.log(핸드폰인증여부);
    console.log(사업자번호인증여부);
    console.log(
      `사업자번호인증여부: ${사업자번호인증여부.사업자등록번호인증}  핸드폰인증여부: ${핸드폰인증여부.핸드폰인증}`
    );
  });

  return (
    <>
      <AllWrapper>
        <div className="stepheaderwrapper">
          <div className="stepheaderarea">
            <div className="header" id="header1">
              01.본인인증
            </div>
            <div className="header" id="header2">
              02.사업자인증
            </div>
            <div className="header" id="header3">
              03.관리자의 승인 대기
            </div>
          </div>
        </div>
        <div className="stepbodywrapper">
          {/* 본인 핸드폰 인증 */}
          {!사업자번호인증여부.사업자등록번호인증 &&
            !핸드폰인증여부.핸드폰인증 && <PhonAurho></PhonAurho>}

          {/* 사업자등록번호 인증 */}
          {핸드폰인증여부.핸드폰인증 &&
            !사업자번호인증여부.사업자등록번호인증 && (
              <BusinessAutho
                사업자등록번호={사업자등록번호}
                set사업자등록번호={set사업자등록번호}
              ></BusinessAutho>
              // <CreateClassComponent></CreateClassComponent>
            )}
          {/* 이제 원데이 클래스를 등록 */}
          {핸드폰인증여부.핸드폰인증 &&
            사업자번호인증여부.사업자등록번호인증 && (
              <>
                <p1>신청 하신 해당 사업은</p1>
                <p1>관리자의 확인후 승인됩니다.</p1>
                <p1>소요시간은 최대 1시간이 걸립니다.</p1>
                <div
                  style={{
                    fontSize: "30px",
                    lineHeight: " 500px",
                    position: " relative",
                    height: " 500px",
                    width: " 100%",
                    textAlign: "center",
                    background: " #f3f5f7",
                  }}
                  onClick={goManageMentPage}
                >
                  관리페이지로 이동
                </div>
              </>
              // <InsertCreateClass
              //   사업자등록번호={사업자등록번호}
              // ></InsertCreateClass>
            )}
        </div>
        <div className="stepfooterwrapper"></div>
      </AllWrapper>
    </>
  );
};
