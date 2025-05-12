import { useState, useEffect, useRef } from "react";

import axios from "axios";
import styled from "styled-components";
import { GeneralModal } from "../component/pages/Master/MasterMenuCompo/MasterBusinessCompo";

const MyReceiPtPageAllWrapper = styled.div`
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

// 정책을 내새운다.

//  최근 6개월 이내의  결재내역만을 가져오고, 여기어때  성님들도 이상한 월별/일별 조회 따위는 없다
// 그냥 결재 기준으로만 페이징 하고 내림차순으로

export const ReceiptPage = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [cPage, setCPage] = useState(0);
  const [myReceiptList, setMyReceiptList] = useState(null);
  const [ReceiptFullCnt, setMyReceiptFullCnt] = useState(0);


  const [search, setSearch] = useState({
    enterence: "fisrt",
    limitSt: 0,
  });

  useEffect(() => {
    searchMyReceiptFnc();
  }, [search]);

  const searchMyReceiptFnc = async () => {
    await axios.post(`http://${IP}:4000/user/myreceipt`, search).then((res) => {
      let { myReceiptList, myReceiptFullCnt } = res.data;

      console.log(`myReceiptFullCnt:  ${myReceiptFullCnt}`);

      if (myReceiptFullCnt != undefined) {
        console.log(
          `10개 단위 페이지 갯수: ${Math.ceil(myReceiptFullCnt / 10)}`
        );
        setMyReceiptFullCnt(Math.ceil(myReceiptFullCnt / 10));
      }

      if (myReceiptList != undefined && myReceiptList.length > 0) {
        setMyReceiptList(myReceiptList);
      }
    });
  };

  const firstREf = useRef(true);

  useEffect(() => {
    console.log(`cPage: ${cPage}`);
    console.log(`myReceiptFullCnt: ${ReceiptFullCnt}`);
    if (ReceiptFullCnt === 0) return;

    if (firstREf.current && ReceiptFullCnt > 0) {
      //   calCulNext(cPage);
      firstREf.current = false;
    }
  }, [ReceiptFullCnt]);

  const calCulNext = (cPage) => {
    console.log(`cPage:  ${cPage}   myReceiptFullCnt: ${ReceiptFullCnt}`);

    setCPage(cPage);

    let box = { ...search };
    box.enterence = "no";
    box.limitSt = parseInt(cPage) * 10;
    setSearch(box);
    setMyReceiptFullCnt(ReceiptFullCnt);
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
    <>
      <MyReceiPtPageAllWrapper>
        {cPage >= ReceiptFullCnt - 1 && (
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
          {myReceiptList != undefined &&
            myReceiptList.length != 0 &&
            myReceiptList.map((item, idx) => {
              return (
                <div key={item.uc_product_num} className="productInfoArea">
                  <div className="rowBox">
                    <div className="productImage">
                      <img src={item.uc_product_mainImage} />
                    </div>
                    <div className="colBox" style={{ gap: "20px" }}>
                      <div className="rowBox">
                        <div style={labelName}>상품명:</div>
                        <div style={labelTarget}>{item.uc_product_name}</div>
                      </div>
                      <div className="rowBox">
                        <div style={labelName}>결재일:</div>
                        <div style={labelTarget}>
                          {toKoreanKSTForm(item.payment_createAt)}
                        </div>
                      </div>

                      <div className="rowBox">
                        <div style={labelName}>구매 했을시 개당 가격:</div>
                        <div style={labelTarget}>{item.uc_product_price}</div>
                      </div>

                      <div className="rowBox">
                        <div style={labelName}>구매시 수량</div>
                        <div style={labelTarget}>{item.row_total_quantity}</div>
                      </div>

                      <div className="rowBox">
                        <div style={labelName}>구매 했을시 수량대비 가격:</div>
                        <div style={labelTarget}>{item.row_total_price}</div>
                      </div>
                    </div>
                  </div>
                  <div className="rowBox">
                    <div className="colBox" style={{ width: "100%" }}>
                      <div className="colBox">
                        <div className="cutline" style={cutline}></div>
                        <div style={{ fontSize: "24px" }}>환불정책 안내</div>
                        <div className="rowBox">
                          <div style={refundlabelName}>환불가능:</div>
                          <div style={refundlabelTarget}>
                            {item.possible_refund_message}
                          </div>
                        </div>

                        <div className="rowBox">
                          <div style={refundlabelName}>환불불가:</div>
                          <div style={refundlabelTarget}>
                            {item.refund_impossible_cuz}
                          </div>
                        </div>
                      </div>
                      <div className="rowBox"></div>
                    </div>
                  </div>
                  {/* <div className="colBox btnArea">
                    <div className="quantity rowBox">
                      <div
                        className="minus"
                        onClick={(e) => {
                          quantityHandler(e, idx);
                        }}
                      >
                        <div className="NbtnCss minus">-</div>
                      </div>
                      <div>수량: {payparamInfo[idx].quantity}</div>
                      <div
                        className="plus"
                        onClick={(e) => {
                          quantityHandler(e, idx);
                        }}
                      >
                        <div className="YbtnCss plus">+</div>
                      </div>
                    </div>
                    <div className="quantityPrice">
                      수량대비가격:{payparamInfo[idx].cart_target_price}
                    </div>

                    <div
                      className="rowBox"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div
                        className="eachPurchace"
                        onClick={() => {
                          eachPurchaceFnc(idx);
                        }}
                      >
                        구매
                      </div>
                      <div
                        className="eachDelete"
                        onClick={() => {
                          eachDeleteFnc(카트가가지고있던수량[idx]);
                        }}
                      >
                        삭제
                      </div>
                    </div>
                  </div> */}
                </div>
              );
            })}
        </div>

        {!(cPage === ReceiptFullCnt - 1) && (
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
      </MyReceiPtPageAllWrapper>
    </>
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
