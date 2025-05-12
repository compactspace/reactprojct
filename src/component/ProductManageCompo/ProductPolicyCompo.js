import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { MasterTable } from "../pages/MasterTableStyle/MasterTable";
import { PolicyTable } from "../common/TableStyle/PolicyTableStyle/PolicyTable";
import styled from "styled-components";
import { InsertPolicyModal } from "./InsertPolicyModal";
import { UpdatePolicyModal } from "./UpdatePolicyModal";
import { GeneralModal } from "../pages/Master/MasterMenuCompo/MasterBusinessCompo";
const SearchAllWrapper = styled.div`
  display: flex;
  & .rowBox {
    display: flex;
  }
`;

const SelectWrapper = styled.div`
  select {
    display: block;
    font-size: 20px;
    height: 50px;
  }
  & .selectLabel {
    font-size: 20px;
    line-height: 48px;
  }

  & .rowBox {
    display: flex;
  }

  & .YbtnCss {
    line-height: 48px;
    font-size: 20px;

    color: #fff;
    background-color: #8094ff;
    border-radius: 10px 10px 10px 10px;
  }
`;

export const ProductPolicyCompo = () => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [possibleOnedayclassNumList, setPossibleOnedayclassNumList] =
    useState(undefined);
  const [possibleOnedayclassNumListCnt, setPossibleOnedayclassNumListCnt] =
    useState(0);

  const [possibleOnedayclassNum, setPossibleOnedayclass_num] =
    useState(undefined);

  const [myPolicy, setMyPolicy] = useState([]);

  useEffect(() => {
    axios
      .post(`http://${IP}:4000/teacher/activitingOnedayNumList`)
      .then((res) => {
        let { possibleOnedayclass_numAndName } = res.data;

        console.log(possibleOnedayclass_numAndName);
        setPossibleOnedayclass_num(
          possibleOnedayclass_numAndName[0].possibleOnedayclass_num
        );
        setPossibleOnedayclassNumList(possibleOnedayclass_numAndName);
        setPossibleOnedayclassNumListCnt(possibleOnedayclass_numAndName.length);

        let defayltOnedayNum =
          possibleOnedayclass_numAndName[0].possibleOnedayclass_num;
        //
        if (defayltOnedayNum != undefined) {
          myPolicyFnc(defayltOnedayNum);
        }
      });
  }, []);

  useEffect(() => {
    console.log(`possibleOnedayclassNum: ${possibleOnedayclassNum}`);
    if (possibleOnedayclassNum === undefined) {
      return;
    }

    myPolicyFnc(possibleOnedayclassNum);
  }, [possibleOnedayclassNum]);

  const myPolicyFnc = (onedayclass_num) => {
    axios
      .post(`http://${IP}:4000/teacher/getMyPolicyList`, {
        onedayclass_num: onedayclass_num,
      })
      .then((res) => {
        let { myPolicy } = res.data;

        if (myPolicy === undefined) {
          setMyPolicy([]);
        } else {
          setMyPolicy([myPolicy]);
        }
      });
  };

  const posiibleOnedayNumHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const possibleOnedayclass_num = selectedOption.getAttribute("data-var");
    console.log("possibleOnedayclass_num 값:", possibleOnedayclass_num);

    const box = { ...possibleOnedayclassNum };
    box.possibleOnedayclass_num = possibleOnedayclass_num;
    setPossibleOnedayclass_num(possibleOnedayclass_num);
  };

  const colName = {
    product_cate: "상품 카테고리",
    ordecount_policy: "주문수량 정책",
    quantity_policy: "재고 정책",
    product_policy_createAt: "판매정책 작성일",
    product_policy_updateAt: "판매정책 수정일",
  };

  const [판매정책작성모달, set판매정책작성모달] = useState(false);
  const newCreatePolicyFnc = () => {
    set판매정책작성모달(true);
  };

  useEffect(() => {
    console.log(`myPolicy.length   ${myPolicy.length}`);
  }, [myPolicy]);
  const [판매정책수정모달, set판매정책수정모달] = useState(false);

  const [선택한정책고유번호, set선택한정책고유번호] = useState(null);
  const rowUntiClck = (idx) => {
    console.log(idx);
    set판매정책수정모달(true);
    set판매정책작성모달(false);

    set선택한정책고유번호(myPolicy[idx].product_policy_num);
  };

  return (
    <>
      {/* <h1> {myPolicy.length}</h1> */}
      {possibleOnedayclassNumListCnt != 0 && (
        <>
          <SearchAllWrapper className="SearchAllWrapper">
            <div className="rowBox">
              <SelectWrapper>
                <div className="rowBox">
                  <div className="rowBox">
                    <div className="selectLabel">선택된 클래스: </div>
                    <select onChange={posiibleOnedayNumHandler}>
                      {possibleOnedayclassNumList.map((item) => {
                        return (
                          <>
                            <option
                              data-var={item.possibleOnedayclass_num}
                              key={item.possibleOnedayclass_num}
                              value={item.possibleOnedayclass_num}
                            >
                              {item.onedayclass_name}
                            </option>
                          </>
                        );
                      })}
                    </select>
                  </div>
                  {myPolicy.length === 0 && (
                    <div
                      className="selectLabel YbtnCss"
                      onClick={newCreatePolicyFnc}
                    >
                      판매 정책 작성하기
                    </div>
                  )}
                </div>
              </SelectWrapper>

              {/* {myPolicy.length === 0 && (
                <>
                  <SelectWrapper>
                    <div className="rowBox">
                      <div className="selectLabel">선택된 클래스: </div>
                      <select onChange={posiibleOnedayNumHandler}>
                        {possibleOnedayclassNumList.map((item) => {
                          return (
                            <>
                              <option
                                data-var={item.possibleOnedayclass_num}
                                key={item.possibleOnedayclass_num}
                                value={item.possibleOnedayclass_num}
                              >
                                {item.onedayclass_name}
                              </option>
                            </>
                          );
                        })}
                      </select>
                      <div onClick={newCreatePolicyFnc}>판매 정책 작성하기</div>
                    </div>
                  </SelectWrapper>
                </>
              )} */}
            </div>
          </SearchAllWrapper>
          {/* 
이벤 를 생각한다.
1.셀클릭: 해당 판매정책의 정보를 수정, +모달
1.셀클릭: 상품 등록하러가기 모달 열기 ,모달
*/}
          <PolicyTable
            data={myPolicy}
            columnName={colName}
            rowUntiClck={rowUntiClck}
            InputType={""}
          ></PolicyTable>
        </>
      )}

      {판매정책작성모달 && (
        <>
          <GeneralModal
            modalBodyWidthOption={"1300px"}
            modalHeightOption={"1000px"}
            inputStyle={"170px"}
            modalTopOption={"50%"}
            modalHeadBodyGap={"40px"}
          >
            <div className="modal-content">
              <h1>판매 정책 작성</h1>
              <InsertPolicyModal
                possibleOnedayclassNum={possibleOnedayclassNum}
                set판매정책작성모달={set판매정책작성모달}
              ></InsertPolicyModal>
            </div>
          </GeneralModal>
        </>
      )}

      {판매정책수정모달 && (
        <>
          <GeneralModal
            modalBodyWidthOption={"1300px"}
            modalHeightOption={"1000px"}
            inputStyle={"170px"}
            modalTopOption={"50%"}
            modalHeadBodyGap={"40px"}
          >
            <div className="modal-content">
              <h1>판매 정책 수정</h1>
              <UpdatePolicyModal
                product_policy_num={선택한정책고유번호}
                possibleOnedayclassNum={possibleOnedayclassNum}
                set판매정책수정모달={set판매정책수정모달}
                set판매정책작성모달={set판매정책작성모달}
              ></UpdatePolicyModal>
            </div>
          </GeneralModal>
        </>
      )}
    </>
  );
};
