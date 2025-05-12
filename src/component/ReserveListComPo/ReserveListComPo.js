import styled from "styled-components";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { setOnedayclass_numList } from "../../store/manageMentSlice/manageMentSlice";
import { useDispatch } from "react-redux";
import { ReserveListApi } from "../../api/reserveListApi/ReserveListApi";

const 예약리스트올래퍼 = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  gap: 22px;

  & .rowBox {
    display: flex;
  }

  // select=selector 와 .selectLable 의 폰트와 라인헤이트는 한쌍으로 기억해라 수동 보정을 해야함...
  & select {
    display: block;
    font-size: 20px;
  }

  & .selector {
    display: block;
    font-size: 20px;
    width: 170px;
  }

  & .selectLable {
    font-size: 20px;
    line-height: 22px;
    margin-right: 10px;
    width: 120px;
  }

  & .nowDatearea {
    display: flex;
    color: #2189ff;
  }
  & .nowDate {
    font-size: 20px;
    line-height: 56px;
  }
  & .samedateCss {
    font-size: 35px;
    padding-left: 10px;
    padding-right: 10px;
  }

  & .headerwarea {
    min-height: 110px;
    max-height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-color: #fafafa;
    border: 1.5px solid #fafafa;
  }

  & .cutline {
    color: #fff;
    background: #2189ff;
    height: 70px;
    align-items: center;
    display: flex;
    justify-content: center;

    & .cutlinecontent {
      width: 90%;
      display: flex;
      justify-content: space-between;
    }
  }

  & .reservelistarea {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & .eachlistarea {
      display: flex;
      justify-content: space-between;
      background-color: #fafafa;
      border: 1.5px solid #fafafa;

      & .samecontentcss {
        display: flex;
        flex-direction: column;
        width: 200px;
        height: 100px;
        color: #333;
        font-weight: 600px;
        & .header {
          padding: 10px 10px;
          text-align: center;
          height: 10%;
        }

        & .content {
          padding: 10px 10px;
          height: 90%;
          text-align: center;
        }
      }
    }
  }
