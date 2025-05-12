import styled from "styled-components";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { MasterTable } from "../../MasterTableStyle/MasterTable";
import { css } from "styled-components";
export const GeneralModal = styled.div`
  position: fixed;
  top: ${(props) => (props?.modalTopOption ? props.modalTopOption : "50%")};
  left: 50%;

  transform: ${(props) =>
    props.modalTopOption
      ? `translate(-50%, ${
          props.modalTopOption.startsWith("-")
            ? props.modalTopOption
            : "-" + props.modalTopOption
        })`
      : "translate(-50%, -50%)"};

  width: ${(props) =>
    props.modalBodyWidthOption != undefined
      ? props.modalBodyWidthOption
      : "100%"};
  height: ${(props) =>
    props.modalHeightOption != undefined ? props.modalHeightOption : "100%"};
  background: ${(props) =>
    props?.modalBackgroundOff != "" ? "white" : "rgba(0, 0, 0, 0.5)"};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: ${(props) =>
    props.zIndexOption !== undefined ? props.zIndexOption : 999};

  & .modalAllWrapper {
    display: flex;
    flex-direction: column;
    background: white;

    gap: ${(props) =>
      props.modalHeadBodyGap !== "" ? props.modalHeadBodyGap : ""};
  }

  & .modalHead {
    text-align: center;
  }

  & .modalBody {
    //modalBodyWidthOption
    width: ${(props) =>
      props.modalBodyWidthOption !== "" ? props.modalBodyWidthOption : ""};
    height: 90%;
    display: flex;

    flex-direction: column;
    align-items: center;
  }
  & .modalBodyArea {
  }

  & .modalFooter {
  }

  & img {
    display: block;
    width: 100%;
    height: 85%;
  }

  ${(props) =>
    props?.widthOption && props?.heightOption
      ? css`
          .modal-content {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
            height: ${props.heightOption};
            width: ${props.widthOption};
            overflow-y: auto;
          }
        `
      : css`
          .modal-content {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
            min-width: 300px;
            max-width: 90%;
            max-height: 90%;
            overflow-y: auto;
          }
        `}

  & .BtnMode {
    margin-top: 10px;
    margin-right: auto;
    margin-left: auto;
    font-size: 30px;
    width: 100px;
    border-radius: 10px 10px 10px 10px;
    text-align: center;
    color: #fff;
    background-color: #8094ff;
  }

  & .rowBox {
    display: flex;
    padding: 10px 10px;
  }
  //플랙스 로두 단위로 묶는다.
  & .modalRowBox {
    padding: 10px 10px;
    display: flex;
    width: ${(props) =>
      props.rowBoxWidthOption != "" ? props.rowBoxWidthOption : ""};
  }

  & .modalColBox {
    display: flex;
    flex-direction: column;
    width: ${(props) =>
      props.rowBoxWidthOption != "" ? props.rowBoxWidthOption : ""};
  }

  & .inputStyle {
    border: none;
    display: block;
    font-size: 20px;
    width: ${(props) => (props.inputStyle != "" ? props.inputStyle : "")};
  }

  & .selectStyle {
    display: block;
    font-size: 25px;
  }

  & .labelStyle {
    font-size: 25px;
    line-height: 50px;
  }

  & .rowBox {
    display: flex;
  }

  & .colBox {
    display: flex;
    flex-direction: column;
  }
`;

