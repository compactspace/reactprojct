import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { InsertDefaultClassInfoModalStyle } from "../createclassComponent/modalStyle/InsertDefaultClassInfoModalStyle";
import { CustomConfirmModal } from "../createclassComponent/insertCreateClass/InsertCreateClass";
import { ShowCreateClass } from "../createclassComponent/ShowCreateClass";
import { useNavigate } from "react-router-dom";
import {
  MyInfoWrapper,
  미리보기모달레퍼,
} from "../updateClassInfoModal/UpdateClassInfoModal";

// 여기의 비즈니스는 좀.. 역시 복잡하다.
// 무조건, 사업자 승인을 받고, 아직 개설하지 않은 원데이클래스 번호에 한하여만 인설트하는 컴포넌트이다.

export const MyBusinessCreateClassCompo = ({
  prop1,
  prop2,
  prop3,
  prop4,
  prop5,
  prop6,
  prop7,
}) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  const naiv = useNavigate();
  const [newOnedayNumList, setNewOnedayNumList] = useState(null);
  const [newOnedayNumListCnt, setNewOnedayNumListCnt] = useState(0);
  useEffect(() => {
    
    axios.post(`http://${IP}:4000/teacher/newCreateOneday`).then((res) => {
      let { newOnedayNumList, newOnedayNumListCnt } = res.data;

      if (newOnedayNumListCnt === 0) {
        alert(
          "새롭게 등록할 클래스 정보가 없습니다. \n 새로운 클래스를 개설 하시려면 \n  새로운 사업자번호와 계약서를가지고\n 인증 부탁드립니다."
        );

        prop1(false);
        prop2(false);
        prop3(false);
        prop4(false);
        prop5(false);
        prop6(false);
        prop7(false);

        return;
      }

      setNewOnedayNumList(newOnedayNumList);
      setNewOnedayNumListCnt(newOnedayNumListCnt);
      const box = { ...chocieBusinessNum };
      box.business_num = newOnedayNumList[0].business_num;
      const box2 = { ...수업정보상태 };
      box2.business_num = newOnedayNumList[0].business_num;
      set수업정보상태(box2);
      setChocieBusinessNum(box);
    });
  }, []);

  const [chocieBusinessNum, setChocieBusinessNum] = useState({
    business_num: "",
  });

  const businessNumHandler = (e) => {
    const { name, value } = e.target;

    setChocieBusinessNum((preve) => ({
      ...preve,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (chocieBusinessNum === "") {
      return;
    }

    // 내일부턴 비즈니스 넘이 바뀔때 수업상태를 재 초기화 한다.
    set수업정보상태({
      onedayclass_name: "",
      nickname: "",
      onedayclass_price: "",

      classtotalinfo: {}, // 빈 객체로 초기화
      business_num: chocieBusinessNum.business_num,
    });
    console.log(chocieBusinessNum.business_num);
  }, [chocieBusinessNum]);

  //

  const [기본클래스정보모달열기, set기본클래스정보모달열기] = useState(false);
  const [수업정보상태, set수업정보상태] = useState({
    onedayclass_name: "",
    nickname: "",
    onedayclass_price: "",

    classtotalinfo: {}, // 빈 객체로 초기화
    business_num: "",
  });

  const inputhandler = (e) => {
    const name = e.target.name; // input의 name 속성
    const value = e.target.value; // input에 입력된 값

    console.log(`name : ${name}  value:  ${value}`);

    // 상태 업데이트 시 불필요한 렌더링을 방지하기 위해 객체 구조를 유지하고, 해당 값만 수정
    set수업정보상태((prevState) => ({
      ...prevState, // 이전 상태 유지
      [name]: value, // 해당 필드만 업데이트
    }));
  };

  // 미리보기 링크를 담고있을 배열
  const [Base64ImgArray, setBase64ImgArray] = useState(new Array(5));

  // 실제 이미지 blob 을 담고있을 배열
  const [BlobImgArray, setBlobImgArray] = useState(new Array(5));

  // 이미지 이름을 담고있을 배열
  const [FileNameArray, setFileNameArray] = useState(new Array(5));

  // 오잉... 다 영이네 수정
  const handleImageUpload = async (fileBlob, index) => {
    console.log(fileBlob.name);

    const reader = new FileReader(); //FileReader의 instance reader 생성

    reader.readAsDataURL(fileBlob); // base64로 인코딩 => 걍 씨발 문자열로 바꿈 ㅈㄴ 긴걸로

    return new Promise(async (resolve) => {
      reader.onload = () => {
        const BoxBase64 = [...Base64ImgArray];

        BoxBase64[index] = reader.result;

        setBase64ImgArray(BoxBase64);
        const BlobImgBox = [...BlobImgArray];
        BlobImgBox[index] = fileBlob;
        setBlobImgArray(BlobImgBox);

        const FileNameBox = [...FileNameArray];
        FileNameBox[index] = fileBlob.name;
        setFileNameArray(FileNameBox);

        resolve();
      };
    });
  };

  useEffect(() => {
    console.log(수업정보상태);
  }, [수업정보상태]);

  let [미리보기, set미리보기] = useState(false);
  let [미리보기담을상태, set미리보기담을상태] = useState(null);
  const ShowClass = () => {
    console.log(수업정보상태);

    set기본클래스정보모달열기(false);
    set미리보기(true);
    // set미리보기담을상태(imageSrcArray);
    set미리보기담을상태(Base64ImgArray);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const openModal = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  //최종삽입모달
  const handleConfirm = async () => {
    let bodyData = { ...수업정보상태 };

    bodyData.reserve_img = Base64ImgArray;
    for (let i = 0; i < BlobImgArray.length; i++) {
      if (BlobImgArray[i] != undefined) {
        continue;
      }
      alert("수업등록 이미지 등록은 필수입니다. \n 총 5개를 입력해주세요");
      return;
    }
    console.log(bodyData);
    let headers = { "content-type": "application/json" };
    await axios
      .post(`http://${IP}:4000/teacher/insertclassinfo`, bodyData, { headers })
      .then((res) => {
        console.log(res.data);
        if (res.data.updatestatuscode == 1) {
          alert("수업 정보가 반영되었습니다.");
          prop1(false);
          prop2(false);
          prop3(false);
          prop4(false);
          prop5(false);
          prop6(false);
          prop7(false);
        } else {
          alert("잠시후 다시 시도해주세요");
        }
      });

    closeModal();
  };

  const handleCancel = () => {
    console.log("아니오를 클릭했습니다.");
    closeModal();
  };

  const FileUploadUi = () => {
    const indxArr = [0, 1, 2, 3, 4];

    return (
      <>
        {indxArr.map((item) => {
          const inputId = `file-${item}`; // 고유 id 생성
          return (
            <>
              <div className="filebox">
                <input
                  id={inputId}
                  className="upload-name"
                  placeholder="첨부파일"
                  style={{ display: "none" }}
                  type="file"
                  onChange={(e) => {
                    handleImageUpload(e.target.files[0], item);
                  }}
                />
                <label for={inputId}>파일찾기</label>
                <input
                  value={
                    FileNameArray[item] != undefined
                      ? FileNameArray[item]
                      : "선택된 파일 없음"
                  }
                  className="upload-name"
                />
              </div>
            </>
          );
        })}
      </>
    );
  };

  return (
    <>
      <MyInfoWrapper>
        {newOnedayNumListCnt != 0 && (
          <>
            <div className="rowBox">
              <div className="selectLable">인증된사업자번호:</div>
              <select onChange={businessNumHandler}>
                {newOnedayNumList.map((item) => {
                  return (
                    <>
                      <option name="business_num" key={item.onedayclass_num}>
                        {item.business_num}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </>
        )}

        {chocieBusinessNum.business_num != "" && (
          <>
            <div className="stepbodyarea">
              <div className="teacheralertarea"></div>
              <div className="teacherauthoarea">
                <div className="samsecss img">
                  <img
                    className="imgarea"
                    src="phoneicon/phonemainicon.png"
                    style={{
                      width: " 150px",
                      height: "150px",
                    }}
                  ></img>
                </div>
                <div className="samsecss">
                  <div className="alert" style={{ color: "#596a88" }}>
                    등록할 클래스정보 입력해주세요
                  </div>
                  <div className="alerttext">
                    실제 사용자들이 홈페이지를 보며 예약할 등록정보이니 신중하게
                    입력해주세요
                  </div>
                </div>
              </div>
            </div>

            <div className="myinfowrapper">
              <div className="infowrapper">
                <div className="infoarea">
                  <div className="infoheader">
                    <span>등록할클 래스명</span>
                  </div>
                  <div className="infocontent">
                    <div className="read writie">
                      <input
                        className="changeinput"
                        placeholder={`수업이름을 작성해주세요`}
                        id="name"
                        name="onedayclass_name"
                        value={수업정보상태.onedayclass_name}
                        onChange={(e) => {
                          inputhandler(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="infoarea">
                  <div className="infoheader">
                    <span>닉네임</span>
                  </div>
                  <div className="infocontent">
                    <div className="read writie">
                      <input
                        className="changeinput"
                        name="nickname"
                        value={수업정보상태.nickname}
                        placeholder={`수업에 활동하실 닉네임을 입력해주세요`}
                        onChange={(e) => {
                          inputhandler(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="infowrapper">
                <div className="infoarea">
                  <div className="infoheader">
                    <span>이용요금</span>
                  </div>
                  <div className="infocontent">
                    <div className="read writie">
                      <input
                        className="changeinput"
                        placeholder={`수업의 이용요금을 작성해주세요`}
                        id="tell"
                        name="onedayclass_price"
                        value={수업정보상태.onedayclass_price}
                        onChange={(e) => {
                          inputhandler(e);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="infoarea">
                  <div className="infoheader">
                    <span>클래스정보</span>
                  </div>
                  <div className="infocontent">
                    <div className="read writie">
                      <input
                        className="changeinput"
                        placeholder={`클래스정보를 입력해주세요`}
                        id="email"
                        value={수업정보상태.email}
                        onClick={() =>
                          set기본클래스정보모달열기((prev) => !prev)
                        }
                        // onChange={ClassInfoChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="infowrapper ">
                <div className="infoarea addimgarea">
                  <div className="infoheader">
                    <span>등록할 사진</span>
                  </div>
                  <div className="addimgcontent" id="addimgcontent">
                    <div className="read writie">
                      <FileUploadUi></FileUploadUi>
                    </div>
                  </div>
                </div>
              </div>

              <div
                class="showCreateClass"

                //   onClick={ShowClass}
              >
                <div>
                  <span onClick={ShowClass}>작성 미리보기</span>
                </div>
              </div>
              <div
                class="insertClass"

                //   onClick={ShowClass}
              >
                <div>
                  <span
                    onClick={() =>
                      openModal("작성하신 정보로 클래스 등록을 하시겠습니까?")
                    }
                  >
                    클래스 등록하기
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </MyInfoWrapper>

      {기본클래스정보모달열기 && (
        <InsertDefaultClassInfoModalStyle
          수업정보상태={수업정보상태}
          set수업정보상태={set수업정보상태}
          기본클래스정보모달열기={기본클래스정보모달열기}
          set기본클래스정보모달열기={set기본클래스정보모달열기}
        ></InsertDefaultClassInfoModalStyle>
      )}

      {미리보기 && (
        <미리보기모달레퍼 수업정보상태={수업정보상태}>
          <div className="header">
            <div className="leftheader">
              <div
                onClick={() => {
                  set미리보기(false);
                }}
              >
                미리보기 접기
              </div>
            </div>
            <div className="rightheader"></div>
          </div>
          <div className="imgmodal">
            <div className="modaltarget">
              <ShowCreateClass 수업정보상태={수업정보상태}></ShowCreateClass>
            </div>
          </div>
        </미리보기모달레퍼>
      )}

      <div>
        {isModalOpen && (
          <CustomConfirmModal>
            <div className="modal-overlay">
              <div className="modal-content">
                <p>{message}</p>
                <div>
                  <button onClick={handleConfirm}>예</button>
                  <button onClick={handleCancel}>아니오</button>
                </div>
              </div>
            </div>
          </CustomConfirmModal>
        )}
      </div>
    </>
  );
};
