import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
// import {changeauthtoken} from '../store/store'
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { ShortCartPage } from "../pages/ShortCartPage";

export const HeaderWrapper = styled.div`
  border-bottom: ${(props) => {
    if (props.myinfobtn) {
      return "1px solid #ebebeb";
    } else {
      return "none";
    }
  }};

  z-index: 92;
  position: ${(props) => {
    if (props.myreservepage) {
      return "relative";
    } else {
      return "fixed";
    }
  }};

  height: 75px;
  width: 100%;
  top: 0;
  left: 0;
  background-color: ${(props) => {
    if (props.vmatch == "true") {
      return "white";
    } else {
      return "";
    }
  }};
`;

export const HeaderGrid = styled.div`
  ${(props) =>
    props.match == "true"
      ? css`
          width: 90%;
          margin: 0 auto;
          display: grid;
          grid-template-rows: 100%;
          grid-template-columns: auto 180px;
          align-items: center;
        `
      : css`
          width: 90%;
          margin: 0 auto;
          display: grid;
          grid-template-rows: 100%;
          grid-template-columns: 40% auto 180px;
          align-items: center;
        `}
`;

export const LeftCol = styled.div`
  ${(props) =>
    props.headerfont == "black"
      ? css`
          & #logoutcss {
            color: black;
            padding-bottom: 3px;
            font-weight: 600;
            text-decoration: none;
            font-size: 18px;
          }
        `
      : css`
          & #logoutcss {
            border: none;
            background-color: transparent;
            font-size: 18px;
            color: ${(props) => {
              if (props.vmatch == "true") {
                return "black";
              } else {
                return "rgb(255, 255, 255)";
              }
            }};
          }
        `}

  height: 50px;
  ${(props) =>
    props.match == "true"
      ? css`
          background-color: yellow;
          display: none;
        `
      : css`
          /* background-color: red; */
          display: block;
        `}
`;

export const CenterColNav = styled.div`
  /* background-color: black; */

  height: 50px;
`;

export const Navul = styled.ul`
  width: 100%;
  display: inline-block;

  ${(props) =>
    props.match == "true"
      ? css`
          padding: 0;
        `
      : css``}
`;

export const Navulli = styled.li`
  .findoutclass {
    background-image: linear-gradient(256deg, #8094ff 30%, #ff5862);
  }

  ${(props) =>
    props.vmatch == "true"
      ? css`
          & a {
            color: black;
            padding-bottom: 3px;
            font-weight: 600;
            text-decoration: none;
            font-size: 18px;
          }
        `
      : css``};

  ${(props) =>
    props.vmatch == "true"
      ? css`
          display: inline-block;
          margin-left: 30px;
          li {
            color: black;

            padding-bottom: 3px;
            font-weight: 600;
            text-decoration: none;
            font-size: 18px;
          }
        `
      : css`
          display: inline-block;
          margin-left: 30px;
          > a {
            color: rgb(255, 255, 255);

            padding-bottom: 3px;
            font-weight: 600;
            text-decoration: none;
            font-size: 18px;
          }
        `}
`;

