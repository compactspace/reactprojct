import React, { useEffect, useState } from "react";
import { TeacherManagerHeader } from "../../header/TeacherManagerHeader";
import { CalandarComPo } from "../CalandarComPo/CalandarComPo";
import { useSelector } from "react-redux";
import { MyBusinessCreateClassCompo } from "../MyBusinessCreateClass/MyBusinessCreateClassCompo";
import { ReserveListComPo } from "../ReserveListComPo/ReserveListComPo";
import { UpdateClassInfoModal } from "../updateClassInfoModal/UpdateClassInfoModal";
import { MyBusinessListCompo } from "../MyBusinessListCompo/MyBusinessListCompo";
import { PayforBannerCompo } from "../payforBannerCompo/PayforBannerCompo";
import { ProductInsertCompo } from "../ProductManageCompo/ProductInsertCompo";
import { ProductPolicyCompo } from "../ProductManageCompo/ProductPolicyCompo";
import { ProductInfoCompo } from "../ProductManageCompo/ProductInfoCompo/ProductInfoCompo";
import { ProductSearchAndUpdateCompo } from "../ProductManageCompo/ProductSearchAndUpdateCompo/ProductSearchAndUpdateCompo";

import { useCookies } from "react-cookie";

import Calendar from "react-calendar";
import styled, { css } from "styled-components";

import oneday42 from "../../img2/oneday41.jpg";
// 리랜더링 테스트 용도임
import { DetailMypage } from "../../body/detailmypage";

import { useNavigate } from "react-router-dom";

import { MyInfoBodyComponent } from "../../component/MyInfoBodyComponent/MyInfoBodyComponent";

const MyPageAllWrapper = styled.div`
  display: flex;
  gap: 24px;
  /* margin: 20px auto 0; */
  /* max-width: 1200px; */
  //css
  & .LeftAllwrapper {
    border: 1px solid #ebebeb;
    border-radius: 12px;
    /* flex: 0 0 282px; */
    min-width: 200px;
    max-width: 200px;

    height: fit-content;
    margin-top: 12px;

    & ul {
      padding: 0 0;
      margin: 0 0;
    }
    & #last {
      border-bottom: none !important;
    }
    & li {
      border-bottom: 1px solid #ebebeb;
      height: 60px;
      line-height: 24px;
      list-style: none;
      padding: 0 24px;

      & a {
        color: #333;
        display: flex;
        height: inherit;
        justify-content: space-between;
        text-decoration: none;
        /* 주의 하라, 텍스트의 align-items: center; 를 쓰러면 해당 태그를 grid나, flex로 선언해야한다고한다. */
        align-items: center;
      }
    }
  }

  & .RightAllwrapper {
    min-width: 1000px;
    max-width: 1000px;

    & .contentWrapper {
      font-size: 40px;
      padding-top: 30px;
      padding-bottom: 30px;
    }

    ${(props) =>
      props.예약리스트펼치기
        ? css`
            width: 85%;
          `
        : css`
            width: 100%;
          `}

    ${(props) =>
      props.새로운수업등록
        ? css`
            width: 85%;
          `
        : css`
            width: 100%;
          `}







//달력시작

 & .schedul {
      width: 100% !important;

      & .react-calendar {
        width: 100% !important;
        height: 820px !important;
        display: flex;
        flex-direction: column;

        & .react-calendar__navigation {
          height: 5% !important;
        }

        & .react-calendar__viewContainer {
          height: 95% !important;
        }

        & .react-calendar__month-view {
          height: 100% !important;

          & .react-calendar__month-view__weekdays {
            height: 100px !important;
          }
          & .react-calendar__month-view__days {
            height: 700px !important;
          }
        }
      }
    }

    //달력종료

    & .Rightwrapper {
      margin-left: 24px;
      display: flex;
      width: 100%;
      max-width: 820px;
    }

    & h1 {
      -webkit-line-clamp: 2;

      color: #333;
      line-height: 29px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-line;
      word-break: keep-all;
    }

    & .pageheader {
      line-height: 21px;
      padding: 16px 0;
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }

    & .reserveul {
      margin-bottom: 24px;

      & .reservelist {
        display: flex;
        flex-direction: row;
        padding: 16px 0;
        position: relative;

        & .reserveimg {
          background-color: #eee;
          border: none;
          border-radius: 8px;
          flex-shrink: 0;
          height: 120px;
          margin-right: 16px;
          padding: 0;
          width: 120px;
          background-color: #f5f7fa;
          background-position: 50%;
          background-size: cover;
        }

        & .infobox {
          display: flex;
          flex-direction: column;

          & .reservestatus {
            align-items: center;
            display: flex;
            flex-direction: row;
          }

          & .detail {
            display: flex;
            flex-direction: row;
            margin-top: 16px;

            & a {
              align-items: center;
              background: #ebebeb;
              border-radius: 8px;
              color: #333;
              display: flex;
              height: 32px;
              justify-content: center;
              line-height: 14px;
              width: 80px;
            }
          }
        }
      }
    }
  }

  & .managerWrapper {
  }
`;

