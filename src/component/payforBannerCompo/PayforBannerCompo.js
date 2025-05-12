import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { MasterTable } from "../pages/MasterTableStyle/MasterTable";
import { PayforBannerDetailModal } from "./PayforBannerDetailModal";
import { 검색조건레퍼 } from "../CalandarComPo/CalandarComPo";
const StepTogleWrapper = styled.div`
  display: flex;
  font-size: 26px;
  width: 640px;
  justify-content: space-between;
  margin-bottom: 40px;
  & .step {
    max-width: 300px;
    min-width: 300px;
    text-align: center;
  }

  .stepaction {
    font-size: 26px;
    max-width: 3000px;
    min-width: 300px;
    height: 100%;
    color: #ff5862;

    font-weight: bold;
    box-shadow: 0px 3px 0px 0 #ff5862;
  }
`;

const GeneralSearchWrapper = styled.div`
  & select {
    display: block;
  }

  & .rowArea {
    display: flex;
  }
`;
export const PayforBannerCompo = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [myBusinessList, setMyBusinessList] = useState(null);
  const [myBusinessListCnt, setMyBusinessListCnt] = useState(0);

  const [onedayClassList, setOnedayClassList] = useState(null);
  const [onedayClassListCnt, setOnedayClassListCnt] = useState(0);

  const [onedayclass_num, setOnedayclass_num] = useState(null);

  const [bannerInfoList, setBannerInfoList] = useState(null);

  const [bannerInfoListCnt, setBannerInfoListCnt] = useState(0);

  const [최초결재니, set최초결재니] = useState(false);

  //흐음 변수가 너무 많아지는데..
  const [선택한원데이클래스, set선택한원데이클래스] = useState(null);
  const [선택한배너정보, set선택한배너정보] = useState(null);

  const [결제정보상태, set결제정보상태] = useState(false);

  const [activeAndExpiredList, setActiveAndExpiredList] = useState([]);
  const [activeAndExpiredCnt, setActiveAndExpiredCnt] = useState(0);

  // 결제시 필요한 변수를 담을 상태변수
  const [payValue, setPayValue] = useState({
    bannerinfo_num: "",
    bannerinfotype: "",
    banner_stdate: "",
    banner_eddate: "",
    onedayclass_num: "",
  });

  //주의 이건 셀렉트박스에서 사용하려고 리스트타입으로 저장
  const [onedayclass_numList, setOnedayclass_numList] = useState(null);
  useEffect(() => {
    axios
      .post(`http://${IP}:4000/teacher/getMyBusinessStatusList`, {
        business_status: "confirm",
      })
      .then((res) => {
        let { MyBusinessList, MyBusinessListCnt } = res.data;
        setMyBusinessList(MyBusinessList);
        setMyBusinessListCnt(MyBusinessListCnt);
        배너상품가져오기();
        if (MyBusinessListCnt != 0) {
          setOnedayclass_num(MyBusinessList[0].onedayclass_num);

          let box = [];
          for (let i = 0; i < MyBusinessListCnt; i++) {
            let 요소는객체입니다 = MyBusinessList[i];

            for (let key in 요소는객체입니다) {
              if (key != "onedayclass_num") {
                continue;
              }
              if (key === "onedayclass_num") {
                console.log(
                  `key: ${key} MyBusinessList[key]: ${요소는객체입니다[key]}`
                );
                box.push(요소는객체입니다[key]);
              }
            } // 두 번째포문
          } // 첫 포문

          // 인증받은 원데이클래스 넘 리스트 이다.
          setOnedayclass_numList(box);
        }
      });
  }, []);

  useEffect(() => {
    if (onedayclass_numList === null) {
      return;
    }

    console.log(onedayclass_numList);
    사업자인증받은단건원데이클래스정보(onedayclass_numList);

    document.getElementById("step1").classList.add("stepaction");
  }, [onedayclass_numList]);

  const 사업자인증받은단건원데이클래스정보 = async (onedayclass_numList) => {
    await axios
      .post(`http://${IP}:4000/teacher/getOneDayClassInfo`, {
        onedayclass_numList: onedayclass_numList,
      })
      .then((res) => {
        const { onedayClassListInfo, onedayClassListCnt } = res.data;

        console.log(onedayClassListInfo);
        console.log(onedayClassListCnt);
        const box = { ...payValue };
        box.onedayclass_num = onedayClassListInfo[0]?.onedayclass_num;
        box.bannerinfotype = onedayClassListInfo[0]?.uc_bannertype;
        setPayValue(box);
        setOnedayClassList(onedayClassListInfo);
        set선택한원데이클래스(onedayClassListInfo[0]);
        최초결재니분기점함수(onedayClassListInfo[0]?.onedayclass_num);
        setOnedayClassListCnt(onedayClassListCnt);
      });
  };

  useEffect(() => {
    if (onedayclass_num === null) {
      return;
    }
    최초결재니분기점함수(onedayclass_num);
  }, [onedayclass_num]);

  const 최초결재니분기점함수 = (onedayclass_num) => {
    console.log(`onedayclass_num: ${onedayclass_num}`);
    axios
      .post(`http://${IP}:4000/teacher/isFirstBannaer`, {
        onedayclass_num: onedayclass_num,
      })
      .then((res) => {
        let { isFirstBannaer, activeAndExpiredList, activeAndExpiredCnt } =
          res.data;

        console.log(`isFirstBannaer: ${isFirstBannaer}`);

        setActiveAndExpiredList(activeAndExpiredList);
        setActiveAndExpiredCnt(activeAndExpiredCnt);

        if (isFirstBannaer === 1) {
          set최초결재니(true);
        } else {
          set최초결재니(false);
        }
      });
  };

  useEffect(() => {
    console.log(
      `onedayclass_num: ${onedayclass_num}  최초결재니: ${최초결재니}`
    );
  }, [최초결재니]);

  const activeAndExpiredColName = {
    uc_bannertype: "결제한 배너타입",
    banner_stdate: "배너광고 시작일",
    banner_eddate: "배너광고 종료일",
    banner_paymentday: "결제일",
    expire_status: "만기여부",
  };

  const 배너상품가져오기 = async () => {
    ///getBannerList
    await axios
      .post(`http://${IP}:4000/teacher/getBannerList`, {})
      .then((res) => {
        const { getBannerInfoList, getBannerInfoListCnt } = res.data;
        console.log(getBannerInfoList);

        setBannerInfoList(getBannerInfoList);
        setBannerInfoListCnt(getBannerInfoListCnt);
      });
  };

  const bannerColName = {
    bannertype: "배너상품타입",
    banner_shortinfo: "배너상품소개",
    banner_price: "월단위 기본 배너가격",
    choice: "선택",
  };

  //해당 배너 상품을 보고 클릭한다.
  const bannerCelClick = {
    결제정보열기: (rowIdx) => {
      const box = { ...payValue };
      box.bannerinfo_num = bannerInfoList[rowIdx].bannerinfo_num;
      box.bannerinfotype = bannerInfoList[rowIdx].bannertype;

      set선택한배너정보(bannerInfoList[rowIdx]);
      setPayValue(box);
      set결제정보상태(!결제정보상태);
      document.getElementById("step1").classList.remove("stepaction");
      document.getElementById("step2").classList.add("stepaction");
    },
  };

  const onedayNumHandler = (e) => {
    const { name, value } = e.target;
    const index = e.target.selectedIndex;
    set선택한원데이클래스(onedayClassList[index]);
    setOnedayclass_num(onedayClassList[index].onedayclass_num);
    setPayValue((preve) => ({
      ...preve,
      [name]: value,
    }));

    // 최초결재니분기점함수(onedayClassList[index]);
  };

  //결제버튼으로 모달을 연다.
  const [payInfoDetailModal, setPayInfoDetailModal] = useState(false);
  const paymentCelClick = {
    결제함수: () => {
      console.log(payValue);
      for (let key in payValue) {
        if (payValue[key] === "") {
          alert("배너등록 시작일 종료일 모두 입력해주세요");
          return;
        }
      }

      setPayInfoDetailModal(true);

      //PayforBannerDetailModal
    },
  };

  const colName = {
    banner_type_readOnly: "배너상품종류",
    banner_stdate_onChange: "배너광고 시작일",
    banner_eddate_onChange: "배너광고 종료일",
    choice: "결제하기",
    cancle: "취소",
  };

  //삽입 인풋타입
  const rowInputType = {
    bannerinfo_num_text: "readOnly_Text",
    banner_stdate_date: "variable_Date",
    banner_eddate_date: "variable_Date",
    Ignore: "Not", //형식적으로 컬럼갯수를 맞추는것으로 무시해도됨.
    banner_paymentcancle_button: "button",
  };

  const [insertReadOnly, setInsertReadOnly] = useState({
    banner_type_readOnly: "",
  });

  // 테이블로 넘길 상태 변화 함수와  함수들
  const [stDate, setStDate] = useState("");
  const [edDate, setEdtDate] = useState("");

  const dateHandler = (e) => {
    const { name, value } = e.target;

    console.log(`name: ${name}   value: ${value}`);

    setPayValue((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const rowInputFnc = {
    dateHandler: dateHandler,
  };

  const TextRenderFnc = (item, colname) => {
    console.log(item);
    if (colname != "expire_status") return "";

    return item === "expired"
      ? "사용완료"
      : item === "active"
      ? "사용중"
      : "시작전";
  };

  const [연장대상정보만기일, set연장대상정보만기일] = useState(null);
  const 연장하기 = () => {
    const box = { ...payValue };

    const lastEndDate = new Date(
      activeAndExpiredList[activeAndExpiredList.length - 1].banner_eddate
    );

    // 다음 달로 이동
    const nextMonthDate = new Date(
      lastEndDate.getFullYear(),
      lastEndDate.getMonth() + 1,
      1
    );

    // yyyy-mm-dd 포맷으로 변환
    const year = nextMonthDate.getFullYear();
    const month = String(nextMonthDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하니까 +1
    const day = String(nextMonthDate.getDate()).padStart(2, "0");

    const formattedNextMonthDate = `${year}-${month}-${day}`;

    console.log(formattedNextMonthDate); // 👉 2025-05-01

    box.banner_stdate = formattedNextMonthDate;
    setPayValue(box);
    set연장대상정보만기일(formattedNextMonthDate);
  };

  //연장 결재를 위한 기본적인 리드온리를 담을
  const [updateReadOnly, setUpdateReadOnly] = useState({
    banner_type_readOnly: "",
    banner_stdate_readOnly: "",
  });
  const updateColName = {
    banner_type_readOnly: "배너상품종류",
    banner_stdate_readOnly: "배너광고 시작일",
    banner_eddate_onChange: "배너광고 종료일",
    choice: "결제하기",
    cancle: "취소",
  };

  const updateRowInputType = {
    bannerinfo_num_text: "readOnly_Text",
    banner_stdate: "readOnly_Date",
    banner_eddate: "variable_Date",
    Ignore: "Not", //형식적으로 컬럼갯수를 맞추는것으로 무시해도됨.
    banner_paymentcancle_button: "button",
  };

  useEffect(() => {
    if (선택한배너정보 != undefined) {
      const box = { ...updateReadOnly };
      const box2 = { ...insertReadOnly };

      box.banner_stdate_readOnly = 연장대상정보만기일;
      box.banner_type_readOnly = 선택한배너정보.bannertype;
      box2.banner_type_readOnly = 선택한배너정보.bannertype;
      setInsertReadOnly(box2);
      setUpdateReadOnly(box);
    }
  }, [선택한배너정보]);

  return (
    <>
      <StepTogleWrapper>
        {!최초결재니 && (
          <>
            <div className="step" id="step1">
              step1: 현재 사용중인 배너
            </div>

            <div className="step" id="step1">
              step2: 배너상품선택
            </div>
            <div className="step" id="step2">
              step3: 기간선택 결제
            </div>
          </>
        )}
        {최초결재니 && (
          <>
            <div className="step" id="step1">
              step1: 배너상품선택
            </div>
            <div className="step" id="step2">
              step2: 기간선택 결제
            </div>
          </>
        )}
      </StepTogleWrapper>
      {myBusinessListCnt === 0 && (
        <h1>현재 사업자 인증을 받은 클래스가 없습니다.</h1>
      )}
      {onedayClassListCnt != 0 && (
        <>
          <GeneralSearchWrapper>
            <검색조건레퍼>
              <select id="select" onChange={onedayNumHandler}>
                {onedayClassList.map((item, idx) => {
                  return (
                    <>
                      <option
                        name="onedayclass_num"
                        key={item.onedayclass_num}
                        data-var={idx}
                      >
                        {item.onedayclass_name}
                      </option>
                      ;
                    </>
                  );
                })}
              </select>
            </검색조건레퍼>
            {/* 씨 */}
            {연장대상정보만기일 === null && !최초결재니 && (
              <>
                <MasterTable
                  columnName={activeAndExpiredColName}
                  data={activeAndExpiredList}
                  rowCount={activeAndExpiredCnt}
                  InputType={""}
                  textRender={TextRenderFnc}
                  // cellClickFnc={bannerCelClick}
                ></MasterTable>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={cutline} onClick={연장하기}>
                    연장하기
                  </div>
                </div>
              </>
            )}
            {!결제정보상태 && 연장대상정보만기일 != null && !최초결재니 && (
              <>
                <MasterTable
                  columnName={bannerColName}
                  data={bannerInfoList}
                  rowCount={bannerInfoListCnt}
                  InputType={""}
                  cellClickFnc={bannerCelClick}
                ></MasterTable>
              </>
            )}
            {결제정보상태 &&
              연장대상정보만기일 != null &&
              !최초결재니 &&
              updateReadOnly.banner_stdate_readOnly != undefined && (
                <>
                  <>
                    <div
                      style={{ fontSize: "30px" }}
                      onClick={() => {
                        set결제정보상태(!결제정보상태);
                      }}
                    >
                      &lt;
                    </div>

                    <MasterTable
                      dataReadOnly={updateReadOnly}
                      columnName={updateColName}
                      InputType={"input"}
                      rowInputType={updateRowInputType}
                      rowInputFnc={rowInputFnc}
                      tBodyRow={"row"}
                      cellClickFnc={paymentCelClick}
                    ></MasterTable>
                  </>
                </>
              )}

            {최초결재니 && bannerInfoListCnt != 0 && !결제정보상태 && (
              <>
                <MasterTable
                  columnName={bannerColName}
                  data={bannerInfoList}
                  rowCount={bannerInfoListCnt}
                  InputType={""}
                  cellClickFnc={bannerCelClick}
                ></MasterTable>
              </>
            )}

            {bannerInfoListCnt != 0 && 결제정보상태 && 최초결재니 && (
              <>
                <div
                  style={{ fontSize: "30px" }}
                  onClick={() => {
                    set결제정보상태(!결제정보상태);
                  }}
                >
                  &lt;
                </div>

                <MasterTable
                  dataReadOnly={insertReadOnly}
                  columnName={colName}
                  InputType={"input"}
                  rowInputType={rowInputType}
                  rowInputFnc={rowInputFnc}
                  tBodyRow={"row"}
                  cellClickFnc={paymentCelClick}
                ></MasterTable>
              </>
            )}
          </GeneralSearchWrapper>
        </>
      )}

      {payInfoDetailModal && (
        <>
          <PayforBannerDetailModal
            onedayInfo={선택한원데이클래스}
            bannerInfo={선택한배너정보}
            banner_stdate={payValue.banner_stdate}
            banner_eddate={payValue.banner_eddate}
            onedayInfoCnt={1}
            bannerInfoCnt={1}
          ></PayforBannerDetailModal>
        </>
      )}
    </>
  );
};
const cutline = {
  width: "50%",
  lineHeight: "54px",
  marginTop: "10px",
  background: "#ebebeb",
  height: "60px",
  fontSize: "25px",
  textAlign: "center",
};
