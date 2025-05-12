import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import choiceImage from "../../../img/choiceImage.png";
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
    width: 150px;
    line-height: 50px;
  }

  & .rowBox {
    width: 700px;
    display: flex;
  }
`;

const TwoGridAllWrapper = styled.div`
  display: grid;
  grid-template-columns: 600px auto;

  & .productMainImageArea {
    height: 700px;
    width: 540px;

    & .productMainImage {
      height: 100%;
      width: 100%;
    }
  }

  & .candiImageArea {
    display: grid;
    grid-template-columns: 90px 90px 90px 90px 90px 90px;
    grid-template-rows: 110px;
    justify-content: space-evenly;
    width: 540px;

    & .candiImg {
      height: 90%;
      width: 90%;
      border-radius: 15px 15px 0 0;
      margin-left: 10px;
    }
  }
`;

export const ProductInfoCompo = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [insertParam, setInsertParam] = useState({
    product_name: "",
    product_price: "",
    product_mainImage: "",
    product_policy_num: "",
    show_status: "N",
    product_intro: "상품정보 준비중입니다.",
  });
  const [product_policy_num, setProduct_policy_num] = useState(undefined);
  const [myPolicyInfoList, setMyPolicyInfoList] = useState(undefined);

  useEffect(() => {
    axios.get(`http://${IP}:4000/teacher/getPolicyList`).then((res) => {
      const { myPolicyInfo } = res.data;
      console.log(myPolicyInfo);
      setProduct_policy_num(myPolicyInfo[0].product_policy_num);
      setMyPolicyInfoList(myPolicyInfo);
      const box = { ...insertParam };
      box.product_policy_num = myPolicyInfo[0].product_policy_num;
      setInsertParam(box);
    });
  }, []);

  useEffect(() => {
    setInsertParam({
      product_name: "",
      product_price: "",
      product_mainImage: "",
      product_policy_num: product_policy_num,
      show_status: "N",
      product_intro: "",
    });
  }, [product_policy_num]);

  const [Base64ImgArray, setBase64ImgArray] = useState(new Array(6));
  const [Base64ImgNameArray, setBase64ImgNameArray] = useState(new Array(6));
  const [product_mainImage, setProduct_mainImage] = useState("");

  const imageHandler = async (e, idx) => {
    // console.log(`${idx}-번째 인덱스`);

    const file = e.target.files[0]; // 소문자 files!
    if (!file) return;

    // console.log(file);

    const reader = new FileReader();
    const base64Image = await imageReader(reader, file, idx);

    const nameBox = [...Base64ImgNameArray];
    nameBox[idx] = file.name;

    const base64ImgBox = [...Base64ImgArray];
    base64ImgBox[idx] = base64Image;
    setBase64ImgNameArray(nameBox);
    setBase64ImgArray(base64ImgBox);
    setProduct_mainImage(base64Image);
    if (idx === 0) {
      const boxMainImage = { ...insertParam };
      boxMainImage.product_mainImage = base64Image;
      setInsertParam(boxMainImage);
    }
  };

  const imageReader = async (reader, file, idx) => {
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result); // base64 문자열 반환
      };
      reader.readAsDataURL(file); // 한 번만 호출!
    });
  };

  const selectHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const product_policy_num = selectedOption.getAttribute("data-var");
    console.log("product_policy_num 값:", product_policy_num);

    const box = { ...setInsertParam };
    box.product_policy_num = product_policy_num;
    setInsertParam(box);
    setProduct_policy_num(product_policy_num);
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInsertParam((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const insertProductInfo = async () => {
    console.log(insertParam);

    for (let i = 0; i < Base64ImgArray.length; i++) {
      if (Base64ImgArray[i] === undefined) {
        alert("상품 이미지 등록은 필수입니다.");
        return;
      }
    }
    // console.log(Base64ImgNameArray);
    const reqBody = { ...insertParam };
    reqBody.Base64ImgArray = Base64ImgArray;
    reqBody.Base64ImgNameArray = Base64ImgNameArray;
    await axios
      .post(`http://${IP}:4000/teacher/inserNewProductInfo`, reqBody)
      .then((res) => {
        let { insertStatusCode } = res.data;
        if (insertStatusCode === 1) {
          alert("제품정보를 등록하였습니다.");
        }
      });
  };

  return (
    <>
      {product_policy_num != undefined && (
        <InsertProductInfoAllWrapper>
          <SelectPaire>
            <div className="rowBox">
              <div className="selectLabel">상품 카테고리</div>
              <select name="product_cate" onChange={selectHandler}>
                {myPolicyInfoList.map((item) => {
                  return (
                    <>
                      <option
                        key={item.product_policy_num}
                        data-var={item.product_policy_num}
                      >
                        {item.product_cate}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </SelectPaire>
          <SelectPaire>
            <div className="rowBox">
              <div className="inputLabel">상품명</div>
              <input
                name="product_name"
                onChange={inputHandler}
                value={insertParam.product_name}
              />
            </div>
          </SelectPaire>
          <TwoGridAllWrapper className="TwoGridAllWrapper">
            <div className="colBox">
              <h1>상품 대표이미지</h1>
              <label
                htmlFor="product_mainImage"
                style={{
                  width: "540px",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                  display: "inline-block",
                  color: "#fff",
                  backgroundColor: " #8094ff",
                  borderRadius: "8px",
                }}
              >
                파일 선택하기
              </label>
              {/* <label >파일찾기</label> */}
              <input
                type="file"
                id="product_mainImage"
                name="product_mainImage"
                style={{ display: "none" }}
                onChange={(e) => {
                  imageHandler(e, 0);
                }}
              />

              <div className="productMainImageArea">
                <img
                  className="productMainImage"
                  src={
                    product_mainImage != "" ? product_mainImage : choiceImage
                  }
                />
              </div>

              <div className="candiImageArea">
                {/* Base64ImgNameArray */}

                {[0, 1, 2, 3, 4, 5].map((item) => {
                  return (
                    <>
                      <img
                        className="candiImg"
                        src={
                          Base64ImgArray[item] != undefined
                            ? Base64ImgArray[item]
                            : choiceImage
                        }
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <div className="colBox">
              <div
                className="colBox"
                style={{
                  height: "300px",
                  justifyContent: "space-between",
                }}
              >
                <div className="colBox">
                  <div className="selectLabel sameLabel">
                    <h1>상품 판매상태</h1>
                  </div>
                  <select
                    className="sameLabelPaire"
                    name="show_status"
                    onChange={inputHandler}
                    value={insertParam.show_status}
                  >
                    <option value="Y">판매가능</option>
                    <option value="N">판매중지</option>
                  </select>
                </div>

                <div className="colBox">
                  <div className="inputLabel sameLabel">
                    <h1>상품 가격 등록</h1>
                  </div>
                  <input
                    className="sameLabelPaire"
                    name="product_price"
                    onChange={inputHandler}
                    value={insertParam.product_price}
                  />
                </div>
              </div>

              <div className="colBox">
                <div className="inputLabel sameLabel">
                  <h1>상품 설명</h1>
                </div>
                <textarea
                  className="textAreaPaire"
                  name="product_intro"
                  onChange={inputHandler}
                />
              </div>
              <div className="candiImageFileArea">
                {[0, 1, 2, 3, 4, 5].map((item) => {
                  const inputId = `product_mainImage-${item}`;
                  return (
                    <>
                      <div key={item} className="colBox">
                        <div key={item} className="rowBox">
                          <label
                            htmlFor={inputId}
                            className="custom-upload-btn"
                          >
                            파일
                          </label>
                          {/* <label >파일찾기</label> */}
                          <input
                            type="file"
                            id={inputId}
                            name="product_mainImage"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              imageHandler(e, item);
                            }}
                          />
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="product_mainImage"
                            value={
                              Base64ImgNameArray[item] != undefined
                                ? Base64ImgNameArray[item]
                                : "파일을선택해주세요"
                            }
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </TwoGridAllWrapper>

          <div className="rowBox" style={{ justifyContent: "center" }}>
            <div
              className="rowBox"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  width: "50%",
                  lineHeight: "46px",
                  fontSize: " 20px",
                  height: "50px",
                  color: "#fff",
                  backgroundColor: " #8094ff",
                  borderRadius: "10px 10px 10px 10px",
                }}
                onClick={insertProductInfo}
              >
                상품정보 등록
              </div>
            </div>
          </div>
        </InsertProductInfoAllWrapper>
      )}
    </>
  );
};
