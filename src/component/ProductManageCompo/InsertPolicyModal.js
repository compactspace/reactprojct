import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const PolicyModalAllWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

  & .NbtnCss {
    font-size: 20px;
    height: 50px;
    border-radius: 10px 10px 10px 10px;
    text-align: end;
    background-color: #ff5862;
    color: #fff;
  }

  & .YbtnCss {
    font-size: 20px;
    height: 50px;
    color: #fff;
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

  & .togle {
    background-color: #8094ff;
  }
`;

export const InsertPolicyModal = ({
  possibleOnedayclassNum,
  set판매정책작성모달,
}) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [환불개월, set환불개월] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);

  const insertEmptyCheck = {
    product_cate: "상품카테고리를 입력해주세요",
    ordecount_policy: "주문수량 정책을 입력해주세요",
    quantity_policy: "재고관리 수동 또는 서비스 이용을 선택해주세요",
  };

  const [insertParam, setInsertParam] = useState({
    onedayclass_num: possibleOnedayclassNum,
    product_cate: "",
    ordecount_policy: "",
    quantity_policy: "auto",
    possible_refunday: "1",
    possible_refund_message: "결제일로부터 1 개월 이내에 가능합니다.",
    refund_impossible_cuz: "",
    refund_option: "",
  });

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setInsertParam((preve) => ({
      ...insertParam,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(insertParam);
  }, [insertParam]);

  const choiceHandler = (e) => {
    const { className, id } = e.target;

    console.log(`id ${id}`);

    let box = { ...insertParam };

    if (id === "full") {
      console.log(className);
      document.getElementById("full").classList.add("togle");
      document.getElementById("sub").classList.remove("togle");
      document.getElementById("all").classList.remove("togle");
      box.refund_option = "full";
    }
    if (id === "sub") {
      document.getElementById("full").classList.remove("togle");
      document.getElementById("sub").classList.add("togle");
      document.getElementById("all").classList.remove("togle");

      box.refund_option = "sub";
    }

    if (id === "all") {
      document.getElementById("full").classList.remove("togle");
      document.getElementById("sub").classList.remove("togle");
      document.getElementById("all").classList.add("togle");
      box.refund_option = "all";
    }
    setInsertParam(box);
  };

  const crossHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const possible_refunday = selectedOption.getAttribute("data-var");
    console.log("possible_refunday 값:", possible_refunday);
    let { value } = e.target;
    let box = { ...insertParam };
    box.possible_refunday = possible_refunday;
    box.possible_refund_message = value;
    setInsertParam(box);
  };

  const goInsertPolicy = async () => {
    axios
      .post(`http://${IP}:4000/teacher/inserNewMyPolicy`, insertParam)
      .then((res) => {
        let { insertStatusCode } = res.data;

        if (insertStatusCode === 1) {
          alert("상품 정책을 등록하였습니다. \n 이제 상품정보를 입력하세요");
          set판매정책작성모달(false);
        }

        if (insertStatusCode === -100) {
          alert("이미 등록한 상품정책 입니다. \n 정보를 수정하시겠습니까?");
        }
      });
  };

  return (
    <>
      <PolicyModalAllWrapper>
        <SelectPaire>
          <div className="rowBox">
            <div className="inputLabel">상품카테고리</div>
            <input
              name="product_cate"
              value={insertParam.product_cate}
              onChange={inputHandler}
            />
          </div>
        </SelectPaire>
        <SelectPaire>
          <div className="rowBox">
            <div className="inputLabel">주문수량 정책</div>
            <input
              name="ordecount_policy"
              value={insertParam.ordecount_policy}
              onChange={inputHandler}
            />
          </div>
        </SelectPaire>
        <SelectPaire>
          <div className="rowBox">
            <div className="selectLabel">재고관리 정책</div>

            <select
              name="quantity_policy"
              onChange={inputHandler}
              value={insertParam.quantity_policy}
            >
              <option value="auto">서비스 이용</option>
              <option value="classic">수동</option>
            </select>
          </div>
        </SelectPaire>
     
        <SelectPaire>
          <div className="rowBox">
            <div className="selectLabel">환불 정책</div>

            <select
              name="possible_refunday"
              onChange={(e) => {
                crossHandler(e);
              }}
              value={insertParam.possible_refund_message}
            >
              {환불개월.map((item, idx) => {
                return (
                  <option key={item} data-var={item}>
                    결제일로부터 {item} 개월 이내에 가능합니다.
                  </option>
                );
              })}
            </select>
          </div>
        </SelectPaire>
        <SelectPaire>
          <div className="rowBox">
            <div className="inputLabel">환불 정책 상세 안내</div>
            <input
              name="refund_impossible_cuz"
              value={insertParam.refund_impossible_cuz}
              onChange={inputHandler}
              style={{ height: "100px" }}
            />
          </div>
        </SelectPaire>
        <SelectPaire>
          <div className="colBox">
            <div>건별 환불 정책 상세 선택</div>
            <div className="rowBox">
              <div className="rowBox">
                <div className="rowBox">
                  <div className="full" style={checkLabel}>
                    전채 환불만 가능
                  </div>
                  <div
                    className="fullCheck"
                    id="full"
                    style={checkBox}
                    onClick={(e) => {
                      choiceHandler(e);
                    }}
                  ></div>
                </div>
                <div className="rowBox">
                  <div className="sub" style={checkLabel}>
                    건별 환불만 가능
                  </div>
                  <div
                    className="subCheck"
                    id="sub"
                    style={checkBox}
                    onClick={(e) => {
                      choiceHandler(e);
                    }}
                  ></div>
                </div>
                <div className="rowBox">
                  <div className="all" style={checkLabel}>
                    모두 환불 가능
                  </div>
                  <div
                    className="allCheck"
                    id="all"
                    style={checkBox}
                    onClick={(e) => {
                      choiceHandler(e);
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </SelectPaire>

        <SelectPaire>
          <div className="rowBox" style={{ justifyContent: "space-between" }}>
            <div
              className="NbtnCss"
              onClick={() => {
                set판매정책작성모달(false);
              }}
            >
              취소
            </div>
            <div
              className="YbtnCss"
              onClick={async () => {
                await goInsertPolicy();
              }}
            >
              확인
            </div>
          </div>
        </SelectPaire>
      </PolicyModalAllWrapper>
    </>
  );
};

const checkLabel = {
  height: "50px",
  lineHeight: "50px",
};
const checkBox = {
  borderRadius: "50px",
  width: "50px",
  height: "50px",

  border: "1px solid black",
};