export const RightCol = styled.div`
  height: 50px;
  & .RigthNavul {
    display: flex;

    & #mycart {
      /* background-image: url('icon/carticon.png');    
    background-repeat: no-repeat;
    background-size: contain; */
    }

    & .mypagewrapper {
      & .mypagearea {
        /* 버튼 클릭시에만 blockㅇ,로 바꾼다. */

        ${(props) =>
          props.myinfobtn
            ? css`
                display: block;
              `
            : css`
                display: none;
              `}

        max-width: 320px;
        position: absolute;
        //위치 확인용 강제 height 임
        //height: 100vh;

        background-color: white;

        width: 320px;
        right: 130px;
        border-radius: 4px 4px 4px 4px;
      }

      //인포박스
      & .myinfoarea {
        width: 320px;
      }

      & .myinfobox {
        padding-top: 12px;
        padding-left: 16px;
        padding-right: 16px;
      }

      & .myreservearea {
        /* padding-top: 6px;
    padding-bottom: 6px;
    border-top-width: 1px;     */
        /* border-color: rgb(245 245 245 / var(--tw-border-opacity)); */
      }

      & a {
        display: flex;
        width: 100%;
        font-size: 0.875rem;
        line-height: 1.25rem;
        letter-spacing: 0px;
        font-weight: 500;
      }

      & .mylist {
        padding: 12px 16px;
      }

      /* 주의! 스크롤 내릴씨 여기다가 프롭스로 폰트 컬러를 블랙으로 맞추어 줄것 */

      ${(props) =>
        props.headerfont == "black"
          ? css`
              & #myinfobtn {
                color: black;
                padding-bottom: 3px;
                font-weight: 600;
                text-decoration: none;
                font-size: 18px;
              }
            `
          : css`
              & #myinfobtn {
                border: none;
                background-color: transparent;
                font-size: 18px;
                color: ${(props) => {
                  if (props.vmatch == "true") {
                    return "black";
                  } else {
                    return "rgb(255, 255, 255)";
                  }
                }};
              }
            `}

      & #myalertinfobtn {
        display: inline-block;
        position: relative;
      }

      & #actionSheet {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        transition: 1s;

        /* 서서히 나타나는 효과 */
        visibility: hidden;
        opacity: 0;
      }

      & #actionSheet.active {
        /* 서서히 나타나는 효과 */
        visibility: visible;
        opacity: 1;
      }

      & .action-options {
        background-color: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        /* 세로 컨텐츠가 늘어나는 경우 스크롤이 생기도록 설정 */
        overflow: auto;

        max-height: 300px;
        /* 아래에서 위로 나타나는 효과, max-height과 동일하게 작성 */
        position: relative;
        bottom: -300px;

        transition: 1s;
      }
      & #actionSheet.active .action-options {
        /* 아래에서 위로 나타나는 효과, max-height과 동일하게 작성 */
        bottom: 0;
      }

      & .option {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        & .confirm {
          width: 100px;
          display: flex;
          justify-content: space-between;
        }
      }

      & .close {
        text-align: center;
      }

      & .option:hover {
        background-color: #f2f2f2;
      }
    }
  }
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

const CartPageAllWrapper = styled.div`
  top: 0px;
  left: 0px;
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: rgba(210, 212, 217, 0.9);
  z-index: 100;
  & .leftarea {
    width: 75%;
  }

  & .rigtharea {
    min-width: 600px;
    background-color: #f3f3f3;
    display: flex;

    flex-direction: column;
    justify-content: space-between;

    //빵
    & .topandbottom {
      display: flex;

      flex-direction: column;

      & .headerarea {
        padding-top: 20px;

        display: flex;

        justify-content: space-between;
        /* line-height:51.25em; */
        font-size: 25px;
        color: #1f1f1f;

        & > div {
          padding: 20px 20px;
        }
      }

      & .pricearea {
        display: flex;

        flex-direction: column;

        & .totalpricearea {
          justify-content: space-between;
          display: flex;
        }
        & .totalamountarea {
          justify-content: space-between;
          display: flex;
        }

        & .samecssprice {
          padding: 20px 20px;
        }
      }

      & .proinfoarea {
        display: flex;
        flex-direction: column;
        gap: 20px;

        & .contentbox {
          background: #fcfcfc;
          display: flex;

          & .imgcontent {
            width: 20%;
            padding: 20px 20px;

            & img {
              width: 100%;
            }
          }

          & .infocontent {
            width: 80%;
            display: flex;
            flex-direction: column;
            padding: 20px 20px;
          }

          & .delete {
            display: flex;
            justify-content: end;

            & .delimg {
              width: 50px;
              height: 50px;
            }
          }
        }
      }
    }

    & .payoralldelarea {
      display: flex;
      flex-direction: column;
      background: #fcfcfc;
      gap: 20px;

      & .payorcanclesamecss {
        height: 25%;
        width: 80%;
        background-color: #f3f3f3;
        margin: 0 auto;
        border-radius: 20px 20px 20px 20px;
        text-align: center;
        font-size: 20px;
      }
    }
  }
