import { useState, useEffect } from "react";

import { useMediaQuery } from "react-responsive";
import axios from "axios";
import styled from "styled-components";
import { GeneralModal } from "../component/pages/Master/MasterMenuCompo/MasterBusinessCompo";
const ShortCartPageAllWrapper = styled.div`
  display: flex;
  flex-direction: column;
  img {
    display: block;
    max-height: 130px;
    min-height: 130px;
    max-width: 180px;
    min-width: 180px;
  }

  & .rowBox {
    display: flex;
  }

  & .colBox {
    display: flex;
    flex-direction: column;
  }

  & .cartArea {
    height: 800px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    gap: 10px;
    & .productInfoArea {
      display: grid;
      grid-template-rows: 150px 150px;
      background-color: #f5f7fa;
      max-height: 270px;
      min-height: 270px;
    }
  }

  & .NbtnCss {
    line-height: 45px;
    font-size: 20px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
    text-align: center;
    background-color: #ff5862;
    color: #fff;
  }

  & .YbtnCss {
    line-height: 45px;
    font-size: 20px;
    height: 40px;
    color: #fff;
    text-align: center;
    background-color: #8094ff;
    border-radius: 10px 10px 10px 10px;
  }

  & .btnArea {
    margin-top: 10px;
    font-size: 19px;
  }
`;
const SelectPaire = styled.div`
  select {
    display: block;
    font-size: 20px;
    height: 50px;
    width: 100%;
  }

  input {
    display: block;
    font-size: 20px;
    height: 50px;
    width: 100%;
  }

  & .NbtnCss {
    line-height: 45px;
    width: 90px;
    font-size: 20px;
    height: 50px;
    border-radius: 10px 10px 10px 10px;
    text-align: center;
    background-color: #ff5862;
    color: #fff;
  }

  & .YbtnCss {
    line-height: 45px;
    width: 90px;
    font-size: 20px;
    height: 50px;
    color: #fff;
    text-align: center;
    background-color: #8094ff;
    border-radius: 10px 10px 10px 10px;
  }

  & .selectLabel {
    font-size: 20px;
    width: 150px;
    line-height: 50px;
  }

  & .inputLabel {
    font-size: 20px;
    width: 150px;
    line-height: 50px;
  }

  & .rowBox {
    width: 700px;
    display: flex;
  }
`;

