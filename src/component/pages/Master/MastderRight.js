import { useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { ManagerBannerSearchCompo } from "./MasterMenuCompo/ManagerBannerSearchCompo";
import { ManagerBannerCompo } from "./MasterMenuCompo/ManagerBannerCompo";
import { MasterBusinessSearchCompo } from "./MasterMenuCompo/MasterBusinessSearchCompo";
import { MasterBusinessCompo } from "./MasterMenuCompo/MasterBusinessCompo";
const MastderRightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1560px;
  width: 100%;
`;

export const MastderRight = () => {
  const { targetMenu, MenuName } = useSelector((state) => state.ManuSelect);

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const defaultDate = new Date();
  const defaultYear = defaultDate.getFullYear();
  const defaultMonth = String(defaultDate.getMonth() + 1).padStart(2, "0");

  // 신청 사업자관리 검색조건
  const [searchBusiness, setSearchBusiness] = useState({
    searchType: "default",
    business_status: "waiting",
    business_creatAt: defaultYear + "-" + defaultMonth,
    //그냥 비트윈문에서 날짜가 두개가 필요하니 사용할 변수명이다.
    business_creatAt2: defaultYear + "-" + defaultMonth,
  });

  //배너등록 검색조건
  const [searchType, setsearchType] = useState({
    searchType: "default",
    promotion_confirm_status: "no",
    max_paid: defaultYear + "-" + defaultMonth,
  });

  return (
    <>
      <MastderRightWrapper>
        {targetMenu && MenuName === "신청 사업자 승인관리" && (
          <>
            <MasterBusinessSearchCompo
              menuTitleName={"신청 사업자 승인관리"}
              searchBusiness={searchBusiness}
              setSearchBusiness={setSearchBusiness}
            ></MasterBusinessSearchCompo>

            <MasterBusinessCompo
              searchBusiness={searchBusiness}
              setSearchBusiness={setSearchBusiness}
            ></MasterBusinessCompo>
          </>
        )}
        {targetMenu && MenuName === "배너등록 승인관리" && (
          <>
            <ManagerBannerSearchCompo
              setsearchType={setsearchType}
              searchType={searchType}
              menuTitleName={"배너등록 승인관리"}
            ></ManagerBannerSearchCompo>
            <ManagerBannerCompo
              setsearchType={setsearchType}
              searchType={searchType}
            ></ManagerBannerCompo>
          </>
        )}
        {targetMenu && MenuName === "배너등록 기간조회" && (
          <h1>배너등록 기간조회 이란다자식아</h1>
        )}
      </MastderRightWrapper>
    </>
  );
};
