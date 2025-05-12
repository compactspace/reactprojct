import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { setTargetMenu } from "../../../store/masterSlice/masterSlice";
export const CardBoxArea = styled.div`
  display: flex;
  flex-direction: column;

  height: 200px;
  border-bottom: 1px solid #ebebeb;
  & .cardBtn {
    display: flex;
    justify-content: space-around;
  }

  & .imgarea {
    height: 80%;
    width: 100%;
  }
`;

export const MasterLeftBar = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }
  let navi = useNavigate();
  let dispatch = useDispatch();

  const { targetMenu, MenuName } = useSelector((state) => state.ManuSelect);
  const [cookies, setCookie, removeCookie] = useCookies();
  // useEffect(() => {
  //   console.log(`targetMenu: ${targetMenu}   MenuName: ${MenuName}`);
  // }, [targetMenu, MenuName]);

  ///setTargetMenu

  const ManuChoice = (manuName) => {
    dispatch(setTargetMenu(manuName));
  };

  return (
    <div className="LeftAllwrapper">
      <CardBoxArea className="CardBoxArea">
        <div class="cardBtnArea">
          <div className="cardImage">
            <img className="imgarea" src="phoneicon/phonemainicon.png"></img>
          </div>
          <div className="cardBtn">
            <div
              id="myinfobtn"
              onClick={() => {
                navi("/management");
              }}
            >
              MasterHome
            </div>

            <div
              onClick={() => {
                axios.get(`http://${IP}:4000/user/logout`).then((res) => {
                  if (res.data.logoutstatuscode == 1) {
                    localStorage.clear();
                    // 전체 쿠키 삭제 (리렌더링을 보장하며 상태 업데이트)
                    Object.keys(cookies).forEach((cookieName) => {
                      setCookie(cookieName, undefined, {
                        expires: new Date(0),
                        path: "/",
                      });
                    });
                    alert("로그아웃 하셨습니다.");

                    navi("/");

                    return;
                  }
                });
              }}
            >
              로그아웃
            </div>
          </div>
        </div>
      </CardBoxArea>
      <ul>
        <li
          onClick={() => {
            ManuChoice("신청 사업자 승인관리");
          }}
        >
          신청 자업자 관리
        </li>
        <li
          onClick={() => {
            ManuChoice("배너등록 승인관리");
          }}
        >
          배너등록 승인관리
        </li>
        <li
          onClick={() => {
            ManuChoice("배너등록 기간조회");
          }}
        >
          배너등록 신청현황
        </li>
      </ul>
    </div>
  );
};