export const ShortCartPage = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [payparamInfo, setPayparamInfo] = useState(undefined);
  const [purchaceArr, setPurchaceArr] = useState(undefined);

  const [카트가가지고있던수량, set카트가가지고있던수량] = useState(undefined);
  const [카트담았던시점상품정보, set카트담았던시점상품정보] =
    useState(undefined);
  const [가격보정상품정보, set가격보정상품정보] = useState(undefined);

  const [paygoModal, setPaygoModal] = useState(false);

  const [deleteTriger, setDeleteTriger] = useState(0);

  useEffect(() => {
    axios.get(`http://${IP}:4000/user/myCartList`).then((res) => {
      const { oldSelectListMyCart, oldProductInfoList, currentProductInfo } =
        res.data;
      //   console.log(myCartList);
      //   console.log(currentProductInfo);
      set카트가가지고있던수량(oldSelectListMyCart);
      set카트담았던시점상품정보(oldProductInfoList);
      set가격보정상품정보(currentProductInfo);

      console.log(currentProductInfo);

      setPurchaceArr(new Array(oldProductInfoList.length));

      let 임시배열 = [];
      for (let k = 0; k < oldProductInfoList.length; k++) {
        let box = {
          cart_num: oldSelectListMyCart[k]?.cart_num,
          packing_cart_num: oldSelectListMyCart[k]?.packing_cart_num,
          quantity: oldSelectListMyCart[k]?.quantity,
          cart_target_price:
            parseInt(oldSelectListMyCart[k]?.quantity) *
            parseInt(currentProductInfo[k]?.uc_product_price),
          uc_product_mainImage: oldProductInfoList[k]?.uc_product_mainImage,
          uc_product_name: oldProductInfoList[k]?.uc_product_name,
          uc_product_num: currentProductInfo[k]?.uc_product_num,
        };

        임시배열.push(box);
      }

      setPayparamInfo(임시배열);
    });
  }, [deleteTriger]);

  const quantityHandler = (e, idx) => {
    const { className } = e.target;
    console.log(
      `className: ${className}  className.indexOf("plus"):  ${className.indexOf(
        "plus"
      )}`
    );

    if (payparamInfo[idx].quantity === 1 && className.indexOf("minus") > 0) {
      return;
    }

    if (className.indexOf("plus") > 0) {
      let box = [...payparamInfo];

      box[idx].quantity = parseInt(payparamInfo[idx].quantity) + 1;
      box[idx].cart_target_price =
        parseInt(box[idx].quantity) *
        parseInt(가격보정상품정보[idx].uc_product_price);
      setPayparamInfo(box);

      return;
    }

    if (className.indexOf("minus") > 0) {
      let box = [...payparamInfo];

      box[idx].quantity = parseInt(payparamInfo[idx].quantity) - 1;
      box[idx].cart_target_price =
        parseInt(box[idx].quantity) *
        parseInt(가격보정상품정보[idx].uc_product_price);
      setPayparamInfo(box);

      return;
    }
  };

  const eachPurchaceFnc = (idx) => {
    console.log(`idx=>>>:  ${idx}`);

    let box = [...purchaceArr];
    box[idx] = payparamInfo[idx];
    setPurchaceArr(box);
    setPaygoModal(true);
  };
  const allPurchaceFnc = () => {
    let box = [...payparamInfo];
    setPurchaceArr(box);
    setPaygoModal(true);
  };

  const totalQuantityCalCul = (purchaceArr) => {
    let totalQuantity = 0;
    for (let k = 0; k < purchaceArr.length; k++) {
      //취소 버튼시  purchaceArr 가 다 언디파인으로 초기화 되니 여기서 그냥 막는다.
      if (purchaceArr[k]?.quantity === undefined) {
        continue;
      }
      totalQuantity += purchaceArr[k].quantity;
    }

    return totalQuantity;
  };

  const totalCalCul = (purchaceArr) => {
    let totalPrice = 0;
    for (let k = 0; k < purchaceArr.length; k++) {
      //취소 버튼시  purchaceArr 가 다 언디파인으로 초기화 되니 여기서 그냥 막는다.
      if (purchaceArr[k]?.cart_target_price === undefined) {
        continue;
      }
      totalPrice += purchaceArr[k].cart_target_price;
    }

    return totalPrice;
  };

  let bodyData = {
    cart_num: "",
    cart_target_price: "",
    packing_cart_num: "",
    quantity: "",
    uc_product_mainImage: "",
    uc_product_name: "",
    uc_product_num: "",
  };

  const goPaymentComplet = () => {
    const date = new Date();
    const serverYear = date.getFullYear();
    const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
    const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
    const seqNum = Math.random();

    const currentServerDate =
      serverYear + "-" + serverMonth + "-" + serverDay + "-" + seqNum;

    console.log(purchaceArr);

    let bodyDataArr = [];
    let 임시객체 = {};
    for (let k = 0; k < purchaceArr.length; k++) {
      if (purchaceArr[k] === undefined) continue;

      if (purchaceArr[k] === undefined) continue;

      for (let key in purchaceArr[k]) {
        if (key === "cart_num") {
          임시객체.cart_num = purchaceArr[k][key];
        }

        if (key === "packing_cart_num") {
          임시객체.packing_cart_num = purchaceArr[k][key];
        }

        if (key === "cart_target_price") {
          임시객체.row_total_price = purchaceArr[k][key];
        }

        if (key === "quantity") {
          임시객체.row_total_quantity = purchaceArr[k][key];
        }
        if (key === "uc_product_num") {
          임시객체.uc_product_num = purchaceArr[k][key];
        }
      }
      임시객체.merchant_num = currentServerDate;
      bodyDataArr.push(임시객체);
      임시객체 = {};
    }

    console.log(bodyDataArr);

    axios
      .post(`http://${IP}:4000/user/insertPaymnetInfo`, {
        payParamList: bodyDataArr,
      })
      .then((res) => {
        const { payStatusCode } = res.data;

        if (payStatusCode === 1) {
        }
      });
  };

  useEffect(() => {
    console.log(가격보정상품정보);
  }, [가격보정상품정보]);

  const eachDeleteFnc = (cartParam) => {
    let { cart_num, packing_cart_num } = cartParam;
    console.log(
      `cart_num: ${cart_num}, packing_cart_num: ${packing_cart_num} `
    );
    let bodyParam = {
      cart_num: cart_num,
      packing_cart_num: packing_cart_num,
    };

    axios
      .post(`http://${IP}:4000/user/eachCartDelete`, bodyParam)
      .then((res) => {
        let { deleteStatusCode } = res.data;

        if (deleteStatusCode === 1) {
          alert("상품을 \n 카트에서 삭제 하였습니다.");
          setDeleteTriger(deleteTriger + 1);
        }
      });
  };

  const allDelereCartFnc = () => {
    axios.post(`http://${IP}:4000/user/allCartDelete`).then((res) => {
      let { deleteStatusCode } = res.data;

      if (deleteStatusCode === 1) {
        alert("장바구니를 비웠습니다. ");
        setDeleteTriger(deleteTriger + 1);
      }
    });
  };

  return (
    <>
      <ShortCartPageAllWrapper>
        <div className="cartArea">
          {카트가가지고있던수량 != undefined &&
            카트담았던시점상품정보 != undefined &&
            가격보정상품정보 != undefined &&
            카트담았던시점상품정보.map((item, idx) => {
              console.log(idx);
              console.log(가격보정상품정보[idx]);

              return (
                <div key={item.uc_product_num} className="productInfoArea">
                  <div className="rowBox">
                    <div className="productImage">
                      <img
                        src={카트담았던시점상품정보[idx].uc_product_mainImage}
                      />
                    </div>
                    <div className="colBox" style={{ gap: "20px" }}>
                      <div className="rowBox">
                        <div style={labelName}>상품명:</div>
                        <div style={labelTarget}>{item.uc_product_name}</div>
                      </div>

                      {/* <div className="rowBox">
                        <div style={labelName}>변경전 가격:</div>
                        <div style={labelTarget}>
                          {" "}
                          {카트담았던시점상품정보[idx].uc_product_price}
                        </div>
                      </div>
                      <div className="rowBox">
                        <div style={labelName}> 변경후 가격:</div>
                        <div style={labelTarget}>
                          {" "}
                          {가격보정상품정보[idx].uc_product_price}
                        </div>
                      </div> */}

                      {카트담았던시점상품정보[idx].uc_product_name ===
                        가격보정상품정보[idx].uc_product_name &&
                      카트담았던시점상품정보[idx].uc_product_price !=
                        가격보정상품정보[idx].uc_product_price ? (
                        <>
                          <div className="rowBox">
                            <div style={labelName}>변경전 가격:</div>
                            <div style={labelTarget}>
                              {" "}
                              {카트담았던시점상품정보[idx].uc_product_price}
                            </div>
                          </div>
                          <div className="rowBox">
                            <div style={labelName}> 변경후 가격:</div>
                            <div style={labelTarget}>
                              {" "}
                              {가격보정상품정보[idx].uc_product_price}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rowBox">
                            <div style={labelName}> 가격:</div>
                            <div style={labelTarget}>
                              {" "}
                              {가격보정상품정보[idx].uc_product_price}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className="colBox btnArea"
                    style={{ borderTop: "4px solid #ebebeb" }}
                  >
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
                  </div>
                </div>
              );
            })}

          <div>
            {카트담았던시점상품정보 != undefined &&
              카트담았던시점상품정보.length != 0 && (
                <div
                  className="colBox"
                  style={{
                    justifyContent: "space-between",
                    padding: "10px 10px",
                    margin: "10px 10px",
                    height: "92px",
                    width: "100%",
                  }}
                >
                  <div className="YbtnCss" onClick={allPurchaceFnc}>
                    전체구매
                  </div>
                  <div className="NbtnCss" onClick={allDelereCartFnc}>
                    비우기
                  </div>
                </div>
              )}
          </div>
        </div>
      </ShortCartPageAllWrapper>
      {paygoModal && (
        <>
          <GeneralModal
            modalBodyWidthOption={"1300px"}
            modalHeightOption={"1000px"}
            inputStyle={"170px"}
            modalTopOption={"50%"}
            modalHeadBodyGap={"40px"}
          >
            <div className="modal-content">
              <h1>선택한 상품 결제</h1>
              {purchaceArr.map((item) => {
                if (item === undefined) return;
                return (
                  <div className="cartArea">
                    <div key={item.uc_product_num} className="productInfoArea">
                      <div className="rowBox">
                        <div className="productImage">
                          <img
                            className="paymentImage"
                            style={{
                              maxHeight: "250px",
                              minHeight: "250px",
                              maxWidth: "350px",
                              minWidth: "350px",
                            }}
                            src={item.uc_product_mainImage}
                          />
                        </div>

                        <div className="colBox">
                          <div className="rowBox">
                            <div style={labelName}>상품명:</div>
                            <div style={labelTarget}>
                              {item.uc_product_name}
                            </div>
                          </div>
                          <div className="rowBox">
                            <div style={labelName}> 선택한 수량:</div>
                            <div style={labelTarget}>{item.quantity}</div>
                          </div>
                          <div className="rowBox">
                            <div style={labelName}> 수량대비가격:</div>
                            <div style={labelTarget}>
                              {item.cart_target_price}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="cutline" style={cutline}></div>
                  </div>
                );
              })}

              <div
                className="rowBox"
                style={{ justifyContent: "space-between" }}
              >
                <div style={{ color: "#212121", fontSize: "30px" }}>
                  상품 총 수량
                </div>
                <div style={{ color: " #ff5862", fontSize: "30px" }}>
                  {totalQuantityCalCul(purchaceArr)}
                </div>
              </div>

              <div
                className="rowBox"
                style={{ justifyContent: "space-between" }}
              >
                <div style={{ color: "#212121", fontSize: "30px" }}>
                  결제 총가격
                </div>
                <div style={{ color: " #ff5862", fontSize: "30px" }}>
                  {totalCalCul(purchaceArr)}
                </div>
              </div>
            </div>

            <SelectPaire>
              <div
                className="rowBox"
                style={{ justifyContent: "center", width: "300px" }}
              >
                <div
                  className="rowBox"
                  style={{ justifyContent: "space-between" }}
                >
                  <div
                    className="NbtnCss"
                    onClick={() => {
                      setPurchaceArr(new Array(카트담았던시점상품정보.length));
                      setPaygoModal(false);
                    }}
                  >
                    결제 취소
                  </div>
                  <div className="YbtnCss" onClick={goPaymentComplet}>
                    확인
                  </div>
                </div>
              </div>
            </SelectPaire>
          </GeneralModal>
        </>
      )}
    </>
  );
};

const labelName = {
  width: "135px",
  fontSize: "20px",
  color: "#212121",
  textAlign: "center",
};

const labelTarget = {
  maxWidth: "300px",
  fontSize: "20px",
  textAlign: "center",
};

const cutline = {
  lineHeight: "54px",
  marginTop: "10px",
  background: "#ebebeb",
  height: "2px",
  fontSize: "25px",
  textAlign: "center",
};
