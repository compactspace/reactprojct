import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { set핸드폰인증 } from "../../../store/createClassSlice/createClassSlice";
import { set사업자등록번호인증 } from "../../../store/createClassSlice/createClassSlice";

import { useSelector } from "react-redux";
import { GeneralModal } from "../../pages/Master/MasterMenuCompo/MasterBusinessCompo";
export const PhonAurho = () => {
  let naiv = useNavigate();
  let [cookie, setCookie] = useCookies(["userid"]);
  let dispatch = useDispatch();
  let IP;

  const [기존사업자인증대기중리스트Cnt, set기존사업자인증대기중리스트Cnt] =
    useState(0);
  const [기존사업자인증대기중리스트, set기존사업자인증대기중리스트] = useState(
    []
  );

  const [승인상태, set승인상태] = useState();

  const [경고창모달, set경고창모달] = useState("");

  const [기존사업자인증대기중리스트모달, set기존사업자인증대기중리스트모달] =
    useState("");

  let { 핸드폰인증 } = useSelector((state) => {
    return state.PhoneAutho;
  });

  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let authonumber;
  const 인증번호입력 = () => {
    if (authonumber == "" || authonumber == " ") {
      document.getElementById("authonumber").value = null;
      return;
    }
    authonumber = document.getElementById("authonumber").value;
  };

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

  const 인증하기 = () => {
    if (authonumber == null || authonumber == undefined) {
      alert("발급받으신 인증번호를 입력해주세요");
      return;
    }

    let data = { authonumber: authonumber };
    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/teacher/authocheck`, data, { headers })
      .then((res) => {
        let { watingBusinessList, watingBusinessListCnt, authostatuscode } =
          res.data;

        if (authostatuscode == 1) {
          if (watingBusinessListCnt != 0) {
            set경고창모달("open");
            // console.log(watingBusinessList);
            set기존사업자인증대기중리스트Cnt(watingBusinessListCnt);
            set기존사업자인증대기중리스트(watingBusinessList);
            set승인상태(watingBusinessList[0].business_status);
          } else {
            alert("인증되셨습니다.\n 이제 등록 단계로 넘어갑니다.");
            dispatch(set핸드폰인증(핸드폰인증));
            document.getElementById("header1").classList.remove("headeraction");
            document.getElementById("header2").classList.add("headeraction");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const businessNumChange = (e) => {
    const { name, value } = e.target;
    const index = e.target.selectedIndex;
    const selectedItem = 기존사업자인증대기중리스트[index];
    console.log(`index  ${index}`);
    set승인상태(selectedItem.business_status);
  };

  return (
    <>
      <div className="stepbodyarea">
        <div className="teacheralertarea">
          <div className="alert">주의사항</div>
          <div className="alerttext">
            먼저 회원가입을 하신후, 작가 인증을 진행해주셔야 합니다. 외원가입
            없이 작가 인증은 할 수 없습니다. 로그인을 반드시 로그인을 진행하신후
            눌러주세요
          </div>
        </div>
        <div className="teacherauthoarea">
          <div className="samsecss img">
            <img className="imgarea" src="phoneicon/phonemainicon.png"></img>
          </div>
          <div className="samsecss">
            <div className="alert" style={{ color: "#596a88" }}>
              선생님 등록은 한번더 인증이 필요해요
            </div>
            <div className="alerttext">
              먼저 로그인을 진행해주시고 작가 인증을 진행해주셔야 합니다.
              외원가입 없이 작가 인증은 할 수 없습니다.
            </div>
          </div>
          <div className="samsecss">
            <div
              className="getauthobtn"
              id="getauthobtn"
              onClick={인증번호받기}
            >
              인증번호받기
            </div>
          </div>

          <div className="samsecss" id="goauthoarea">
            <input
              id="authonumber"
              type="password"
              placeholder="발급받으신 인증번호를 입력해주세요"
              onChange={인증번호입력}
            ></input>
            <div className="getauthobtn" onClick={인증하기}>
              인증하기
            </div>
          </div>
        </div>
      </div>
      {경고창모달 != "" && (
        <GeneralModal>
          <div className="modal-content">
            <h1>알림</h1>
            <p>기존 사업자인증 신청을 하셨던 이력이있습니다.</p>
            <p>확인하시겠습니까?</p>
            <div
              className="BtnMode"
              onClick={() => {
                set경고창모달("");
                dispatch(set핸드폰인증(핸드폰인증));
              }}
            >
              아니요
            </div>
            <div
              className="BtnMode"
              onClick={() => {
                set경고창모달("");
                set기존사업자인증대기중리스트모달("open");
              }}
            >
              예
            </div>
          </div>
        </GeneralModal>
      )}
      {경고창모달 === "" && 기존사업자인증대기중리스트모달 != "" && (
        <GeneralModal widthOption={"600px"} heightOption={"600px"}>
          <div className="modal-content">
            <h1>사업자인증 대기중인 내역</h1>
            {/* set기존사업자인증대기중리스트Cnt set기존사업자인증대기중리스트 */}
            <div className="modalRowBox">
              <label className="labelStyle">사업자번호</label>
              <select
                name="business_num"
                className="selectStyle"
                onChange={businessNumChange}
              >
                {기존사업자인증대기중리스트.map((item, idx) => {
                  return (
                    <option
                      key={item.onedayclass_num}
                      value="item.business_num"
                      data-var={idx}
                    >
                      {item.business_num}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="modalRowBox">
              <label className="labelStyle">승인여부</label>
              <div>{승인상태 === "no" ? "대기중" : "인가"}</div>
            </div>
            <div className="modalRowBox">
              <div
                className="BtnMode"
                onClick={() => {
                  set경고창모달("");
                  set기존사업자인증대기중리스트모달("");
                  dispatch(set핸드폰인증(핸드폰인증));
                }}
              >
                닫기
              </div>
              {승인상태 === "yes" && (
                <>
                  <div
                    className="BtnMode"
                    onClick={() => {
                      set경고창모달("");
                      set기존사업자인증대기중리스트모달("");
                      dispatch(set핸드폰인증(핸드폰인증));
                    }}
                  >
                    확인
                  </div>
                </>
              )}
            </div>
          </div>
        </GeneralModal>
      )}
    </>
  );
};
