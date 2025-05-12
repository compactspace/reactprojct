import { useCookies } from "react-cookie";
import { MasterLeftBar } from "../component/pages/Master/MasterLeftBar";
import { MastderRight } from "../component/pages/Master/MastderRight";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MasterPageAllWrapper = styled.div`
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
    & .contentWrapper {
      font-size: 40px;
      padding-top: 30px;
      padding-bottom: 30px;
    }

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

export const MasterPage = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }
  let navi = useNavigate();
  const [cookies, setCookie] = useCookies(["role"]); // 쿠키 훅 주의:

  useEffect(() => {
    if (cookies.role != "master") {
      alert("권한이 없습니다.");
      localStorage.clear();
      // 전체 쿠키 삭제 (리렌더링을 보장하며 상태 업데이트)
      Object.keys(cookies).forEach((cookieName) => {
        setCookie(cookieName, undefined, {
          expires: new Date(0),
          path: "/",
        });
      });

      navi("/");
    }
  }, []);

  return (
    <>
      {cookies?.role === "master" && (
        <MasterPageAllWrapper>
          <MasterLeftBar></MasterLeftBar>
          <MastderRight></MastderRight>
        </MasterPageAllWrapper>
      )}
    </>
  );
};
