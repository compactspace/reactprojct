import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const PossibleCalendarWrapper = styled.div`
  & .monthChangeWrapper {
    display: flex;
    font-size: 20px;
    margin-left: 10px;
    font-size: 20px;
    max-width: 200px;
    width: 120px;
    justify-content: space-between;
  }

  & .possibleCalendarArea {
    display: flex;
    flex-direction: column;
  }

  & .possibleMonthRow1 {
  }

  & .possibleArray {
    display: flex;
    max-height: 300px;
    height: 180px;
  }

  & .possibleArrayItem {
    display: flex;
    flex-direction: column;
    gap: 20px;
    text-align: center;
    justify-content: space-around;
  }
  & button {
    display: block;
    border: none;
    border-radius: 10px 10px 10px 10px;
    text-align: end;
    background-color: #ff5862;
    color: #fff;
    display: flex;
    align-items: center;
  }
  & h3 {
    color: #ff5862;
  }
  & .btnArea {
    display: flex;
    justify-content: space-around;
  }

  & .rest {
    color: #fff;
    background-color: #8094ff;
    border-radius: 10px 10px 10px 10px;
  }
`;

// 뭐가 유리 할까?
// 솔직히 가능한 날만 보여주면 될듯

// 그리고 월단위 페이징도, 단 월단위 페이징은
//현재 오는 년월일 정보를 다 가져온뒤 따로 호출하도록 하자.
export const DateAndCal = ({ onSend }) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [possibleReserveList, setPossibleReserveList] = useState(undefined);

  const localDate = new Date().toISOString().split("T")[0]; // ← ISO 포맷으로 변환
  const [nowDate, setNoewDate] = useState(localDate);

  const { id } = useParams();

  const 년월리턴함수 = (nowDate) => {
    // console.log(nowDate);

    const date = new Date(nowDate);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 1월 = 0 → 보정
    const dd = String(date.getDate()).padStart(2, "0");

    const nowforYyyyMm = `${yyyy}-${mm}`;
    // console.log(nowforYyyyMmDd); // ✅ "2025-04-11"

    return nowforYyyyMm;
  };

  useEffect(() => {
    let openday = 년월리턴함수(nowDate);

    console.log(`openday:  ${openday}`);

    // 주의 해야 할건 오는 년월 기준으로 가져와야한다.
    axios
      .post(`http://${IP}:4000/noneuser/rest`, {
        onedayclass_num: id,
        openday: openday,
      })
      .then((res) => {
        // console.log(res.data.possibleReserveList);

        const {
          currentMonthOpenningList,
          currentMonthOpenningFullsize,
          possibleMessage,
        } = res.data;

        if (currentMonthOpenningFullsize === 0) {
          alert("해당월은 개강중인 내용이 없습니다.");
          return;
        }
        setPossibleReserveList(currentMonthOpenningList);

        const fullDate = currentMonthOpenningList[0].openday;
        //console.log(`fullDate:  ${fullDate}`);
        const formYyyyMmDd = fullDate.split("T")[0];
        const localDate = new Date(formYyyyMmDd); // ← ISO 포맷으로 변환
        //  console.log(localDate);

        if (possibleMessage != undefined && possibleMessage === -1) {
          alert(
            "죄송합니다 \n 선생님의 사정으로 해당일의 수업은 마감이 되었습니다."
          );
        }
      });
  }, [nowDate]);

  const nextMonth = (e) => {
    changeNowDate("next");
  };

  const changeNowDate = (mesaage) => {
    if (mesaage === "next") {
      const nowYear = new Date(nowDate).getFullYear();
      const nowMonth = new Date(nowDate).getMonth() + 1; // 💡 0~11

      if (nowMonth === "12") {
        alert("예약인 해당 년도 범위 에서만 가능합니다.");
        return;
      }
      //  console.log(`배열 인덱스처럼 월은 하나 작은 값을 가져옴  nowMonth  ${nowMonth}`);

      //   const nextDate = new Date(nowYear, nowMonth + 1); // 다음 달 생성
      const nextMonthStr = String(nowMonth + 1).padStart(2, "0");

      // console.log(`nextMonthStr: ${nextMonthStr}`);
      const nextDate = new Date(nowYear, nextMonthStr);

      //   console.log(nextDate.toISOString().split("T")[0]);

      setNoewDate(nextDate.toISOString().split("T")[0]);
    }
  };

  const [list, setList] = useState(null);
  useEffect(() => {
    if (possibleReserveList === undefined || possibleReserveList.length === 0) {
      return;
    }

    setList(CalendarUI(0, 7));
    setBtnList(btnUi());
  }, [possibleReserveList]);

  const CalendarUI = (st, ed) => {
    let possibleArr = paginCalCul(st, ed);

    // console.log(possibleArr);
    const WEEKDAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];

    return (
      <>
        <div className="possibleCalendarArea">
          <div className="monthChangeWrapper">
            <div> &lt;</div>
            <div className="">{new Date(nowDate).getMonth()}월 예약</div>
            <div
              onClick={(e) => {
                nextMonth(e);
              }}
            >
              &gt;
            </div>
          </div>

          <div>
            {
              <div className="possibleArray">
                {possibleArr.map((item, idx) => {
                  const date = new Date(item.openday);
                  const day = WEEKDAYS_KR[date.getDay()];
                  const dateStr = date.toISOString().split("T")[0];
                  const 일 = dateStr.split("-")[2];
                  return (
                    <div
                      onClick={() => {
                        //console.log(`dateStr: ${dateStr}`);
                        onSend(dateStr);
                      }}
                      className="possibleArrayItem"
                      key={idx}
                      style={{ padding: "8px", borderBottom: "1px solid #eee" }}
                    >
                      <div>{day}요일</div>
                      <div>{일}</div>
                      <div className="rest">{item.rest}자리 남음</div>
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </div>
      </>
    );
  };

  const PAGE_SIZE = 7; // 7일씩 보여주기

  const [stPageNum, setStPageNum] = useState(0);
  const [edPageNum, setEdPageNum] = useState(PAGE_SIZE);
  const [currentPageData, setCurrentPageData] = useState([]);

  const paginCalCul = (st, ed) => {
    //  console.log(`stPageNum: ${stPageNum}   edPageNum: ${edPageNum}`);
    //계속 강조하지만 해당 년월의 모든 정보를 담은 배열의 길이다.
    const fullLength = possibleReserveList.length;
    const safeEd = Math.min(ed, fullLength);
    const pagedArr = possibleReserveList.slice(st, safeEd);

    // console.log(
    //   `받은 시작 st: ${st}  받은 종료  ed: ${ed}   전체 길이 fullLength: ${fullLength}`
    // );
    setStPageNum(st);
    setEdPageNum(safeEd);
    setCurrentPageData(pagedArr);
    // console.log(pagedArr);

    return pagedArr;
  };

  const handlePrev = () => {
    //alert(`stPageNum: ${stPageNum}`);
    // if (stPageNum === 0) {
    //   alert(`처음 페이지 입니다.`);
    //   return;
    // }

    const newStart = Math.max(stPageNum - PAGE_SIZE, 0);
    const newEnd = newStart + PAGE_SIZE;
    setList(CalendarUI(newStart, newEnd));
  };

  const handleNext = () => {
    const fullLength = possibleReserveList.length;

    if (edPageNum >= fullLength) return; // 더 이상 다음 페이지 없음

    const newStart = stPageNum + PAGE_SIZE;
    const newEnd = newStart + PAGE_SIZE;
    setList(CalendarUI(newStart, newEnd));
  };

  const [btnList, setBtnList] = useState();

  const btnUi = () => {
    console.log(
      `비티엔유아이  stPageNum: ${stPageNum}   edPageNum: ${edPageNum}`
    );
    return (
      <>
        <div className="btnWrapper">
          <div className="btnArea">
            {stPageNum >= 0 && <button onClick={handlePrev}>이전</button>}
            {edPageNum < possibleReserveList.length && (
              <button onClick={handleNext}>다음</button>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <PossibleCalendarWrapper>
        {list !== undefined && list}
        {btnList !== undefined && btnList}
      </PossibleCalendarWrapper>
    </>
  );
};
