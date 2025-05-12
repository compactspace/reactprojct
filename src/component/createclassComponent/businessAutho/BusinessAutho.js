import styled from "styled-components";
import { BusinessAuthoModalStyle } from "../modalStyle/BusinessAuthoModalStyle";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { GeneralModal } from "../../pages/Master/MasterMenuCompo/MasterBusinessCompo";
import { useSelector, useDispatch } from "react-redux";
import { set사업자등록번호인증 } from "../../../store/createClassSlice/createClassSlice";
import { set핸드폰인증 } from "../../../store/createClassSlice/createClassSlice";
import { useNavigate } from "react-router-dom";
export const BusinessAutho = ({ 사업자등록번호, set사업자등록번호 }) => {
  const navi = useNavigate();

  let 핸드폰인증여부 = useSelector((state) => {
    return state.PhoneAutho;
  });

  let 사업자번호인증여부 = useSelector((state) => {
    return state.BusinessnumberAutho;
  });

  const dispatch = useDispatch();

  let IP;

  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let [사업자등록번호입력모달, set사업자등록번호입력모달] = useState(false);
  const OpenModal = () => {
    set사업자등록번호입력모달(!사업자등록번호입력모달);
  };

  let phoneregex;
  let business_num;
  const PhoneNumChange = () => {
    business_num = document.getElementById("phonNum").value;
    let result = /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
    phoneregex = result.test(business_num);
    set사업자등록번호(business_num);
  };

  let [부동산계약서이미지, set부동산계약서이미지] = useState(null);
  let [미리보기이미지, set미리보기이미지] = useState(null);
  const rentalFilChange = async (e) => {
    //파일객체를 얻는다.
    const file = e.target.files[0];

    const 미리보기파일Base64 = await baseImage(file);

    set미리보기이미지(미리보기파일Base64);
    set부동산계약서이미지(미리보기파일Base64);
  };

  const baseImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // base64 문자열 전달!
      };
      reader.onerror = (err) => {
        reject(err); // 읽기 실패 시 에러 전달
      };
      reader.readAsDataURL(file);
    });
  };

  let today = new Date();

  const GetAuthoMeseeage = async () => {
    console.log(`business_num: ${사업자등록번호}`);
    console.log(부동산계약서이미지);

    if (사업자등록번호 === undefined || 부동산계약서이미지 === null) {
      alert("필수항목을 입력해주세요");
      return;
    }

    let data = {
      business_num: 사업자등록번호,
    };
    let headers = { "content-type": "application/json" };

    await axios
      .post(`http://${IP}:4000/teacher/authoCorporation`, data, { headers })
      .then((res) => {
        console.log(res.data);

        if (res.data.statuscode == 1) {
          //   document.getElementById("timeoutarea").innerHTML = "인증되셨습니다.";
          alert(`사업자등록번호 인증에 성공하셨습니다.`);
          원데이클래스번호삽입API(business_num);
          OpenModal();

          document.getElementById("header1").classList.remove("headeraction");
          document.getElementById("header2").classList.remove("headeraction");
          document.getElementById("header3").classList.add("headeraction");
        } else {
          document.getElementById("timeoutarea").innerHTML =
            "등록하신 번호로 사업자번호를 조회할 수 없습니다.";
        }
      })
      .catch((err) => {});
  };

  const 원데이클래스번호삽입API = async (business_num) => {
    await axios
      .post(`http://${IP}:4000/teacher/insertonedayclassnum`, {
        business_num: 사업자등록번호,
        rental_file: 부동산계약서이미지,
      })
      .then((res) => {
        if (res.data.duplicStatuscode === -1) {
          alert(
            "해당 사업자 등록번호는  이미 심사중에 있습니다. \n 소요 시간은 짧게 1분에서 최대 한시간 소요 됩니다. \n  단 점심 12:00~13:30 과, \n 18:00 ~ 09:00 까지는 심사하지 않습니다."
          );
        } else if (res.data.duplicStatuscode === -10) {
          setGoUpdateOneday("updateOneday");
        } else {
          set사업자등록번호(business_num);
          dispatch(set사업자등록번호인증(!사업자번호인증여부.사업자등록번호));
        }
      });
  };

  const [goUpdateOneday, setGoUpdateOneday] = useState("");

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
              선생님의 사업자 등록 번호를 입력해주세요
            </div>
            <div className="alerttext">
              사업자 등록번호화 사업장 거래계약서 인증을해주세요
            </div>
          </div>
          <div className="samsecss">
            <div className="getauthobtn" id="getauthobtn" onClick={OpenModal}>
              사업자등록번호 인증하기
            </div>
          </div>
        </div>
      </div>

      {사업자등록번호입력모달 && (
        <BusinessAuthoModalStyle>
          <div className="modal" id="modal">
            <div className="modal_body" id="modal_body">
              <h2>사업자등록번호 인증및 부동산 계약서 제출</h2>
              <div className="getauthoarea" id="getauthoarea">
                {/*  쫌있다 와서 여기서 id 값 과 체인지 클릭 에 비밀번호 확인 컨트롤러 만들어주자. */}
                <input
                  placeholder="하이픈 상관없이 사업자등록번호를입력해주세요"
                  id="phonNum"
                  onChange={PhoneNumChange}
                />
                <input
                  type="file"
                  name="rental_file"
                  onChange={rentalFilChange}
                />

                <div
                  className="samemeseeage"
                  id="getauthomeseeage"
                  onClick={GetAuthoMeseeage}
                >
                  <div className="samebtn">인증하기</div>
                </div>
              </div>

              <div className="goauthoarea getauthoarea" id="goauthoarea">
                <span id="timeoutarea"></span>
              </div>
              <div className="cancleconfirmarea">
                <div
                  onClick={() => {
                    OpenModal();
                    //clearInterval(timeout);

                    // axios.get(`http://${IP}:4000/user/messageauthotimeout`)
                    // .then((res=>{
                    //     if(res.data.authostatuscode==-1){
                    //         alert("취소하셨습니다.")
                    //     }
                    // }))
                  }}
                >
                  닫기
                </div>
                <div>확인</div>
              </div>
            </div>
            <div className="rental_imageArea"></div>
          </div>
        </BusinessAuthoModalStyle>
      )}
      {미리보기이미지 != null && (
        <>
          <GeneralModal
            zIndexOption={99911}
            modalWidthOption={"700px"}
            modalHeightOption={"800px"}
            modalBackgroundOff={"yes"}
            rowBoxWidthOption={"300px"}
          >
            <h1>해당사업장의 부동산 계약서가 맞습니까?</h1>
            <img src={미리보기이미지} style={{ 미리보기이미지스타일 }} />
            <div className="modalRowBox">
              <div
                className="BtnMode"
                onClick={() => {
                  set부동산계약서이미지(null);
                  set미리보기이미지(null);
                }}
              >
                아니요
              </div>
              <div
                className="BtnMode"
                onClick={() => {
                  set미리보기이미지(null);
                }}
              >
                예
              </div>
            </div>
          </GeneralModal>
        </>
      )}

      {goUpdateOneday != "" && (
        <>
          <GeneralModal
            zIndexOption={99911}
            modalWidthOption={"700px"}
            modalHeightOption={"800px"}
            modalBackgroundOff={"yes"}
            rowBoxWidthOption={"300px"}
          >
            <h1>해당 사업자 번호는 이미 인증된 사업자번호입니다.</h1>
            <h1>해당 수업을 수정하러 갈까요?</h1>

            <div className="modalRowBox">
              <div
                className="BtnMode"
                onClick={() => {
                  setGoUpdateOneday("");
                  dispatch(
                    set사업자등록번호인증(!사업자번호인증여부.사업자등록번호)
                  );
                }}
              >
                아니요
              </div>
              <div
                className="BtnMode"
                onClick={() => {
                  navi("/management");
                }}
              >
                예
              </div>
            </div>
          </GeneralModal>
        </>
      )}
    </>
  );
};

const 미리보기이미지스타일 = {
  width: `600px`,
  height: `700px`,
};
