import Calendar from "react-calendar";
import axios from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export const 검색조건레퍼 = styled.div`
  display: flex;
  margin-bottom: 10px;

  & #select {
    font-size: 20px;
    height: 50px;
  }
`;

const 달력올레퍼 = styled.div`
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
`;

const 개강등마감올레퍼 = styled.div`
  box-shadow: 0 0 17px 3px rgb(171 171 171 / 50%);

  background-color: #fff !important;

  & .managerWrapper {
    gap: 100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 0px 10px;

    & .managerheaderarea {
      color: rgb(255, 121, 126);
      font-weight: 800;
      font-size: 20px;
      line-height: 41px;
    }

    & .managerbodyarea {
      display: flex;
      flex-direction: column;
      height: 300px;
      justify-content: space-between;

      & .openningstatusarea {
        display: flex;
        flex-direction: column;
        background: #ff5862;
        border-radius: 7px;
        padding: 20px 6px;
        font-style: normal;
        font-weight: 800;
        font-size: 14px;
        line-height: 18px;
        text-align: center;
        color: #ffffff;
      }

      & .choicedayarea {
        display: flex;
        flex-direction: column;
        background: #8094ff;
        border-radius: 7px;
        padding: 20px 6px;
        font-style: normal;
        font-weight: 800;
        font-size: 14px;
        line-height: 18px;
        text-align: center;
        color: #ffffff;
      }

      & #openandclose {
        display: flex;
        justify-content: space-between;

        & .detailarea {
          display: flex;
          flex-direction: column;
          background: #ff5862;
          border-radius: 7px;
          padding: 20px 6px;
          font-style: normal;
          font-weight: 800;
          font-size: 14px;
          line-height: 18px;
          text-align: center;
          color: #ffffff;
        }

        & .btnarea {
          display: flex;
          flex-direction: column;
          background: #8094ff;
          border-radius: 7px;
          padding: 20px 6px;
          font-style: normal;
          font-weight: 800;
          font-size: 14px;
          line-height: 18px;
          text-align: center;
          color: #ffffff;
        }
      }
    }
  }
`;

