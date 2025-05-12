import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
// import {changeauthtoken} from '../store/store'
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";

export const HeaderWrapper = styled.div`
  width: 100%;
`;

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

export const CenterColNav = styled.div`
  /* background-color: black; */

  height: 50px;
`;

export const Alert = styled.div`
  position: fixed;
  top: 75px;
  width: 50%;
  right: -1600px;
  z-index: 22;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: right 1s;

  & h3 {
    text-align: center;
    margin: 0px 0px;
  }

  &.aleropen {
    right: 0px;
  }

  & .alertarea {
    display: flex;
    flex-direction: column;
    padding: 10px 10px;

    & .alertlist {
      padding: 10px 10px;

      & .alerttarget {
        display: flex;
        width: 100%;
        justify-content: space-between;

        & .alertconfirm {
          display: flex;
          justify-content: space-between;
          width: 100px;
          & div {
          }
        }
      }
    }
  }
`;

export const TeacherManagerHeader = (props) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }
  const [cookies, setCookie, removeCookie] = useCookies();
  const location = useLocation();

  // console.log(location );

  let navi = useNavigate();
  useEffect(() => {}, [location]);

  return (
    <>
      <>
        <HeaderWrapper className="HeaderWrapper">
          <CardBoxArea className="CardBoxArea">
            <div class="cardBtnArea">
              <div className="cardImage">
                <img
                  className="imgarea"
                  src="phoneicon/phonemainicon.png"
                ></img>
              </div>
              <div className="cardBtn">
                <div
                  id="myinfobtn"
                  onClick={() => {
                    navi("/management");
                  }}
                >
                  ManageHome
                </div>

                <div
                  onClick={() => {
                    axios
                      .get(`http://${IP}:4000/teacher/logout`)
                      .then((res) => {
                        if (res.data.logoutstatuscode == 1) {
                          console.log(
                            "로그아웃 성공은 1:  " + res.data.logoutstatuscode
                          );
                          alert("로그아웃 하셨습니다.");
                          localStorage.clear();
                          Object.keys(cookies).forEach((cookieName) => {
                            setCookie(cookieName, undefined, {
                              expires: new Date(0),
                              path: "/",
                            });
                          });

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
        </HeaderWrapper>
      </>
    </>
  );
};
