import { GeneralModal } from "../pages/Master/MasterMenuCompo/MasterBusinessCompo";
import { MasterColTable } from "../pages/MasterTableStyle/MasterColTable";
import { useEffect, useState } from "react";
import axios from "axios";
export const PayforBannerDetailModal = ({
  onedayInfo,
  bannerInfo,
  onedayInfoCnt,
  bannerInfoCnt,
  banner_stdate,
  banner_eddate,
}) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [임시배열, set임시배열] = useState([]);

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

  const colName = {
    uc_bannertype: "선택한 배너타입",
    uc_bannerinfo_price: "배너등록 월단위 가격",
    total_price: "월합산가격",
    banner_stdate: "선택한광고 시작일",
    banner_eddate: "선택한광고 종료일일",
  };

  useEffect(() => {
    console.log(bannerInfo);
    const box = { ...임시배열 };

    box.uc_bannertype = bannerInfo.bannertype;
    box.uc_bannerinfo_price = bannerInfo.banner_price;
    box.total_price = 3444;
    box.banner_stdate = banner_stdate;
    box.banner_eddate = banner_eddate;
    box.onedayclass_num = onedayInfo.onedayclass_num;
    box.update_banner_plan = bannerInfo.bannertype;
    set임시배열([box]);
  }, []);

  const 결제정보삽입함수 = () => {
    // console.log(임시배열[0]);
    let bodyData = 임시배열[0];
    // console.log(bodyData);
    axios
      .post(`http://${IP}:4000/teacher/payForBanner`, bodyData)
      .then((res) => {
        let { payStatusCode } = res.data;
        if (payStatusCode === 1) {
          alert("결제에 성공하였습니다.");
          return;
        } else {
          alert("잠시후 다시 시도해주세요");
          return;
        }
      });
  };

  return (
    <>
      {임시배열.length != 0 && (
        <>
          <GeneralModal
            modalBodyWidthOption={"1300px"}
            modalHeightOption={"1000px"}
            inputStyle={"170px"}
            modalTopOption={"50%"}
            modalHeadBodyGap={"40px"}
          >
            <div style={cutline}>배너등록정보</div>
            <MasterColTable
              tableWidthOp={"50%"}
              colFontOp={"20px"}
              rowFontOp={"20px"}
              rowCount={bannerInfoCnt}
              data={임시배열}
              columnName={colName}
              emptyMassge={"현재배너등록을 하지 않으셨습니다."}
              InputType={""}
            ></MasterColTable>

            <div style={cutline}>배너에 등록할 클래스정보</div>
            <MasterColTable
              tableWidthOp={"50%"}
              rowCount={onedayInfoCnt}
              data={[onedayInfo]}
              columnName={onedayColName}
              InputType={""}
            ></MasterColTable>

            <div
              style={cutline}
              onClick={() => {
                결제정보삽입함수();
              }}
            >
              결제하기
            </div>
          </GeneralModal>
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
