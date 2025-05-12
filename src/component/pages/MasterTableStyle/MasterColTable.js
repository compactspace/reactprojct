import { useEffect } from "react";
import styled from "styled-components";

const MasterColTableStyle = styled.div`
  display: flex;
  width: ${(props) => (props.tableWidthOp != "" ? props.tableWidthOp : "100%")};
  & .tableHead {
    display: flex;
    width: ${(props) =>
      props.tableWidthOp != "" ? props.tableWidthOp : "100%"};
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 3px solid #ebebeb;
    padding-top: 10px;
    padding-bottom: 10px;
    & .colName {
      display: flex;
      justify-content: center;

      text-align: center;
      font-size: ${(props) =>
        props.colFontOp != "" ? props.colFontOp : "25px"};

      & .colCel {
        width: 230px;
      }
    }
  }

  & .tableBody {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 10px;
    width: ${(props) =>
      props.tableWidthOp != "" ? props.tableWidthOp : "100%"};
    & .tableRow {
      align-items: center;
      text-align: center;
      font-size: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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

export const MasterColTable = ({
  tableWidthOp,
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
    InputType
  ) => {
    const keysToExtract = Object.keys(columnName);
    if (fileIndex != undefined) {
      keysToExtract.splice(fileIndex.onefile, 1);
    }

    if (cellClickFnc != undefined) {
      console.log(cellClickFnc);
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
    cellClickFnc,
    tableWidthOp
  ) => {
    // console.log(valuesToExtract[fileIndex.onefile]);

    const rowInputTypeKey = Object.keys(rowInputType);

    const columnNameKey = Object.keys(columnName);

    const rowInputFncKey = Object.values(rowInputFnc);

    let 컬럼명배열 = Object.keys(columnName);
    console.log(rowInputTypeKey);
    return 컬럼명배열.map((item, rowIdx) => (
      <div key={rowIdx} className="tableRow">
        {컬럼명배열[rowIdx].startsWith("choice") && (
          <div className="tableCell">
            <button type="button" onClick={cellClickFnc.결제함수}>
              결제하기
            </button>
          </div>
        )}

        {컬럼명배열[rowIdx].indexOf("readOnly") != -1 && (
          <div className="tableCell">
            <input type="text" readOnly value={dataReadOnly} />
          </div>
        )}

        {rowInputTypeKey[rowIdx].indexOf("date") != -1 && (
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
        {rowInputTypeKey[rowIdx].indexOf("button") != -1 && (
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
              <MasterColTableStyle tableWidthOp={tableWidthOp}>
                <div className="tableHead">{TableHeadUi(columnName)}</div>
                <h3 style={{ textAlign: "center" }}>{emptyMassge}</h3>
              </MasterColTableStyle>
            </>
          ) : (
            <>
              <h1>조회결과가 없습니다.</h1>
            </>
          )}
        </>
      ) : (
        <>
          {InputType != "" && (
            <MasterColTableStyle
              tBodyRow={tBodyRow}
              tableWidthOp={tableWidthOp}
            >
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
            </MasterColTableStyle>
          )}
          {InputType === "" && (
            <MasterColTableStyle tableWidthOp={tableWidthOp}>
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
                  choice
                )}
              </div>
            </MasterColTableStyle>
          )}
        </>
      )}
    </>
  );
};
