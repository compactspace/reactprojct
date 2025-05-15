import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { GeneralModal } from "../pages/Master/MasterMenuCompo/MasterBusinessCompo";
import { useCookies } from "react-cookie";
export const InsertProductInfoAllWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .custom-upload-btn {
    display: inline-block;
    color: #fff;
    background-color: #8094ff;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }
  .custom-upload-btn:hover {
    background: #3730a3;
  }

  & .colBox {
    display: flex;
    flex-direction: column;
  }

  & .rowBox {
    display: flex;
  }

  & .NbtnCss {
    text-align: center;
    width: 100px;
    line-height: 46px;
    font-size: 20px;
    height: 50px;
    border-radius: 10px 10px 10px 10px;
    background-color: #ff5862;
    color: #fff;
  }

  & .YbtnCss {
    width: 100px;
    line-height: 46px;
    font-size: 20px;
    height: 50px;
    color: #fff;
    background-color: #8094ff;
    border-radius: 10px 10px 10px 10px;
  }

  & .sameLabel {
    max-width: 600px;
    min-width: 600px;
  }

  & .sameLabelPaire {
    height: 40px;
  }

  & .textAreaPaire {
    height: 300px;
  }

  & .samebtn {
    width: 100%;
    line-height: 46px;
    font-size: 20px;
    height: 50px;
    border-radius: 10px 10px 10px 10px;
    color: #fff;
    text-align: center;
    margin: 5px 5px;
  }

  & .addCart {
    background-color: #337ab7;
  }
  & .nowPay {
    background-color: #8094ff;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
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

  & .selectLabel {
    font-size: 20px;
    width: 150px;
    line-height: 50px;
  }

  & .inputLabel {
    text-align: left;
    font-size: 20px;

    line-height: 50px;
  }

  & .rowBox {
    width: 700px;
    display: flex;
  }
`;

const TwoGridAllWrapper = styled.div`
  display: grid;
  grid-template-columns: 500px 300px;

  & .productMainImageArea {
    height: 450px;
    width: 450px;

    width: 100%;
    justify-content: center;
    display: flex;

    & .productMainImage {
      height: 100%;
      width: 100%;
    }
  }

  & .candiImageArea {
    width: 100%;
    display: grid;
    grid-template-columns: 75px 75px 75px 75px 75px 75px;
    grid-template-rows: 75px;
    justify-content: space-evenly;

    & .candiImg {
      height: 90%;
      width: 90%;
      border-radius: 15px 15px 0 0;
    }
  }
`;

export const EventProductCompo = ({ productInfo }) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [cookie] = useCookies(["userid"]);
  const [결제모달열기, set결제모달열기] = useState(false);

  return (
    <>
      <GeneralModal
        modalBodyWidthOption={"760px"}
        modalHeightOption={"1000px"}
        inputStyle={"170px"}
        modalTopOption={"50%"}
        modalHeadBodyGap={"40px"}
      >
        <InsertProductInfoAllWrapper
          className="InsertProductInfoAllWrapper"
          style={{ width: "100%" }}
        >
          <TwoGridAllWrapper className="TwoGridAllWrapper">
            <div className="colBox" style={{ width: "90%" }}>
              {/* <label >파일찾기</label> */}
              <input
                type="file"
                id="product_mainImage"
                name="product_mainImage"
                style={{ display: "none" }}
              />

              <div className="productMainImageArea">
                <img
                  className="productMainImage"
                  src={`/${productInfo.imageUrl}`}
                />
              </div>

              <div className="candiImageArea">
                {/* Base64ImgNameArray */}

                {/* {productImageList.map((item) => {
                  return (
                    <>
                      <img className="candiImg" src={item.Image_file} />
                    </>
                  );
                })} */}
              </div>
            </div>
            <div className="colBox" style={{ gap: "10px" }}>
              <SelectPaire>
                <div className="colBox">
                  <div className="inputLabel sameLabel">
                    상품명: {productInfo.proName}
                  </div>
                </div>
              </SelectPaire>
              <div className="colBox">
                {productInfo.show_status === "Y" && (
                  <div style={{ color: "#337ab7" }}>판매매중</div>
                )}
                {productInfo.proQuantity === 0 && <div>일시품절</div>}
              </div>
              <SelectPaire>
                <div className="colBox">
                  <div className="inputLabel sameLabel">
                    상품가격: {productInfo.proPrice}
                  </div>
                </div>
              </SelectPaire>
              <div className="colBox">
                <div
                  className="addCart samebtn"
                  onClick={() => {
                    console.log(productInfo);

                    axios
                      .post(
                        `http://${IP}:4000/user/addEventProductCart`,
                        productInfo
                      )
                      .then((res) => {
                        console.log(res);

                        let { addStatusCode } = res.data;

                        if (addStatusCode === 0) {
                          alert(`이벤트 상품은 인당 한개씩만 구매 가능합니다.`);
                          return;
                        } else if (addStatusCode === 1) {
                          alert(`담았습니다.`);
                          return;
                        }
                        if (addStatusCode === -1) {
                          alert("품절 되었습니다.");
                          return;
                        }
                      });
                  }}
                >
                  장바구니 추가
                </div>
                <div className="nowPay samebtn">바로결제</div>
              </div>
            </div>
          </TwoGridAllWrapper>
          <div className="rowBox" style={{ justifyContent: "center" }}>
            <div
              className="rowBox"
              style={{
                width: "300px",
                justifyContent: "space-between",
              }}
            >
              <div className="NbtnCss" onClick={() => {}}>
                취소
              </div>
              <div
                className="YbtnCss"
                onClick={() => {
                  if (cookie.userid === undefined) {
                    alert(`로그인이 필요합니다.`);
                    return;
                  }
                  set결제모달열기(true);
                }}
              >
                결제
              </div>
            </div>
          </div>
        </InsertProductInfoAllWrapper>
      </GeneralModal>
      {결제모달열기 && (
        <GeneralModal
          modalBodyWidthOption={"760px"}
          modalHeightOption={"1000px"}
          inputStyle={"170px"}
          modalTopOption={"50%"}
          modalHeadBodyGap={"40px"}
        >
          {/* <PaymentModal
            productInfo={productInfo}
            productImage={productImageList[0].Image_file}
          ></PaymentModal> */}
        </GeneralModal>
      )}
    </>
  );
};
