import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { GeneralSearchWrapper } from "../MyBusinessListCompo/MyBusinessListCompo";
import { 검색조건레퍼 } from "../CalandarComPo/CalandarComPo";
export const ProductInsertCompo = () => {
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
      });
  }, []);

  //   useEffect(() => {
  //     if (possibleOnedayclassNum === undefined) {
  //       return;
  //     }
  //   }, [possibleOnedayclassNum]);

  const posiibleOnedayNumHandler = (e) => {
    const selectedOption = e.target.selectedOptions[0]; // 선택된 <option> 요소
    const possibleOnedayclass_num = selectedOption.getAttribute("data-var");
    console.log("possibleOnedayclass_num 값:", possibleOnedayclass_num);

    const box = { ...possibleOnedayclassNum };
    box.possibleOnedayclass_num = possibleOnedayclass_num;
    setPossibleOnedayclass_num(possibleOnedayclass_num);
  };

  useEffect(() => {
    console.log(`선택된 번호: ${possibleOnedayclassNum}`);
  }, [possibleOnedayclassNum]);

  return (
    <>
      {possibleOnedayclassNumListCnt != 0 && (
        <>
          <GeneralSearchWrapper>
            <div className="rowArea">
              <검색조건레퍼>
                <select id="select" onChange={posiibleOnedayNumHandler}>
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
              </검색조건레퍼>
            </div>
          </GeneralSearchWrapper>
        </>
      )}
    </>
  );
};
