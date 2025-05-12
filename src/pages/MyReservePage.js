import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";

const MyReservePageAllWrapper = styled.div`
  display: flex;
  flex-direction: column;
  img {
    display: block;
    max-height: 200px;
    min-height: 200px;
    max-width: 270px;
    min-width: 270px;
  }

  & .rowBox {
    display: flex;
  }

  & .colBox {
    display: flex;
    flex-direction: column;
  }

  & .cartArea {
    display: flex;
    flex-direction: column;
    gap: 10px;
    & .productInfoArea {
      background-color: #fff;
      border: 2px solid #f5f7fa;
      display: grid;
      grid-template-rows: 240px 160px;
      max-height: 400px;
      min-height: 400px;
    }
  }

  & .NbtnCss {
    line-height: 45px;
    width: 90px;
    font-size: 20px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
    text-align: center;
    background-color: #ff5862;
    color: #fff;
  }

  & .YbtnCss {
    line-height: 45px;
    width: 90px;
    font-size: 20px;
    height: 40px;
    color: #fff;
    text-align: center;
    background-color: #8094ff;
    border-radius: 10px 10px 10px 10px;
  }

  & .btnArea {
    margin-top: 10px;
    font-size: 30px;
  }
`;

export const MyReservePage = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [cPage, setCPage] = useState(0);
  const [myReserveList, setMyReserveList] = useState(null);
  const [myReserveFullSize, setMyReserveFullSize] = useState(0);

  const [search, setSearch] = useState({
    enterence: "fisrt",
    cPage: 0,
  });

  useEffect(() => {
    searchMyReserve(search);
  }, [search]);

  const searchMyReserve = async (search) => {
    await axios
      .post(`http://${IP}:4000/user/reservemypage`, search)
      .then((res) => {
        let { myReserveList, myReserveFullSize } = res.data;

        if (myReserveFullSize != undefined) {
          console.log(
            `10개 단위 페이지 갯수: ${Math.ceil(myReserveFullSize / 10)}`
          );
          setMyReserveFullSize(Math.ceil(myReserveFullSize / 10));
        }
        setMyReserveList(myReserveList);
      })
      .catch((err) => {
        console.log("뭔가망");
      });
  };

  const calCulNext = (cPage) => {
    console.log(`cPage:  ${cPage}   myReceiptFullCnt: ${myReserveFullSize}`);

    setCPage(cPage);
    let box = { ...search };
    box.enterence = "no";
    box.cPage = parseInt(cPage) * 10;
    setSearch(box);
    setMyReserveFullSize(myReserveFullSize);
  };

  const toKoreanKSTForm = (ISO) => {
    // 한국 시간으로 포맷

    const date = new Date(ISO.replace(" ", "T")); // T 붙이면 ISO형식
    const formatted = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    }).format(date);

    return formatted;
  };

  return (
    <MyReservePageAllWrapper>
      {cPage >= myReserveFullSize - 1 && (
        <div className="rowBox" style={{ justifyContent: "center" }}>
          <button
            className="NbtnCss"
            onClick={() => {
              calCulNext(cPage - 1);
            }}
          >
            -
          </button>
        </div>
      )}

      <div className="cartArea">
        {myReserveList != null &&
          myReserveList.length != 0 &&
          myReserveList.map((item, idx) => {
            return (
              <div key={item.uc_product_num} className="productInfoArea">
                <div className="rowBox">
                  <div className="productImage">
                    <img src={item.reserve_img} />
                  </div>
                  <div className="colBox" style={{ gap: "20px" }}>
                    <div className="rowBox">
                      <div style={labelName}>클래스명:</div>
                      <div style={labelTarget}>{item.onedayclass_name}</div>
                    </div>
                    <div className="rowBox">
                      <div style={labelName}>예약자명:</div>
                      <div style={labelTarget}>{item.reserve_name}</div>
                    </div>
                    <div className="rowBox">
                      <div style={labelName}>결재일:</div>
                      <div style={labelTarget}>
                        {toKoreanKSTForm(item.application_day)}
                      </div>
                    </div>

                    <div className="rowBox">
                      <div style={labelName}>예약 당시 가격:</div>
                      <div style={labelTarget}>{item.onedayclass_price}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!(cPage === myReserveFullSize - 1) && (
        <div className="rowBox" style={{ justifyContent: "center" }}>
          <button
            className="YbtnCss"
            onClick={() => {
              calCulNext(cPage + 1);
            }}
          >
            +
          </button>
        </div>
      )}
    </MyReservePageAllWrapper>
  );
};
const labelName = {
  width: "250px",
  fontSize: "20px",
  color: "#212121",
  textAlign: "center",
};

const labelTarget = {
  maxWidth: "300px",
  fontSize: "20px",
  textAlign: "center",
};

const refundlabelName = {
  width: "250px",
  fontSize: "18px",
  color: "#212121",
  textAlign: "left",
};

const refundlabelTarget = {
  maxWidth: "350px",
  fontSize: "18px",
  textAlign: "left",
  color: " #555555",
};

const cutline = {
  width: "100%",
  lineHeight: "5px",
  marginTop: "10px",
  background: "#ebebeb",
  height: "2px",
  fontSize: "25px",
  textAlign: "center",
};