export const MasterBusinessCompo = ({ searchBusiness, setSearchBusiness }) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const [bApplicantCnt, setBApplicantCnt] = useState(0);
  const [businessApplicantList, setBusinessApplicantList] = useState([]);

  const [계약서사진리스트, set계약서사진리스트] = useState([]);
  const [계약서이미지보기, set계약서이미지보기] = useState("");

  const [개별사업자인증정보, set개별사업자인증정보] = useState(null);

  useEffect(() => {
    axios
      .post(`http://${IP}:4000/master/businessApplicationList`, searchBusiness)
      .then((res) => {
        console.log(res.data);
        let { businessApplicantCnt, businessApplicantList } = res.data;
        setBApplicantCnt(businessApplicantCnt);
        setBusinessApplicantList(businessApplicantList);

        if (businessApplicantList != null) {
          let 계약서이미지임시배열 = businessApplicantList.map((item) => {
            return item.rental_file;
          });
          set계약서사진리스트(계약서이미지임시배열);
        }
      });
  }, [searchBusiness]);

  const columnName = {
    tid: "신청자 아이디",
    business_num: "사업자등록번호",
    business_status: "승인상태",
    rental_file: "임대계약파일",
    business_creatAt: "사업자인증인청일",
    cell_click: "rental_file",
  };

  const fileIndex = {
    onefile: 5,
  };

  // 계약서 보기 클릭시 계약서 이미지가 열린다.
  const 계약서열기함수 = (rowIdx) => {
    const base64String = Buffer.from(계약서사진리스트[rowIdx]).toString("utf8");
    set계약서이미지보기(base64String);
  };
  const cellClickFnc = {
    계약서열기함수,
  };

  // 해당 로우 전체 클릭시 승인/거절 등의 모달을 연다.
  const rowUntiClck = (rowIdx) => {
    //rowIdx
    console.log(businessApplicantList);
    set개별사업자인증정보(businessApplicantList[rowIdx]);
  };

  const [reject_cuz, setReject_cuz] = useState(null);
  const jejactCuzHandler = (e) => {
    const { name, value } = e.target;
    setReject_cuz(value);
  };

  const 거절Ui = () => {
    return (
      <>
        <div className="rowBox">
          <div
            className="BtnMode"
            style={{ lineHeight: "50px", marginTop: "0px" }}
            onClick={() => {
              if (reject_cuz === null) {
                alert("거절 사유를 입력해주세요 \n ex)계약서 하자 등");
                return;
              }

              let bodyData = {
                business_status: "reject",
                reject_cuz: reject_cuz,
                onedayclass_num: 개별사업자인증정보.onedayclass_num,
              };

              axios
                .post(`http://${IP}:4000/master/updateBusinessStatus`, bodyData)
                .then((res) => {
                  let { confirmStatusCode } = res.data;
                  if (confirmStatusCode != -1) {
                    let message =
                      bodyData.business_status === "confirm"
                        ? "사업승인"
                        : "사업거절";
                    alert(`해당 신청건을 ${message} 하였습니다.`);
                    return;
                  } else {
                    alert("잠시후 다시 시도해주세요");
                    return;
                  }
                });

              //confirmStatusCode
            }}
          >
            거절
          </div>
          <input
            style={{ fontSize: "30px" }}
            className="inputStyle"
            name="jejact_cuz"
            placeholder="거절 사유를 입력해주세요"
            onChange={jejactCuzHandler}
          />
        </div>
      </>
    );
  };

  const 승낙Ui = () => {
    return (
      <>
        {" "}
        <div
          className="BtnMode"
          onClick={() => {
            let bodyData = {
              business_status: "confirm",
              onedayclass_num: 개별사업자인증정보.onedayclass_num,
            };

            axios
              .post(`http://${IP}:4000/master/updateBusinessStatus`, bodyData)
              .then((res) => {
                let { confirmStatusCode } = res.data;
                if (confirmStatusCode != -1) {
                  let message =
                    bodyData.business_status === "confirm"
                      ? "사업승인"
                      : "사업거절";
                  alert(`해당 신청건을 ${message} 하였습니다.`);
                  return;
                } else {
                  alert("잠시후 다시 시도해주세요");
                  return;
                }
              });

            //confirmStatusCode
          }}
        >
          승인
        </div>
      </>
    );
  };

  return (
    <>
      <MasterTable
        rowCount={bApplicantCnt}
        data={businessApplicantList}
        columnName={columnName}
        fileIndex={fileIndex}
        cellClickFnc={cellClickFnc}
        InputType={""}
        rowUntiClck={rowUntiClck}
      ></MasterTable>
      {계약서이미지보기 != "" && (
        <GeneralModal>
          <div className="modal-content">
            <h1>부동산 임대계약서 확인</h1>
            <img src={계약서이미지보기} />
            <div
              className="BtnMode"
              onClick={() => {
                set계약서이미지보기("");
              }}
            >
              닫기
            </div>
          </div>
        </GeneralModal>
      )}

      {개별사업자인증정보 != null && (
        <>
          <GeneralModal>
            <div className="modal-content">
              <h1>승인하기</h1>
              {/* 대기중인 경우는 승인과 거절 기능 */}
              {개별사업자인증정보.business_status === "waiting" && (
                <>
                  <승낙Ui></승낙Ui>
                  <거절Ui></거절Ui>
                </>
              )}

              {/* 사업승인중이라면 이때는 그냥 거절로 */}
              {개별사업자인증정보.business_status === "confirm" && (
                <>
                  <거절Ui></거절Ui>
                </>
              )}

              {/* 거절이라면 이때는 그냥 승인만 */}
              {개별사업자인증정보.business_status === "reject" && (
                <>
                  <승낙Ui></승낙Ui>
                </>
              )}
              <div
                className="BtnMode"
                onClick={() => {
                  set개별사업자인증정보(null);
                }}
              >
                닫기
              </div>
            </div>
          </GeneralModal>
        </>
      )}
    </>
  );
};
