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

export const UpdatePolicyModal = ({
  possibleOnedayclassNum,
  set판매정책작성모달,
  set판매정책수정모달,
  product_policy_num,
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

  const [updateParam, setUpdateParam] = useState({
    onedayclass_num: "",
    product_cate: "",
    ordecount_policy: "",
    quantity_policy: "",
    possible_refunday: "",
    possible_refund_message: "",
    refund_impossible_cuz: "",
    refund_option: "",
    product_policy_num: product_policy_num,
  });

  useEffect(() => {
    axios
      .post(`http://${IP}:4000/teacher/getMyPolicy`, {
        onedayclass_num: possibleOnedayclassNum,
      })
      .then((res) => {
        let { myPolicy } = res.data;
        const box = { ...updateParam };
        box.onedayclass_num = myPolicy.onedayclass_num;
        box.product_cate = myPolicy.product_cate;
        box.ordecount_policy = myPolicy.ordecount_policy;
        box.quantity_policy = myPolicy.quantity_policy;
        box.possible_refunday = myPolicy.possible_refunday;
        box.possible_refund_message = myPolicy.possible_refund_message;
        box.refund_impossible_cuz = myPolicy.refund_impossible_cuz;
        box.refund_option = myPolicy.refund_option;

        if (myPolicy.refund_option === "full") {
          document.getElementById("full").classList.add("togle");
        }
        if (myPolicy.refund_option === "sub") {
          document.getElementById("sub").classList.add("togle");
        }
        if (myPolicy.refund_option === "all") {
          document.getElementById("all").classList.add("togle");
        }

        setUpdateParam(box);
      });
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setUpdateParam((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  const goUpdatePolicy = async () => {
    // console.log(updateParam);

    axios
      .post(`http://${IP}:4000/teacher/updateMyPolicy`, updateParam)
      .then((res) => {
        let { updateCode } = res.data;
        if (updateCode === 1) {
          alert("상품 정책을 수정하였습니다.");
          set판매정책작성모달(false);
          set판매정책수정모달(false);
        } else {
          alert("잠시후 다시 시도해주세요");
          set판매정책작성모달(false);
          set판매정책수정모달(false);
        }
      });
  };

  const crossHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const possible_refunday = selectedOption.getAttribute("data-var");
    console.log("possible_refunday 값:", possible_refunday);
    let { value } = e.target;
    let box = { ...updateParam };
    box.possible_refunday = possible_refunday;
    box.possible_refund_message = value;
    setUpdateParam(box);
  };

  const choiceHandler = (e) => {
    const { className, id } = e.target;

    console.log(`id ${id}`);

    let box = { ...updateParam };

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
    setUpdateParam(box);
  };

  return (
    <>
      <PolicyModalAllWrapper>
        <SelectPaire>
          <div className="rowBox">
            <div className="inputLabel">상품카테고리</div>
            <input
              name="product_cate"
              value={updateParam.product_cate}
              onChange={inputHandler}
            />
          </div>
        </SelectPaire>
        <SelectPaire>
          <div className="rowBox">
            <div className="inputLabel">주문수량 정책</div>
            <input
              name="ordecount_policy"
              value={updateParam.ordecount_policy}
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
              value={updateParam.quantity_policy}
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
              value={updateParam.possible_refund_message}
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
              value={updateParam.refund_impossible_cuz}
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
                set판매정책수정모달(false);
              }}
            >
              취소
            </div>
            <div
              className="YbtnCss"
              onClick={async () => {
                await goUpdatePolicy();
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