`;

export const Header = (props) => {
  let [카트열기, set카트열기] = useState(false);

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const STATE = "flase";

  const location = useLocation();

  // console.log(location );

  let navi = useNavigate();
  useEffect(() => {}, [location]);

  const [cookies, setCookie, removeCookie] = useCookies();

  //장바구니 테이블 귀찮으니 우선 쿠키에 뭔갈 저장해보자. 아니면 레디스에 있는걸 빼오자.

  let [장바구니리스트, set장바구니리스트] = useState(null);
  let [총가격과총수량, set총가격과총수량] = useState(new Object());
  // useEffect(() => {

  //     let data = { "userid": cookies.userid };
  //     let headers = { "content-type": "application/json" }

  //     axios.post(`http://${IP}:4000/user/showcartlist`, data, headers)
  //         .then((res) => {

  //             let { cartStatusCode, proList } = res.data

  //             if (cartStatusCode == -1) {
  //                 set장바구니리스트(null);
  //                 return;

  //             }

  //             let totalprice = 0;
  //             let totalamount = proList.length;

  //             for (let i = 0; i < proList.length; i++) {

  //                 totalprice = +parseInt(proList[0].proPrice);

  //             }

  //             let deep = { ...총가격과총수량 }
  //             deep.totalprice = totalprice;
  //             deep.totalamount = totalamount;

  //             console.log("총가격:   ", totalprice, "  총물건 수량 :   ", totalamount)

  //             if (totalamount == 0) {
  //                 set장바구니리스트(null);
  //             } else {
  //                 set장바구니리스트(proList);
  //             }

  //             set총가격과총수량(deep);

  //         })

  // }, [카트열기])

  //페이지 진입시 뒤로 앞으로 가기 새로고침등
  // 토큰이 유효한지 보고 유효기간 지나면 재발급 해주는 거임 잠시 주석처리하자
  //필요 없은거 같기도 함
  // useEffect(() => {
  //     axios.get("http://localhost:4000/authuser",{headers : {token:authtoken}}).then((
  //         result) => {

  //     let newaccessToken=result.data.newaccessToken;
  //     console.log(newaccessToken)
  //     if(newaccessToken!=null){
  //         localStorage.setItem("token",newaccessToken);
  //         dispatch(changeauthtoken(true));
  //         console.log("다른페이지 다녀오면..또 풀려있네")
  //     }

  //     }).catch((err) => {
  //         dispatch(changeauthtoken(false));

  //     })

  // },[])

  // let autho = useSelector((state) => { return state.authtoken});
  // console.log(autho)

  //  console.log(authtoken)

  let [버릴때상품코드, set버릴때상품코드] = useState(null);
  const 상품버리기 = (e) => {
    console.log(e.target.getAttribute("value"));

    let proCode = e.target.getAttribute("value");

    let data = { proCode: proCode, userid: cookies.userid };
    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/user/delpro`, data, { headers })
      .then((res) => {
        console.log(res.data);
        let { delStatusCode } = res.data;

        if (delStatusCode == 1) {
          alert("장바구니에서 \n 버렸습니다.");

          axios
            .post(`http://${IP}:4000/user/showcartlist`, data, headers)
            .then((res) => {
              let { cartStatusCode, proList } = res.data;

              if (cartStatusCode == -1) {
                set장바구니리스트(null);
                return;
              }

              let totalprice = 0;
              let totalamount = proList.length;

              for (let i = 0; i < proList.length; i++) {
                totalprice = +parseInt(proList[0].proPrice);
              }

              let deep = { ...총가격과총수량 };
              deep.totalprice = totalprice;
              deep.totalamount = totalamount;

              console.log(
                "총가격:   ",
                totalprice,
                "  총물건 수량 :   ",
                totalamount
              );

              if (totalamount == 0) {
                set장바구니리스트(null);
              } else {
                set장바구니리스트(proList);
              }

              set총가격과총수량(deep);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <HeaderWrapper
        vmatch={props.vmatch}
        myinfobtn={props.myinfobtn}
        myreservepage={props.myreservepage}
        className="HeaderWrapper"
      >
        <HeaderGrid match={props.match} className="HeaderGrid">
          <LeftCol
            vmatch={props.vmatch}
            match={props.match}
            headerfont={props.headerfont}
            className="LeftCol"
          >
            {cookies.userid == null ? (
              <>
                <Navul>
                  <Navulli vmatch={props.vmatch} className="Navulli">
                    <a
                      onClick={() => {
                        navi("/login");
                      }}
                    >
                      로그인하기
                    </a>
                  </Navulli>
                </Navul>
              </>
            ) : (
              <>
                <Navul>
                  <Navulli
                    vmatch={props.vmatch}
                    className="Navulli"
                    headerfont={props.headerfont}
                  >
                    <a
                      id="logoutcss"
                      onClick={() => {
                        axios
                          .get(`http://${IP}:4000/user/logout`)
                          .then((res) => {
                            if (res.data.logoutstatuscode == 1) {
                              localStorage.clear();
                              // 전체 쿠키 삭제 (리렌더링을 보장하며 상태 업데이트)
                              Object.keys(cookies).forEach((cookieName) => {
                                setCookie(cookieName, undefined, {
                                  expires: new Date(0),
                                  path: "/",
                                });
                              });
                              return;
                            }
                          });
                      }}
                    >
                      로그아웃
                    </a>
                  </Navulli>
                </Navul>
              </>
            )}
          </LeftCol>
          <CenterColNav vmatch={props.vmatch}>
            <Navul match={props.match}>
              {/* <Navulli vmatch={props.vmatch} className='Navulli' >
                            <a href='/'>서비스를소개해요</a>
                        </Navulli>
                        <Navulli vmatch={props.vmatch} className='Navulli' >
                            <a href='/'>새소식</a>
                        </Navulli> */}
              {/* <Navulli vmatch={props.vmatch}>
                            <a href='/'>새소식</a>
                        </Navulli> */}
            </Navul>
          </CenterColNav>
          <RightCol
            vmatch={props.vmatch}
            myinfobtn={props.myinfobtn}
            headerfont={props.headerfont}
            className="RightCol"
          >
            <Navul className="RigthNavul">
              <Navulli
                className="mypagewrapper"
                vmatch={props.vmatch}
                headerfont={props.headerfont}
              >
                {cookies.userid == null ? (
                  <></>
                ) : (
                  <a
                    id="myinfobtn"
                    onClick={() => {
                      navi("/mypage");
                    }}
                  >
                    MyPage
                  </a>
                )}
              </Navulli>
              <Navulli
                className="mypagewrapper"
                vmatch={props.vmatch}
                headerfont={props.headerfont}
              >
                {cookies.userid == null ? (
                  <></>
                ) : (
                  <a
                    id="myinfobtn"
                    onClick={() => {
                      set카트열기(true);
                    }}
                  >
                    MyCart
                  </a>
                )}
              </Navulli>
            </Navul>
          </RightCol>
        </HeaderGrid>
      </HeaderWrapper>

      {카트열기 ? (
        <>
          <CartPageAllWrapper>
            <div className="leftarea"></div>
            <div className="rigtharea">
              <div className="topandbottom">
                <div className="headerarea">
                  <div>구매확인</div>

                  <div
                    onClick={() => {
                      set카트열기(false);
                    }}
                  >
                    X
                  </div>
                </div>
              </div>
              <ShortCartPage></ShortCartPage>
              {/* <div className="payoralldelarea">
                <div className="payorcanclesamecss">결제하기</div>
                <div className="payorcanclesamecss">모두취소</div>
              </div> */}
            </div>
          </CartPageAllWrapper>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

//레디스 전용인듯
{
  /* <CartPageAllWrapper>
<div className="leftarea"></div>
<div className="rigtharea">
  <div className="topandbottom">
    <div className="headerarea">
      <div>구매확인</div>

      <div
        onClick={() => {
          set카트열기(false);
        }}
      >
        X
      </div>
    </div>

    {장바구니리스트 == null ? (
      <>
        <h1>장바구니가 비어있어요</h1>
      </>
    ) : (
      <>
        <div className="pricearea">
          <div className="totalpricearea">
            <div className="samecssprice">소계</div>
            <div className="samecssprice">
              {총가격과총수량.totalprice} 원
            </div>
          </div>
          <div className="totalamountarea">
            <div className="samecssprice">
              합계({총가격과총수량.totalamount})
            </div>

            <div className="samecssprice">
              {총가격과총수량.totalprice}원
            </div>
          </div>
        </div>
      </>
    )}

    <div className="proinfoarea">
      {장바구니리스트 != null ? (
        장바구니리스트.map((obj, idx) => {
          return (
            <>
              <div className="contentbox">
                <div className="imgcontent">
                  <img
                    className="img"
                    src="phoneicon/heartsicon.png"
                  ></img>
                </div>

                <div className="infocontent">
                  <div>특가상품</div>
                  <div>{obj.proName}</div>
                  <div>{obj.proPrice}원</div>
                  <div className="proCode"></div>
                  <div className="delete">
                    <div>
                      <img
                        className="delimg"
                        src="phoneicon/delicon.png"
                        value={`${obj.proCode}`}
                        onClick={(e) => {
                          상품버리기(e);
                        }}
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })
      ) : (
        <></>
      )}
    </div>
  </div>

  <div className="payoralldelarea">
    <div className="payorcanclesamecss">결제하기</div>
    <div className="payorcanclesamecss">모두취소</div>
  </div>
</div>
</CartPageAllWrapper> */
}