export const CalandarComPo = () => {
  let [개강등상태, set개강등상태] = useState(null);

  const onedayclassNumList = useSelector((state) => state.onedayclass_numList);

  const [관리대상원데이클래스번호, set관리대상원데이클래스번호] = useState(
    onedayclassNumList[0]?.onedayclass_num
  );
  // 'yyyy-mm-dd' 형식으로 초기화
  const [nowDate, setNowDate] = useState(getFormattedDate(new Date()));

  // 해당 년-월-일 에 개강 중인 년-월-일 날짜를 담고있는 배열
  const [nowDateOpenList, setNoewDateOpenList] = useState();

  const isLoading = useRef(true);

  const [rest, setRest] = useState(1);

  // 날짜를 'yyyy-mm-dd' 형식으로 반환하는 함수
  function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}`;
  }

  let navi = useNavigate();

  useEffect(() => {
    if (onedayclassNumList === undefined) {
      alert("사업승인 대기중입니다.");

      navi("/management");
    }

    try {
      axios
        .post(`http://${IP}:4000/teacher/getOpenningClassList`, searchKeyword)
        .then((res) => {
          //여기서 상태 객체 저장하고 isopenning 여부로 개강중 마감중 으로 한다.
          console.log(res.data);
          const currentMontOpenList = res.data.currentMontOpenList;

          if (currentMontOpenList === undefined) {
            setNoewDateOpenList(undefined);
          } else {
            setNoewDateOpenList(res.data.currentMontOpenList);
          }
        });
    } catch (error) {
      console.error("API 호출 중 오류:", error); // 에러 핸들링
    }
  }, []);

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let [searchKeyword, setSearchKeyword] = useState({
    onedayclass_num: onedayclassNumList[0]?.onedayclass_num,
    openningday: nowDate,
  });
  // 업데이트 모달
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  // 인설트 모달
  const [insertModalOpen, setInsertModalOpen] = useState(false);

  let [개강상태DB, set개강상태DB] = useState(new Object());
  //   useEffect(() => {
  //     //또 씨발 복잡헌게 다음 달 버튼 누르면 현재 유즈 이펙트가 아래 이벤트 등록을 캐치못함 씨발.
  //     //let 넥스트버튼= document.getElementsByClassName("react-calendar__navigation__arrow react-calendar__navigation__next-button")

  //     let 달력날짜버튼 = document.getElementsByClassName(
  //       "react-calendar__tile react-calendar__month-view__days__day"
  //     );

  //     let managerheader = document.getElementById("managerheaderarea");

  //     for (let k = 0; k < 달력날짜버튼.length; k++) {
  //       달력날짜버튼[k].addEventListener("click", (e) => {
  //         //이게 이벤트가 너무 협소하게 들어가서 null경우가 있어 막아버림
  //         if (e.target.getAttribute("aria-label") == null) {
  //           return;
  //         }

  //         let 날짜 = e.target.getAttribute("aria-label");

  //         console.log("날짜:   ", 날짜);

  //         let data = { openningday: 날짜 };
  //         let headers = { "content-type": "application/json" };

  //         //역시 이벤트가 너무 협소하게 들어가서 널이라면 리턴처리
  //         set개강등상태(날짜);
  //         if (날짜 == null) {
  //           alert("다시 시도해주세요");
  //         }

  //         axios
  //           .post(`http://${IP}:4000/teacher/showmanagerinfo`, data, { headers })
  //           .then((res) => {
  //             console.log(res.data);
  //             let 개강상태코드 = res.data.openningstatuscode;
  //             let deep = { ...개강상태DB };
  //             deep.openningday = 날짜;
  //             if (개강상태코드 == -1) {
  //               deep.isopenning = "no";
  //               set개강상태DB(deep);
  //             } else {
  //               deep.isopenning = "yes";
  //               set개강상태DB(deep);
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       });
  //     }
  //   }, []);

  //   useEffect(() => {
  //     console.log(searchKeyword);
  //     axios
  //       .post(`http://${IP}:4000/teacher/getOpenningClassList`, searchKeyword)
  //       .then((res) => {
  //         //여기서 상태 객체 저장하고 isopenning 여부로 개강중 마감중 으로 한다.
  //         console.log(res.data.currentMontOpenList);
  //       });
  //   }, [searchKeyword]);

  const GoOpenClass = () => {
    console.log(
      `개강할 날짜: ${개강상태DB.openningday}  개강할 원데이클래스번호: ${관리대상원데이클래스번호}`
    );
    let data = {
      openningday: 개강상태DB.openningday,
      onedayclass_num: 관리대상원데이클래스번호,
    };

    let headers = { "content-type": "application/json" };
    axios
      .post(`http://${IP}:4000/teacher/goopnenclass`, data, { headers })
      .then((res) => {
        console.log(res.data);
        let 개강성공코드 = res.data.updatestatuscode;
        let deep = { ...개강상태DB };
        if (개강성공코드 == -1) {
          deep.isopenning = "no";
          set개강상태DB(deep);
        } else {
          deep.isopenning = "yes";
          set개강상태DB(deep);
        }
      });
  };

  const GoCloseClass = () => {
    console.log("클릭날찌:  ", 개강상태DB.openningday);
    let data = { openningday: 개강상태DB.openningday, classclose: "close" };
    let headers = { "content-type": "application/json" };
    axios
      .post(`http://${IP}:4000/teacher/goopnenclass`, data, { headers })
      .then((res) => {
        console.log(res.data);
        let 개강성공코드 = res.data.updatestatuscode;
        let deep = { ...개강상태DB };

        if (개강성공코드 == -1) {
          deep.isopenning = "yes";
          set개강상태DB(deep);
        } else {
          deep.isopenning = "no";
          set개강상태DB(deep);
        }
      });
  };

  const selectHandler = (e) => {
    const { name, value } = e.target;

    console.log(`name: ${name} value: ${value}`);

    const box = { ...searchKeyword };
    box.onedayclass_num = value;

    setSearchKeyword(box);
  };

  const isFirstRef = useRef(true);

  useEffect(() => {
    if (isFirstRef.current) {
      console.log("여기서 문제일듯");
      isFirstRef.current = false;
      return;
    }

    console.log(searchKeyword);

    // 비동기 함수 정의
    const fetchReserveList = async () => {
      try {
        await axios
          .post(`http://${IP}:4000/teacher/getOpenningClassList`, searchKeyword)
          .then((res) => {
            //여기서 상태 객체 저장하고 isopenning 여부로 개강중 마감중 으로 한다.

            setNoewDateOpenList(res.data.currentMontOpenList);
            isLoading.current = true;
          });
      } catch (error) {
        console.error("API 호출 중 오류:", error); // 에러 핸들링
      }
    };

    // 비동기 함수 호출
    fetchReserveList();
    // isFirstRef.current = true;
  }, [searchKeyword]);

  const isFirstMonthRef = useRef(true);
  useEffect(() => {
    if (isFirstMonthRef.current) {
      isFirstMonthRef.current = false;
      return;
    }
    isFirstRef.current = false;
    console.log(`nowDate찍고, ${nowDate}`);
    setSearchKeyword((preve) => ({
      ...preve,
      ["openningday"]: nowDate,
    }));
  }, [nowDate]);

  const handlePrevMonth = () => {
    const date = new Date(nowDate); // 문자열을 Date 객체로 변환
    date.setMonth(date.getMonth() - 1); // 이전 달로 이동
    isLoading.current = false;
    setNowDate(getFormattedDate(date)); // 'yyyy-mm-dd' 형식으로 상태 업데이트
  };

  const handleNextMonth = () => {
    const date = new Date(nowDate); // 문자열을 Date 객체로 변환
    date.setMonth(date.getMonth() + 1); // 다음 달로 이동
    isLoading.current = false;
    setNowDate(getFormattedDate(date)); // 'yyyy-mm-dd' 형식으로 상태 업데이트
  };

  const tileContent = ({ date }) => {
    console.log(nowDateOpenList);
    // yyyy-mm-dd 형식
    const formatDate = date.toLocaleDateString("en-CA");

    let 개강중정보;

    if (nowDateOpenList === undefined || nowDateOpenList.length === 0) {
      return (
        <div
          onClick={(e) => {
            toggleModal(개강중정보, "close", formatDate);
          }}
        >
          마감
        </div>
      );
    }
    //    console.log("첫이프믄");
    // console.log(nowDateOpenList);

    const isOpenningDate =
      nowDateOpenList.find((item) => item.openningday === formatDate) !==
      undefined;

    개강중정보 = nowDateOpenList.find((item) => {
      if (item.openningday === formatDate) {
        //  console.log("찾은 항목:", JSON.stringify(item)); // 조건을 만족하는 항목 출력
        return true; // 조건을 만족할 때 true 반환
      }
      return false; // 조건을 만족하지 않으면 false 반환
    });

    if (!isOpenningDate) {
      return (
        <div
          onClick={(e) => {
            toggleModal(개강중정보, "close", formatDate);
          }}
        >
          마감
        </div>
      );
    }
    return (
      <div
        onClick={async (e) => {
          await toggleModal(개강중정보, "open", formatDate);
        }}
      >
        개강중
      </div>
    );
  };

  const formatDateRef = useRef();

  // 업데이트 또는 최초 개설 모달 여닫는
  const toggleModal = async (개강중정보, 개강중이니, formatDate) => {
    if (개강중이니 === "open") {
      await 개강및남은자리리턴함수(개강중정보);
      setUpdateModalOpen(!updateModalOpen);
    } else {
      formatDateRef.current = formatDate;
      setInsertModalOpen(!insertModalOpen);
    }
  };

  const 개강및남은자리리턴함수 = async (개강중정보) => {
    const { openningclass_num } = 개강중정보;

    await axios
      .post(`http://${IP}:4000/teacher/getRestCount`, {
        openningclass_num: openningclass_num,
      })
      .then((res) => {
        console.log(res.data.reserveCount);
      });
  };
  const InputHandler = (e) => {
    const { name, value } = e.target;
    setRest(value);
  };

  const 최초개강함수 = async () => {
    const res = await axios.post(
      `http://${IP}:4000/teacher/checkPaymentForBanne`,
      {
        onedayclass_num: searchKeyword.onedayclass_num,
      }
    );

    const { paymentStatus } = res.data;
    // alert(`paymentStatus:  ${paymentStatus}`);
    if (paymentStatus === -1) {
      alert("수업 등록을 위해  \n 배너등록 결제를 먼저 하셔야합니다.");
      return;
    }

    const bodyData = {
      openningday: formatDateRef.current,
      onedayclass_num: searchKeyword.onedayclass_num,
      rest: rest,
    };

    await axios
      .post(`http://${IP}:4000/teacher/insertOpenningclass`, bodyData)
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <>
      <검색조건레퍼 class="searchWrapper">
        <div>
          <select
            id="select"
            name="onedayclass_num"
            onChange={(e) => {
              selectHandler(e);
            }}
          >
            {onedayclassNumList.map((data) => {
              return (
                <>
                  <option value={data.onedayclass_num}>
                    {data.onedayclass_name}
                  </option>
                </>
              );
            })}
          </select>
        </div>
      </검색조건레퍼>
      <달력올레퍼>
        <div className="schedul">
          <div className="custom-arrows">
            <button onClick={handlePrevMonth}>◀️</button>
            <button onClick={handleNextMonth}>▶️</button>
          </div>
          <Calendar
            //onChange={setNowDate}
            value={nowDate}
            prevLabel={""} // 기본 왼쪽 화살표 제거
            nextLabel={""} // 기본 오른쪽 화살표 제거
            tileContent={tileContent}
          />
          <div className="restseat">
            <div className="restseats">
              <div></div>
              <div className="one"></div>
            </div>
            <div className="restseats">
              <div className="two"></div>
            </div>
            <div className="restseats">
              <div className="three"></div>
            </div>
          </div>
        </div>
      </달력올레퍼>

      <개강등마감올레퍼>
        <div className="managerWrapper">
          <div className="managerheaderwrapper">
            <div className="managerheaderarea" id="managerheaderarea">
              {개강등상태 == null ? (
                <>
                  <div>관리하실 날짜를 선택하세요</div>
                </>
              ) : (
                <>
                  <div>관리하실 날짜 :{개강등상태}</div>
                </>
              )}
            </div>
          </div>
          {개강등상태 == null ? (
            <></>
          ) : (
            <>
              <div className="managerbodywrapper">
                <div className="managerbodyarea">
                  <div className="samecss">
                    <div className="openningstatusarea">
                      {개강상태DB.isopenning == "no" ? (
                        <>
                          <div>상태: 해당 날짜는 개강 하지 않으셨습니다.</div>
                        </>
                      ) : (
                        <>
                          <div>상태: 해당 날짜는 개강중 입니다.</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="samecss">
                    <div className="choicedayarea">
                      선택하신 날짜 : {개강상태DB.openningday}
                    </div>
                  </div>
                  <div className="samecss" id="openandclose">
                    <div className="detailarea">Detail</div>
                    <div className="btnarea">
                      {개강상태DB.isopenning == "no" ? (
                        <>
                          <div className="goopenclass" onClick={GoOpenClass}>
                            개강하기
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="goopenclass" onClick={GoCloseClass}>
                            마감하기
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </개강등마감올레퍼>
      {/* 모달이 열릴 때만 나타나도록 조건부 렌더링 */}
      {!insertModalOpen && updateModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>수업 개강 관리</h2>

            <div>
              <label>현재상태:</label>
              <input type="text" />
            </div>

            <div>강진행중인 날짜:</div>

            <div>현재 남은 자리:</div>

            <div>
              <button>마감하기</button>
              <button>남은자리 수정</button>
              <button
                onClick={() => {
                  setUpdateModalOpen(false);
                  setInsertModalOpen(false);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 최초 개강이다. */}
      {!updateModalOpen && insertModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2>수업개강 하기</h2>
            <div>
              <label>개강하실 날짜:{formatDateRef.current}</label>
            </div>

            <div>
              <label>인원수 선택:</label>
              <input
                type="number"
                name="rest"
                value={rest}
                min={1}
                max={100}
                onChange={InputHandler}
              />
            </div>

            <div>
              <button
                onClick={() => {
                  최초개강함수();
                }}
              >
                확인
              </button>

              <button
                onClick={() => {
                  setRest(1);
                  setUpdateModalOpen(false);
                  setInsertModalOpen(false);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// 모달 스타일
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

// 모달 콘텐츠 스타일
const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  width: "300px",
  textAlign: "center",
};
