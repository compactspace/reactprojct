import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { PolicyTable } from "../../common/TableStyle/PolicyTableStyle/PolicyTable";
import { GeneralModal } from "../../pages/Master/MasterMenuCompo/MasterBusinessCompo";
import { UpdateProductInfoCompo } from "../ProductInfoCompo/UpdateProductInfoCompo";
export const ProductSearchAndUpdateAllWrapper = styled.div`
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
`;

export const ProductSearchAndUpdateCompo = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [product_policy_num, setProduct_policy_num] = useState(undefined);
  const [myPolicyInfoList, setMyPolicyInfoList] = useState(undefined);

  const [myProductList, setMyProductList] = useState([]);
  const [myProductCnt, setMyProductCnt] = useState(0);
  useEffect(() => {
    axios.get(`http://${IP}:4000/teacher/getPolicyList`).then((res) => {
      const { myPolicyInfo } = res.data;
      // setProduct_policy_num(myPolicyInfo[0].product_policy_num);
      setMyPolicyInfoList(myPolicyInfo);
    });
  }, []);

  useEffect(() => {
    if (product_policy_num === undefined && myPolicyInfoList != undefined) {
      let product_policy_num = myPolicyInfoList[0].product_policy_num;

      getMyProductList(product_policy_num);
    }

    if (product_policy_num != undefined && myPolicyInfoList != undefined) {
      getMyProductList(product_policy_num);
    }
  }, [product_policy_num, myPolicyInfoList]);

  const selectHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const product_policy_num = selectedOption.getAttribute("data-var");
    console.log("product_policy_num 값:", product_policy_num);
    setProduct_policy_num(product_policy_num);
  };

  const getMyProductList = async (productPolicNum) => {
    await axios
      .post(`http://${IP}:4000/teacher/getMyProductList`, {
        product_policy_num: productPolicNum,
      })
      .then((res) => {
        const { myProductList, myProductCnt } = res.data;

        setMyProductList(myProductList);
        setMyProductCnt(myProductCnt);
      });
  };

  const colName = {
    show_status: "상품 판매상태",
    product_name: "상품이름",
    product_price: "상품가격",
    create_At: "제품 등록일",
    update_At: "제품정보 수정일",
    cellAction: "제품정보 수정",
  };

  const [수정모달, set수정모달] = useState(false);
  const [updateParam, setUpdateParam] = useState(undefined);
  const clopenModal = (rowIdx) => {
    console.log(myProductList[rowIdx]);
    setUpdateParam(myProductList[rowIdx]);
    set수정모달(true);
  };
  const cellClickFnc = {
    clopenModal,
  };

  return (
    <>
      {myPolicyInfoList != undefined && (
        <>
          <ProductSearchAndUpdateAllWrapper>
            <SelectPaire>
              <div className="rowBox">
                <div className="selectLabel">상품 카테고리 선택</div>
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

            {/* 
                    몇까지 이벤트가 필요할까?
                    1. 셀클릭 시 수정?? 흐음
                    2. 로우 클릭시 판매 정책과 조인된 디테일 정보를 띄울것
                    
                  
                  */}

            {myProductList != undefined && (
              <PolicyTable
                data={myProductList}
                columnName={colName}
                cellClickFnc={cellClickFnc}
                InputType={""}
              ></PolicyTable>
            )}
          </ProductSearchAndUpdateAllWrapper>

          {수정모달 && updateParam != undefined && (
            <GeneralModal
              modalBodyWidthOption={"1300px"}
              modalHeightOption={"1000px"}
              inputStyle={"170px"}
              modalTopOption={"50%"}
              modalHeadBodyGap={"40px"}
            >
              <div className="modal-content">
                <h1>등록된 제품 정보 수정</h1>
                <UpdateProductInfoCompo
                  updateParam={updateParam}
                  set수정모달={set수정모달}
                ></UpdateProductInfoCompo>
              </div>
            </GeneralModal>
          )}
        </>
      )}
    </>
  );
};