export const TeacherMainBodyComponent = (props) => {
  const [cookie] = useCookies("business_numArr");
  const { business_numArr } = cookie;
  const onedayclassNumList = useSelector((state) => state.onedayclass_numList);

  let [showdetail, setShowdetail] = useState(false);

  let [choicedetail, setChoiceDetail] = useState(null);

  let [content, setContent] = useState();

  let [개강날짜선택하기, set개강날짜선택하기] = useState(false);
  let [승인된사업자목록, set승인된사업자목록] = useState(false);
  let [배너결제하기, set배너결제하기] = useState(false);
  let [예약리스트펼치기, set예약리스트펼치기] = useState(false);
  let [새로운수업등록, set새로운수업등록] = useState(false);
  let [클래스정보수정, set클래스정보수정] = useState(false);
  let [상품판매정책관리, set상품판매정책관리] = useState(false);
  let [상품정보등록, set상품정보등록] = useState(false);
  let [등록된상품조회및관리, set등록된상품조회및관리] = useState(false);

  let infolist = props.reservelist;
  // console.log(props)
  let navi = useNavigate();
  let btn;

  const 개강관리 = () => {
    if (business_numArr === undefined || onedayclassNumList[0] === undefined) {
      alert("현재 사업인증된 원데이클래스 번호가 없습니다.");
      return;
    }
    set개강날짜선택하기(true);
    set클래스정보수정(false);
    set배너결제하기(false);
    set예약리스트펼치기(false);
    set새로운수업등록(false);
    set상품판매정책관리(false);
    set상품정보등록(false);
    setContent("수업 날짜 개설 관리");
  };

  const 나의사업관리 = () => {
    set승인된사업자목록(!승인된사업자목록);
    set클래스정보수정(false);
    set예약리스트펼치기(false);
    set개강날짜선택하기(false);
    set새로운수업등록(false);
    set배너결제하기(false);
    set상품판매정책관리(false);
    set상품정보등록(false);
    setContent("나의사업등록관리");
  };

  const 배너결제 = () => {
    set배너결제하기(!배너결제하기);
    set클래스정보수정(false);
    set승인된사업자목록(false);
    set예약리스트펼치기(false);
    set개강날짜선택하기(false);
    set새로운수업등록(false);
    set상품판매정책관리(false);
    set상품정보등록(false);
    setContent("배너 등록 결제");
  };

  const 등록한클래스정보수정하기 = () => {
    if (business_numArr === undefined || onedayclassNumList[0] === undefined) {
      alert("현재 사업인증된 원데이클래스 번호가 없습니다.");
      return;
    }
    set클래스정보수정(!클래스정보수정);
    set승인된사업자목록(false);
    set예약리스트펼치기(false);
    set개강날짜선택하기(false);
    set새로운수업등록(false);
    set배너결제하기(false);
    set상품판매정책관리(false);
    set상품정보등록(false);
    setContent("클래스 정보 수정");
  };

  const 예약리스트로가기 = () => {
    if (business_numArr === undefined || onedayclassNumList[0] === undefined) {
      alert("현재 사업인증된 원데이클래스 번호가 없습니다.");
      return;
    }
    set예약리스트펼치기(true);
    set승인된사업자목록(false);
    set개강날짜선택하기(false);
    set새로운수업등록(false);
    set클래스정보수정(false);
    set배너결제하기(false);
    set상품판매정책관리(false);
    set상품정보등록(false);
    set등록된상품조회및관리(false);
    setContent("예약자 정보 조회");
  };

  const 나의수업개설 = () => {
    set새로운수업등록(true);
    set승인된사업자목록(false);
    set개강날짜선택하기(false);
    set예약리스트펼치기(false);
    set클래스정보수정(false);
    set배너결제하기(false);
    set상품판매정책관리(false);
    set상품정보등록(false);
    set등록된상품조회및관리(false);
    setContent("새로운 수업 등록");
  };

  const 상품판매정책등록 = () => {
    set상품판매정책관리(true);
    set새로운수업등록(false);
    set승인된사업자목록(false);
    set개강날짜선택하기(false);
    set예약리스트펼치기(false);
    set클래스정보수정(false);
    set배너결제하기(false);
    set상품정보등록(false);
    set등록된상품조회및관리(false);
    setContent("상품 판매정책 등록");
  };

  const 상품판정보를등록 = () => {
    set상품정보등록(true);
    set상품판매정책관리(false);
    set새로운수업등록(false);
    set승인된사업자목록(false);
    set개강날짜선택하기(false);
    set예약리스트펼치기(false);
    set클래스정보수정(false);
    set배너결제하기(false);
    set등록된상품조회및관리(false);
    setContent("상품판정보를 등록");
  };

  const 등록된상품관리 = () => {
    set등록된상품조회및관리(true);
    set상품정보등록(false);
    set상품판매정책관리(false);
    set새로운수업등록(false);
    set승인된사업자목록(false);
    set개강날짜선택하기(false);
    set예약리스트펼치기(false);
    set클래스정보수정(false);
    set배너결제하기(false);
    setContent("등록된 상품조회및관리");
  };
  return (
    <>
      <MyPageAllWrapper
        className="myPageAllWrapper"
        예약리스트펼치기={예약리스트펼치기}
        새로운수업등록={새로운수업등록}
      >
        <div className="LeftAllwrapper">
          <TeacherManagerHeader vmatch={"true"}></TeacherManagerHeader>

          <ul>
            <li onClick={나의사업관리}>
              <a>나의수업승인현황</a>
            </li>
            <li id="last" onClick={나의수업개설}>
              <a>새로운 수업등록</a>
            </li>
            <li onClick={배너결제}>
              <a>배너 등록결제</a>
            </li>
            <li onClick={등록한클래스정보수정하기}>
              <a>등록한 클래스 정보 수정</a>
            </li>
            <li onClick={개강관리}>
              <a>수업 날짜 개설 관리</a>
            </li>
            <li onClick={예약리스트로가기}>
              <a>예약내역 리스트</a>
            </li>

            <li onClick={상품판매정책등록}>
              <a>상품판매 정책등록</a>
            </li>
            <li onClick={상품판정보를등록}>
              <a>상품판정보 등록</a>
            </li>
            <li onClick={등록된상품관리}>
              <a>등록된상품조회및관리</a>
            </li>
          </ul>
        </div>

        {showdetail ? (
          <>
            <DetailMypage
              showdetail={showdetail}
              choicedetail={choicedetail}
            ></DetailMypage>
            {/* <DetailMypage infolist={infolist} choicedetail={choicedetail}></DetailMypage>    */}
          </>
        ) : (
          <>
            <div className="RightAllwrapper">
              {content != undefined ? (
                <>
                  <div className="contentWrapper">{content}</div>
                </>
              ) : (
                <></>
              )}

              {승인된사업자목록 ? (
                <>
                  <MyBusinessListCompo></MyBusinessListCompo>
                </>
              ) : (
                <></>
              )}

              {배너결제하기 ? (
                <>
                  <PayforBannerCompo></PayforBannerCompo>
                </>
              ) : (
                <></>
              )}

              {예약리스트펼치기 ? (
                <>
                  <ReserveListComPo></ReserveListComPo>
                </>
              ) : (
                <></>
              )}
              {새로운수업등록 ? (
                <>
                  <MyBusinessCreateClassCompo
                    prop1={set승인된사업자목록}
                    prop2={set클래스정보수정}
                    prop3={set예약리스트펼치기}
                    prop4={set개강날짜선택하기}
                    prop5={set새로운수업등록}
                    prop6={set배너결제하기}
                    prop7={setContent}
                  ></MyBusinessCreateClassCompo>
                </>
              ) : (
                <></>
              )}
              {클래스정보수정 ? (
                <>
                  <UpdateClassInfoModal></UpdateClassInfoModal>
                </>
              ) : (
                <></>
              )}
              {개강날짜선택하기 ? (
                <>
                  <CalandarComPo></CalandarComPo>
                </>
              ) : (
                <></>
              )}
              {상품판매정책관리 && (
                <>
                  <ProductPolicyCompo></ProductPolicyCompo>
                </>
              )}

              {상품정보등록 && (
                <>
                  <ProductInfoCompo></ProductInfoCompo>
                </>
              )}
              {등록된상품조회및관리 && (
                <ProductSearchAndUpdateCompo></ProductSearchAndUpdateCompo>
              )}
            </div>
          </>
        )}
      </MyPageAllWrapper>
    </>
  );
};
