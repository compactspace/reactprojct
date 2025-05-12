import axios from "axios";
import { useState, useEffect } from "react";
import { MasterTable } from "../pages/MasterTableStyle/MasterTable";
import styled from "styled-components";
import { GeneralModal } from "../pages/Master/MasterMenuCompo/MasterBusinessCompo";
import { 검색조건레퍼 } from "../CalandarComPo/CalandarComPo";
export const GeneralSearchWrapper = styled.div`
  & select {
    display: block;
  }

  & .rowArea {
    display: flex;
  }
`;

export const MyBusinessListCompo = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [searchKeyWord, setSearchKeyWord] = useState({
    business_status: "waiting",
  });
  const [myBusinessList, setMyBusinessList] = useState(null);
  const [myBusinessListCnt, setMyBusinessListCnt] = useState(0);

  //테이블 로우 클릭시, 담을 상태변수
  const [choiceMyBusinessDetail, setChoiceMyBusinessDetail] = useState(null);

  // 사업자인증은 받은후, 클래스정보를입력했니 안했니 했다면 원데이클래스번호를담는 상태변수
  const [OnedayClassNum, setOnedayClassNum] = useState(null);

  // 만약 이미 베너에 등록중이라면 베너정보를 담을 상태변수
  const [bannerInfo, setBannerInfo] = useState(null);
  // 사실 한개의 로우만 가져오는데 형식적으로 만들자 그냥
  const [bannerInfoCnt, setBannerInfoCnt] = useState(0);

  const [onedayInfo, setOnedayInfo] = useState(null);
  const [onedayInfoCnt, setOnedayInfoCnt] = useState(null);

  useEffect(() => {
    axios
      .post(`http://${IP}:4000/teacher/getMyBusinessStatusList`, searchKeyWord)
      .then((res) => {
        let { MyBusinessList, MyBusinessListCnt } = res.data;
        setMyBusinessList(MyBusinessList);
        setMyBusinessListCnt(MyBusinessListCnt);
      });
  }, [searchKeyWord]);

  const onedayColName = {
    onedayclass_name: "등록클래스명",
    onedayclass_price: "등록클래스이용가격",
    onedayclass_info: "등록클래스정보",

    ClassLocation: "등록클래스위치",
    Park: "주차가능",
    PlayTime: "이용시간",
    Playinguser: "이용인원수",

    createAT: "클래스등록일",
    updateAt: "클래스업데이트일",
  };

  const columnName = {
    business_creatAt: "사업등록 신청일",
    business_num: "나의 사업자번호",
    business_status: "사업승인상태",
    answar_Justtext: "승인상세보기",
  };

  const 클래스정보입력한적있니그렇다면리스트반환그리고배너등록한적도있니 =
    async (onedayclass_num) => {
      await axios
        .post(`http://${IP}:4000/teacher/getUsingPaymentBannerAndOnedayInfo`, {
          onedayclass_num: onedayclass_num,
        })
        .then((res) => {
          let { onedayclass_num, bannerInfo, onedayInfo } = res.data;
          setOnedayClassNum(onedayclass_num);
          setBannerInfo([bannerInfo]);
          setOnedayInfo([onedayInfo]);
          let onedayInfoCnt = onedayInfo === null ? 0 : 1;
          setOnedayInfoCnt(onedayInfoCnt);
          let bannerInfoCnt = bannerInfo === null ? 0 : 1;
          setBannerInfoCnt(bannerInfoCnt);
        });
    };

  const colName = {
    uc_bannertype: "배너 타입",
    uc_bannerinfo_price: "배너 등록비용",
    banner_paymentday: "배너 결제일",
    banner_stdate: "배너 광고 시작일",
    banner_eddate: "배너 광고 종료일일",
  };

  const rowClick = async (idx) => {
    const onedayclass_num = myBusinessList[idx].onedayclass_num;
    console.log(`onedayclass_num: ${onedayclass_num}`);
    await 클래스정보입력한적있니그렇다면리스트반환그리고배너등록한적도있니(
      onedayclass_num
    );
    console.log(myBusinessList[idx]);
    setChoiceMyBusinessDetail(myBusinessList[idx]);
  };

  const 거절사유1Ui = (choiceMyBusinessDetail) => {
    let case1 =
      choiceMyBusinessDetail.confirm_cuz === null &&
      choiceMyBusinessDetail.jejact_cuz === "waiting";
    console.log(`case1: ${case1}`);
    return case1;
  };

  const 거절사유2Ui = (choiceMyBusinessDetail) => {
    let case2 =
      choiceMyBusinessDetail.confirm_cuz === null &&
      choiceMyBusinessDetail.jejact_cuz != "waiting";
    console.log(`case2: ${case2}`);
    return case2;
  };

  const 기존정보UI = (choiceMyBusinessDetail) => {};

  const statusHandler = (e) => {
    const { name, value } = e.target;
    const box = { ...searchKeyWord };
    box.business_status = value;

    setSearchKeyWord(box);
  };

  return (
    <>
      <GeneralSearchWrapper>
        <div className="rowArea">
          <검색조건레퍼>
            <select id="select" onChange={statusHandler}>
              <option value="waiting">대기중인클래스</option>
              <option value="reject">거절된클래스</option>
              <option value="confirm">승인된클래스</option>
            </select>
          </검색조건레퍼>
        </div>
      </GeneralSearchWrapper>

      {myBusinessList != null && (
        <MasterTable
          rowCount={myBusinessListCnt}
          data={myBusinessList}
          columnName={columnName}
          rowUntiClck={rowClick}
          InputType={""}
        ></MasterTable>
      )}
      {choiceMyBusinessDetail != null && (
        <GeneralModal
          modalBodyWidthOption={"1300px"}
          modalHeightOption={"1000px"}
          inputStyle={"170px"}
          modalTopOption={"50%"}
          modalHeadBodyGap={"40px"}
        >
          <div className="modalAllWrapper">
            <div className="modalHead">
              <h1>사업승인 상세</h1>
            </div>
            <div className="modalBody">
              <div className="modalBodyArea">
                <div className="modalRowBox">
                  <div className="inputStyle">신청일자</div>
                  <div className="inputStyle">
                    {
                      String(choiceMyBusinessDetail.business_creatAt).split(
                        "T"
                      )[0]
                    }
                  </div>
                </div>
                <div className="modalRowBox">
                  <div className="inputStyle"> 신청 사업자번호</div>
                  <div className="inputStyle">
                    {choiceMyBusinessDetail.business_num}
                  </div>
                </div>
                <div className="modalColBox">
                  <div className="rowBox">
                    <div className="inputStyle">승인상태</div>
                    <div className="inputStyle">
                      {choiceMyBusinessDetail.business_status === "waiting" &&
                        "승인대기중"}
                      {choiceMyBusinessDetail.business_status === "confirm" &&
                        "승인허가"}
                      {choiceMyBusinessDetail.business_status === "reject" &&
                        "승인거절"}
                    </div>
                  </div>

                  <div className="rowBox">
                    <div className="inputStyle">클래스정보등록</div>
                    <div className="inputStyle">
                      {onedayInfoCnt === 0 ? "하지않음" : "등록"}
                    </div>
                  </div>

                  <div className="rowBox">
                    <div className="inputStyle">배너결제</div>
                    <div className="inputStyle">
                      {bannerInfoCnt === 0 ? "결제하지 않음" : "결제완료"}
                    </div>
                  </div>

                  {OnedayClassNum != null && (
                    <>
                      <div style={cutline}>배너등록정보</div>
                      <MasterTable
                        colFontOp={"20px"}
                        rowFontOp={"20px"}
                        rowCount={bannerInfoCnt}
                        data={bannerInfo}
                        columnName={colName}
                        emptyMassge={"현재배너등록을 하지 않으셨습니다."}
                        InputType={""}
                      ></MasterTable>
                    </>
                  )}

                  {onedayInfo != null && (
                    <>
                      <div style={cutline}>등록클래스정보</div>
                      <MasterTable
                        rowCount={onedayInfoCnt}
                        data={onedayInfo}
                        columnName={onedayColName}
                        InputType={""}
                      ></MasterTable>
                    </>
                  )}
                </div>
                {거절사유1Ui(choiceMyBusinessDetail) && (
                  <div className="modalRowBox">
                    <div>관리자님의 승인을 기다리는 중입니다.</div>
                  </div>
                )}

                {거절사유2Ui(choiceMyBusinessDetail) && (
                  <div className="modalRowBox">
                    <div className="inputStyle">불허 사유</div>
                    <div className="inputStyle">
                      {choiceMyBusinessDetail.jejact_cuz}
                    </div>
                  </div>
                )}
                {거절사유2Ui(choiceMyBusinessDetail) && (
                  <div className="modalRowBox">
                    관리자님에게 전화 문의주세요 : 010-2222-3333
                  </div>
                )}
              </div>
            </div>

            <div className="modalFooter">
              <div
                className="BtnMode"
                onClick={() => {
                  setChoiceMyBusinessDetail(null);
                }}
              >
                확인
              </div>
            </div>
          </div>
        </GeneralModal>
      )}
    </>
  );
};

const cutline = {
  lineHeight: "54px",
  marginTop: "10px",
  background: "#ebebeb",
  height: "60px",
  fontSize: "25px",
  textAlign: "center",
};
