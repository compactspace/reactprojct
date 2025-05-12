import styled from "styled-components";
import axios from "axios";
import { useState, useEffect } from "react";

export const ManagerSearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & .searchMode {
    display: flex;
    width: 250px;
    justify-content: space-between;
    margin-bottom: 10px;

    & .Mode {
      font-size: 20px;
      width: 100px;
      padding: 5px 5px;
      border-radius: 10px 10px 10px 10px;
      text-align: center;
    }
    & .shrot {
      background-color: #ff5862;
      color: #fff;
    }
    & .detail {
      color: #fff;
      background-color: #8094ff;
    }
  }

  & .shortsearchArea {
    border: 1px solid #ebebeb;
    width: 100%;
    height: 100px;
  }

  & .shortSearcyTitle {
    font-size: 30px;
    margin-bottom: 10px;
  }

  & .selectArea {
    display: flex;
    font-size: 23px;
    justify-content: space-between;

    & .title {
      width: 200px;
      text-align: center;
    }
    & .titleSelect {
      width: 110px;
    }
  }

  & select {
    display: block;
    font-size: 23px;
  }
  & .searcherArea {
    display: flex;
  }

  & .BtnMode {
    font-size: 20px;
    width: 100px;
    padding: 5px 5px;
    border-radius: 10px 10px 10px 10px;
    text-align: center;
    color: #fff;
    background-color: #8094ff;
    line-height: 21px;
    margin-left: 10px;
  }
`;

export const ManagerBannerSearchCompo = ({
  menuTitleName,
  setsearchType,
  searchType,
}) => {
  //간편 검색을 위한 현재 년월을 기점으로 1년 전까지의 년월을 담을 상테값 배열
  const [montDate, setMontDate] = useState([]);
  const defaultDate = new Date();
  const defaultYear = defaultDate.getFullYear();
  const defaultMonth = String(defaultDate.getMonth() + 1).padStart(2, "0");
  const [choiceDate, setChocieDate] = useState(
    defaultYear + "-" + defaultMonth
  );
  const [choiceStatus, setChoiceStatus] = useState("no");

  useEffect(() => {
    const now = new Date();
    const monthList = [];

    for (let i = 0; i < 12; i++) {
      // i개월 전
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      monthList.push(`${year}-${month}`);
    }

    setMontDate(monthList); // 원하면 상태로 저장
  }, []);

  const dateHandler = (e) => {
    const { name, value } = e.target;

    console.log(value);

    setChocieDate(value);
  };

  const confirmHandler = (e) => {
    const { name, value } = e.target;

    setChoiceStatus(value);
  };

  // searchType을 건드리긴 하지만, 안 바꾼다면 그냥 현재 값 그대로 사용 가능
  const findSearch = async () => {
    // console.log(`choiceStatus:  ${choiceStatus}   choiceDate: ${choiceDate}`);

    let box = { ...searchType };
    box.promotion_confirm_status = choiceStatus;
    box.max_paid = choiceDate;
    setsearchType(box);
  };

  return (
    <>
      <ManagerSearchWrapper>
        <div className="menuTitleName">
          <h1>{menuTitleName}</h1>
        </div>

        <div className="searchMode">
          <div className="shrot Mode">간편조회</div>
          <div className="detail Mode">상세조회</div>
        </div>
        <div className="shortsearchArea">
          <div className="shortSearcyTitle">간편 신청내역 조회</div>
          <div className="searcherArea">
            <div>
              <div className="selectArea">
                <div className="title">최근 1년기간 선택</div>
                {montDate.length != 0 && (
                  <select className="titleSelect" onChange={dateHandler}>
                    {montDate.map((item, idx) => {
                      return <option>{item}</option>;
                    })}
                  </select>
                )}
              </div>
            </div>

            <div>
              <div className="selectArea">
                <div className="title"> 승인별 선택</div>
                <select className="titleSelect" onChange={confirmHandler}>
                  <option value="no">미승인</option>;
                  <option value="yes">승인</option>;
                </select>
              </div>
            </div>
            {/*그냥 형식상으로 만든다 위 체인지만 변해도 자동검색이 되나 이해못하는 사람들이 많음 */}
            <div className="BtnMode" onClick={findSearch}>
              조회
            </div>
          </div>
        </div>
      </ManagerSearchWrapper>

      
    </>
  );
};
