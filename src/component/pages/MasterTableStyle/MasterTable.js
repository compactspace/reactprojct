import { useEffect } from "react";
import styled from "styled-components";

const MastTableStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & .tableHead {
    display: flex;
    width: 100%;
    justify-content: space-between;
    border-bottom: 3px solid #ebebeb;
    & .colName {
      display: flex;
      justify-content: center;

      text-align: center;
      font-size: ${(props) =>
        props.colFontOp != "" ? props.colFontOp : "25px"};

      & .colCel {
        width: 110px;
      }
    }
  }

  & .tableBody {
    display: flex;
    justify-content: space-between;
    flex-direction: ${(props) => (props.tBodyRow === "row" ? "row" : "column")};
    & .tableRow {
      text-align: center;
      font-size: 20px;
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    & .tableCell {
      width: 110px;
      display: flex;
      justify-content: center;
    }
  }

  & button {
    display: block;
  }
`;

export const MasterTable = ({
  colFontOp,
  rowCount,
  data,
  columnName,
  choice,

  fileIndex,
  cellClickFnc,
  rowUntiClck,
  emptyMassge,
  InputType,
  dataReadOnly,

  rowInputType,
  rowInputFnc,
  tBodyRow,
  textRender,
}) => {
  useEffect(() => {
    if (rowCount === 0) {
      return;
    }
  }, [rowCount]);

  const TableHeadUi = (columnName, fileIndex) => {
    let entries = Object.entries(columnName);
    if (fileIndex != undefined) {
      entries.splice(fileIndex.onefile, 1);
    }

    return (
      <>
        {entries.map(([key, label]) => (
          <div className="colName" key={key}>
            <div className="colCel">{label}</div>
          </div>
        ))}
      </>
    );
  };
  const TableBodyUi = (
    data,
    columnName,
    rowCount,
    fileIndex,
    cellClickFnc,
    rowUntiClck,
    InputType,
    textRender
  ) => {
    let keysToExtract = Object.keys(columnName);

    console.log(keysToExtract);

    if (fileIndex != undefined) {
      keysToExtract.splice(fileIndex.onefile, 1);
    }

    const valuesToExtract = Object.values(columnName);
    // console.log(valuesToExtract[fileIndex.onefile]);
    return data.map((item, rowIdx) => (
      <div
        key={rowIdx}
        className="tableRow"
        onClick={(e) => {
          rowUntiClck != undefined && rowUntiClck(rowIdx);
        }}
      >
        {keysToExtract.map((v, colIdx) => (
          <div
            key={colIdx}
            className="tableCell"
            onClick={(e) => {
              v.includes("file") && e.stopPropagation();
              v.includes("file") &&
                valuesToExtract[fileIndex.onefile].includes("file") &&
                cellClickFnc.계약서열기함수(rowIdx);
              v.startsWith("choice") && cellClickFnc.결제정보열기(rowIdx);
            }}
          >
            {typeof item[v] === "string" && item[v].includes("T")
              ? item[v].split("T")[0]
              : v.includes("file")
              ? "계약서보기"
              : v.includes("Justtext")
              ? "상세보기"
              : v.startsWith("choice")
              ? "선택"
              : textRender != undefined && textRender(item[v], v) != ""
              ? textRender(item[v], v)
              : item[v]}
          </div>
        ))}
      </div>
    ));
  };

  const TableBodyInputTypeUi = (
    columnName,
    rowInputType,
    rowInputFnc,
    dataReadOnly,
    cellClickFnc
  ) => {
    // console.log(valuesToExtract[fileIndex.onefile]);

    console.log(dataReadOnly);

    // 이게 옵션이라 널 처리를 해야한다. 씨발 공통 테이블 만든 이유가 없네
    let rowInputTypeKey = {};
    if (rowInputType != null) {
      rowInputTypeKey = Object.keys(rowInputType);
    }
    let rowInputTypeValue = {};
    if (rowInputType != null) {
      rowInputTypeValue = Object.values(rowInputType);
    }

    let rowInputFncKey = {};
    if (rowInputFnc != null) {
      rowInputFncKey = Object.values(rowInputFnc);
    }

    const columnNameKey = Object.keys(columnName);

    let 컬럼명배열 = Object.keys(columnName);
    console.log(`컬럼명배열:  ${JSON.stringify(컬럼명배열)}`);
    console.log(`인풋 컬럼명배열:  ${JSON.stringify(rowInputTypeKey)}`);
    console.log(`인풋 qoffb배열:  ${JSON.stringify(rowInputTypeValue)}`);
    return 컬럼명배열.map((item, rowIdx) => (
      <div key={rowIdx} className="tableRow">
        {컬럼명배열[rowIdx]?.startsWith("choice") && (
          <div className="tableCell">
            <button type="button" onClick={cellClickFnc.결제함수}>
              결제하기
            </button>
          </div>
        )}

        {rowInputTypeValue[rowIdx].indexOf("readOnly_Date") != -1 && (
          <div className="tableCell">
            <input
              type="text"
              name={rowInputTypeKey[rowIdx]}
              readOnly
              value={dataReadOnly[item]?.split("T")[0]}
            />
          </div>
        )}

        {rowInputTypeValue[rowIdx].indexOf("readOnly_Text") != -1 && (
          <div className="tableCell">
            <input
              type="text"
              name={rowInputTypeKey[rowIdx]}
              readOnly
              value={dataReadOnly[item]}
            />
          </div>
        )}
        {rowInputTypeValue[rowIdx].indexOf("variable_Date") != -1 && (
          <div className="tableCell">
            <input
              type="date"
              name={
                item.toString().split("_")[0] +
                "_" +
                item.toString().split("_")[1]
              }
              onChange={rowInputFnc.dateHandler}
            />
          </div>
        )}
        {rowInputTypeValue[rowIdx].indexOf("button") != -1 && (
          <div className="tableCell">
            <button type="button" onClick={rowInputFncKey[rowIdx]}>
              확인
            </button>
          </div>
        )}
        {/* <div key={colIdx} className="tableCell" onClick={(e) => {}}></div> */}
      </div>
    ));
  };

  return (
    <>
      {rowCount === 0 ? (
        <>
          {emptyMassge != undefined ? (
            <>
              <MastTableStyle>
                <div className="tableHead">{TableHeadUi(columnName)}</div>
                <h3 style={{ textAlign: "center" }}>{emptyMassge}</h3>
              </MastTableStyle>
            </>
          ) : (
            <>
              {" "}
              <h1>조회결과가 없습니다.</h1>
            </>
          )}
        </>
      ) : (
        <>
          {InputType != "" && (
            <MastTableStyle tBodyRow={tBodyRow}>
              <div className="tableHead">
                {TableHeadUi(columnName, fileIndex)}
              </div>
              <div className="tableBody">
                {TableBodyInputTypeUi(
                  columnName,
                  rowInputType,
                  rowInputFnc,
                  dataReadOnly,
                  cellClickFnc
                )}
              </div>
            </MastTableStyle>
          )}
          {InputType === "" && (
            <MastTableStyle>
              <div className="tableHead">
                {TableHeadUi(columnName, fileIndex)}
              </div>
              <div className="tableBody">
                {TableBodyUi(
                  data,
                  columnName,
                  rowCount,
                  fileIndex,
                  cellClickFnc,
                  rowUntiClck,
                  choice,
                  textRender
                )}
              </div>
            </MastTableStyle>
          )}
        </>
      )}
    </>
  );
};