`;

export const ReserveListComPo = () => {
  let today = new Date();
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜
  const onedayclassNumList = useSelector((state) => state.onedayclass_numList);

  useEffect(() => {
    console.log("현재 onedayclass_numList 상태:", onedayclassNumList);
  }, [onedayclassNumList]); // 상태가 변경될 때마다 실행

  const dispatch = useDispatch();

  const [nowDate, setNowDate] = useState(
    year + "-" + month.toString().padStart(2, "0")
  );
  const [searchKeyword, setSearchKeyword] = useState({
    onedayclass_num: onedayclassNumList[0].onedayclass_num,
    openday: year + "-" + month.toString().padStart(2, "0"),
  });

  const [preventNowDate, setPreventNowDate] = useState(
    year + "-" + month.toString().padStart(2, "0")
  );

  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  if (month.length == 1) {
    month = "0" + month;
  }

  let [선택한날짜, set선택한날짜] = useState(null);
  console.log("date ", date, " date.length:  ", date.toString().length);
  if (date.toString().length == 1) {
    date = "0" + date;
  }

  let 오늘년월일 = year + "-" + month;

  //   console.log("오늘년월일 ", 오늘년월일);

  let [예약자객체배열, set예약자객체배열] = useState(null);

  useEffect(() => {
    let data = {
      openday: nowDate,
      onedayclass_num: onedayclassNumList[0].onedayclass_num,
    };

    //또 자바스크립트의 한박자 느린 버그있을듯
    if (오늘년월일 == undefined) {
      alert("새로고침해주세용");
      return;
    }

    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/teacher/getTheReservelist`, data, { headers })
      .then((res) => {
        let 예약자배열객체 = res.data;
        set예약자객체배열(예약자배열객체);
        set선택한날짜(오늘년월일);
        // console.log(예약자배열객체);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let 선택한날;
  let [선택한날상태, set선택한날상태] = useState(null);
  const 날짜체인지 = () => {
    선택한날 = document.getElementById("date").value;
    set선택한날상태(선택한날);
  };

  const 선택한날짜로조회 = () => {
    if (
      searchKeyword.openday == "" ||
      searchKeyword.openday == undefined ||
      searchKeyword.openday == null
    ) {
      alert("날짜를 먼저 선택해주세요");
      return;
    }

    let data = searchKeyword;

    let headers = { "content-type": "application/json" };

    axios
      .post(`http://${IP}:4000/teacher/getTheReservelist`, data, { headers })
      .then((res) => {
        let 예약자배열객체 = res.data;

        set예약자객체배열(예약자배열객체);
        set선택한날짜(오늘년월일);
        console.log(예약자배열객체);
        isFirstRef.current = true;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;

    console.log(`name: ${name}  value: ${value}`);

    // 상태를 업데이트할 때, 기존 상태를 복사하고 새로운 값은 name에 해당하는 키에 넣어줍니다.
    setSearchKeyword((prev) => ({
      ...prev,
      [name]: value, // name에 해당하는 필드에 value를 업데이트
    }));
  };

  const selectHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const onedayclass_num = selectedOption.getAttribute("data-var");
    console.log("onedayclass_num-var 값:", onedayclass_num);

    const box = { ...searchKeyword };
    box.onedayclass_num = onedayclass_num;

    setSearchKeyword(box);
  };

  const isFirstRef = useRef(true);

  useEffect(() => {
    // 비동기 함수 정의
    const fetchReserveList = async () => {
      try {
        const res = await ReserveListApi(searchKeyword); // API 호출
        let 예약자배열객체 = res.data; // API에서 받은 데이터
        console.log(res); // 콘솔에 응답 로그
        set예약자객체배열(예약자배열객체); // 상태 업데이트
      } catch (error) {
        console.error("API 호출 중 오류:", error); // 에러 핸들링
      }
    };

    // 비동기 함수 호출
    fetchReserveList();
    isFirstRef.current = true;
  }, [searchKeyword]);

  const isFirstMonthRef = useRef(true);
  useEffect(() => {
    if (isFirstMonthRef.current) {
      isFirstMonthRef.current = false;
      return;
    }
    isFirstRef.current = false;
    console.log(nowDate);
    setSearchKeyword((preve) => ({
      ...preve,
      ["openday"]: nowDate,
    }));
  }, [nowDate]);

  const 년월건별예약자 = (e) => {
    const dataVal = e.target.dataset.val; // data-val 속성 값 가져오기
    //   console.log(dataVal); // 출력: 'back' 또는 'next'
    if (dataVal === "back") {
      let m = nowDate.split("-")[1];
      let 일의자리가영이니 = m[0] === 0;

      let today = new Date();
      let year = today.getFullYear(); // 현재 연도
      let newM;
      // console.log(`m[1]: ${m[1]}`);
      if (!일의자리가영이니) {
        if (parseInt(m[0]) === 0 && parseInt(m[1]) === 1) {
          let lastYearDecember = new Date(year - 1, 11, 1); // 전년도 12월 1일로 설정
          // 전년도 12월에서 년도와 월을 추출
          let lastYear = lastYearDecember.getFullYear();
          let lastMonth = lastYearDecember.getMonth() + 1; //

          setNowDate(lastYear + "-" + lastMonth.toString().padStart(2, "0"));
          // console.log(`왓1`);
        } else {
          let currentYears = nowDate.split("-")[0];

          if (parseInt(m[0]) != 0 && parseInt(m[1]) === 0) {
            newM = parseInt(m) - 1;
            if (newM.toString.length === 1) {
              newM = "0" + newM;
            }
            console.log(`newM: ${newM}`);
            setNowDate(currentYears + "-" + newM);
            return;
          }

          newM = m[0] + (parseInt(m[1]) - 1);
          // console.log(`newM: ${newM}`);
          setNowDate(currentYears + "-" + newM);
        }
      } else {
        //
      }
    } else {
      let m = nowDate.split("-")[1];
      //자바 스크립트는 문자열을 배열처럼 가져올수있음
      let 일의자리가영이니 = m[0] === "0";

      let today = new Date();
      let year = today.getFullYear(); // 현재 연도
      let newM;
      console.log(`일의자리가영이니: ${일의자리가영이니} m[0]: ${m[0]}`);
      if (!일의자리가영이니) {
        //12월일시 년도가 바뀌어야한다.
        //  console.log(`왓1`);
        if (m[1] === 2) {
          let newtoday = new Date(year + 1, 0, 1);
          let newyear = newtoday.getFullYear(); // 현재 연도
          let newMonth = newtoday.getMonth();
          newM = newMonth;
          //  console.log(`newM: ${newM}`);
          setNowDate(newtoday + "-" + newM);
          return;
        }
        newM = parseInt(m) + 1;

        setNowDate(year + "-" + newM);
        //  console.log(`왓2`);
        return;
      } else {
        //십의자리가 9 인경우
        console.log(`일의자리가 0 인경우`);
        if (m[1] === 9) {
          newM = parseInt(m[1]) + 1;
          console.log(`십의자리가9인경우  ${newM}`);
          setNowDate(year + "-" + newM);
        } else {
          newM = "0" + (parseInt(m[1]) + 1);
          console.log(`십의자리가9아님 ${newM}`);

          setNowDate(year + "-" + newM);
        }
      }
    }
  };

  return (
    <>
      <예약리스트올래퍼 className="reservelistAllWrapper">
        <div className="nowDatearea ">
          <div
            className="backdate samedateCss"
            data-val="back"
            onClick={(e) => {
              년월건별예약자(e);
            }}
          >
            &lt;
          </div>
          <div
            className="nowdate"
            style={{
              fontSize: "30px",
              lineHeight: "53px",
            }}
          >
            {nowDate}월 예약자정보
          </div>
          <div
            className="nextdate samedateCss"
            data-val="next"
            onClick={(e) => {
              년월건별예약자(e);
            }}
          >
            &gt;
          </div>
        </div>

        <div className="headerwarea">
          <div className="onedayclassList">
            <div className="rowBox">
              <div className="selectLable">클래스 선택</div>
              <select
                className="selector"
                name="onedayclass_num"
                onChange={(e) => {
                  selectHandler(e);
                }}
              >
                {onedayclassNumList.map((data) => {
                  return (
                    <>
                      <option
                        value={data.onedayclass_num}
                        data-var={data.onedayclass_num}
                      >
                        {data.onedayclass_name}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="rowBox">
            <div className="selectLable">검색날짜 선택</div>

            <input
              type="date"
              className="selector"
              id="date"
              name="openday"
              onChange={(e) => {
                inputHandler(e);
              }}
            />
            {/* <input
                type="text"
                placeholder="핸드폰번호"
                className="sameinputcss"
                id="phone"
              /> */}
          </div>

          {/*
            추후 검색 조건에 연락처를 넣고 싶다면 해라
          <div className="rowBox">
            <div className="selectLable">연락쳐 입력</div>

            <input
                type="text"
                placeholder="핸드폰번호"
                className="sameinputcss"
                id="phone"
              /> 
          </div> */}
        </div>

        <div className="cutline">
          <div className="cutlinecontent">
            <div>
              {선택한날짜 == null ? (
                <>--조회중입니다.--</>
              ) : (
                <>선택한 날짜 {nowDate} 조회 검색 결과</>
              )}
            </div>
            <div onClick={선택한날짜로조회}>조회하기</div>
          </div>
        </div>

        <div className="reservelistarea">
          {예약자객체배열 == null ? (
            <>
              <span>해당 날짜의 예약건이 없습니다.</span>
            </>
          ) : (
            예약자객체배열.map((obj, idx) => {
              let 결제년월일 = obj.application_day
                .split("T")[0]
                .replace("T", "");
              let 결제시간 = obj.application_day.split("T")[1].split(".")[0];

              return (
                <div className="eachlistarea">
                  <div className="samecontentcss">
                    <div className="header"> 예약자명</div>
                    <div className="content"> {obj.reserve_name}</div>
                  </div>
                  <div className="samecontentcss">
                    <div className="header">연락쳐</div>
                    <div className="content"> {obj.reserve_tell}</div>
                  </div>
                  <div className="samecontentcss">
                    <div className="header">이용완료</div>
                    <div className="content"> {obj.reserve_using}</div>
                  </div>
                  <div className="samecontentcss">
                    <div className="header">결제일</div>
                    {/* 결제한날이 신청한날이 되니깐. */}
                    <div className="content">
                      {" "}
                      {결제년월일 + "-" + 결제시간}
                    </div>
                  </div>
                  <div className="samecontentcss">
                    <div className="header">수강일</div>
                    <div className="content"> {obj.openday}</div>
                  </div>
                </div>
              );
            })
          )}
          {예약자객체배열 != null && 예약자객체배열.length == 0 ? (
            <>
              <span>해당 날짜의 예약건이 없습니다.</span>
            </>
          ) : (
            <></>
          )}

          <div className="cutlinecontent"></div>
        </div>
      </예약리스트올래퍼>
    </>
  );
};
