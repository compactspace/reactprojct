import styled from "styled-components";
import { useState, useEffect } from "react";
import { InsertDefaultClassInfoModalStyle } from "../modalStyle/InsertDefaultClassInfoModalStyle";
import { ShowCreateClass } from "../ShowCreateClass";
import axios from "axios";
import { BusinessAutho } from "../businessAutho/BusinessAutho";

const MyInfoWrapper = styled.div`
  & .showCreateClass,
  .insertClass {
    justify-content: center;

    display: block;

    height: 50px;

    justify-content: center;
    display: flex;

    border-radius: 10px 10px 10px 10px;

    background-color: #ff5862;
    color: #fff;
    display: flex;
    align-items: center;
  }

  & .insertClass {
    margin-top: 5px;
  }

  padding: 10px 10px;

  & .upload-name {
    display: inline-block;
    height: 40px;
    padding: 0 10px;
    vertical-align: middle;
    border: 1px solid #dddddd;
    width: 78%;
    color: #999999;
  }

  & label {
    display: inline-block;
    padding: 10px 10px;
    color: #fff;
    vertical-align: middle;
    background-color: #999999;
    cursor: pointer;
    height: 30px;
    margin-left: 10px;
  }

  & #file {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
  }

  & .authowrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
    background: #f5f7fa;
    height: 58px;
    margin-top: 16px;
    padding: 12px 16px;
    & .inconarea {
      display: flex;
      font-size: 14px;
      font-weight: 600;
      color: #49627a;
    }

    & .authobtnarea {
      font-size: 14px;
      font-weight: 600;
      color: #49627a;

      & #authosuccess {
        color: #0068bd !important;
      }
    }
  }

  & .myinfowrapper {
    display: flex;
    flex-direction: column;
    gap: 50px;

    & .addimgarea {
      width: 100% !important;

      & #addimgcontent {
        width: 100% !important;
      }
    }

    & .infowrapper {
      display: flex;

      @media (max-width: 410px) {
        flex-direction: column;
        width: 100%;
      }

      justify-content: space-between;

      & .infoarea {
        display: flex;
        flex-direction: column;

        @media (max-width: 410px) {
          width: 100%;
        }

        @media (min-width: 411px) {
          width: 50%;
        }

        & .infoheader {
          color: #707070;
          display: flex;
          line-height: 16px;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 600;

          & #duplicbtn {
            color: #4ab56a;
          }

          & #duplicarea {
            width: 80%;
            display: flex;
            justify-content: space-between;
          }
        }

        .dupliccheckaction {
          gap: 20px;
        }

        & .infocontent {
          max-width: 480px;
          display: flex;
          justify-content: space-between;
          background-color: #fafafa;
          border: 1.5px solid #fafafa;
          width: 80%;

          @media (max-width: 609px) {
            width: 100%;
          }

          & .read {
            padding: 10px 10px;
            display: flex;
            align-items: center;
            width: 100%;

            & input {
              background-color: #fafafa;
              display: inline-block;
              height: 40px;
              width: 100%;
              border: none;
            }
          }

          & .changeinput::-webkit-input-placeholder {
            color: #de4b50;
          }
        }
      }
    }
  }
`;

const 미리보기모달레퍼 = styled.div`
  ///흠.. 아무튼 이상한데
  // header 더의 엄마 또는 조상의 width를 정해도
  // 자식 손주인 header 의 width: 100%; 는 따로논다.
  // 따라서 잘 모르겠지만 max-widht 480px를 적어주자..
  & .header {
    z-index: 13;
    height: 50px;
    max-width: 480px;

    justify-content: space-between;
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    border-radius: 10px 10px 10px 10px;
    text-align: end;
    background-color: #ff5862;
    color: #fff;
    display: flex;
    align-items: center;
  }

  width: 100vh;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);

  & .imgmodal {
    & .modaltarget {
    }
  }
`;

export const InsertCreateClass = ({ 사업자등록번호 }) => {
  let IP;
  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }
  const [기본클래스정보모달열기, set기본클래스정보모달열기] = useState(false);
  const [수업정보상태, set수업정보상태] = useState({
    onedayclass_name: "",
    onedayclass_price: "",
    onedayclass_info: "",
    reserve_img: [],
    classtotalinfo: {}, // 빈 객체로 초기화
    business_num: 사업자등록번호,
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

  let ImgFileList = new Array();
  let size = 0;
  let Base64ImgArray = new Array();

  const handleImageUpload = async (fileBlob, e) => {
    // console.log(fileBlob)

    let FileName = document.getElementById("file").value;

    // if (size >= 7) {
    //     alert("사진은 최대 6까지 \n등록 가능하십니다.")
    //     return;
    // }
    // for (let i = 0; i <= size; i++) {
    //     console.log("반복문")
    //     if (FileName == ImgFileList[i]) {
    //         alert("동일한 사진 입니다.");
    //         return;
    //     }

    // }

    // ImgFileList.push(FileName);
    // size++;
    // document.getElementById("addfilename").value = JSON.stringify(ImgFileList);
    //  console.log(ImgFileList)

    const reader = new FileReader(); //FileReader의 instance reader 생성

    reader.readAsDataURL(fileBlob); // base64로 인코딩 => 걍 씨발 문자열로 바꿈 ㅈㄴ 긴걸로

    return new Promise(async (resolve) => {
      reader.onload = () => {
        // FileReader가 성공적으로 파일을 읽어들였을 때 트리거 되는 이벤트 핸들러

        Base64ImgArray.push(reader.result);

        let deepBaseImgArray = [...수업정보상태.reserve_img];
        deepBaseImgArray.push(reader.result);

        수업정보상태.reserve_img = deepBaseImgArray;
        let deep = { ...수업정보상태 };
        set수업정보상태(deep);
        // if (imageSrcArray == null) {

        //     Base64ImgArray.push(reader.result);

        //     // setImageSrcArray(newarray);
        // } else {
        //     let deep = [...Base64ImgArray];
        //     deep.push(reader.result)

        //     //  setImageSrcArray(deep); //reader.result 에 담긴 문자열을 이미지 src로 담는다
        // }

        // console.log(reader.result)
        resolve();
      };
    });
  };

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

  const handleConfirm = async () => {
    let box = { ...수업정보상태 };
    box.business_num = 사업자등록번호;

    let headers = { "content-type": "application/json" };
    console.log(box);
    await axios
      .post(`http://${IP}:4000/teacher/insertclassinfo`, box, { headers })
      .then((res) => {
        console.log(res.data);
        if (res.data.updatestatuscode == 1) {
          alert("수업 정보가 반영되었습니다.");
          // 솔직히 잘 모르겠는데..하위 컴포에서 상위 컴포의 css 접근이 가능하네
          document.getElementById("header1").classList.remove("headeraction");
          document.getElementById("header2").classList.remove("headeraction");
          document.getElementById("header3").classList.add("headeraction");
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

  return (
    <>
      <MyInfoWrapper>
        <div className="stepbodyarea">
          <div className="teacheralertarea">
            <div className="alert">주의사항</div>
            <div className="alerttext">
              {/* 먼저 회원가입을 하신후, 작가 인증을 진행해주셔야 합니다. 외원가입
            없이 작가 인증은 할 수 없습니다. 로그인을 반드시 로그인을 진행하신후
            눌러주세요 */}
            </div>
          </div>
          <div className="teacherauthoarea">
            <div className="samsecss img">
              <img className="imgarea" src="phoneicon/phonemainicon.png"></img>
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
                    placeholder={`수업에 활동하실 닉네임을 입력해주세요`}
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
                    onClick={() => set기본클래스정보모달열기((prev) => !prev)}
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
                  <div className="filebox">
                    <input
                      id="addfilename"
                      className="upload-name"
                      value="첨부파일"
                      placeholder="첨부파일"
                    ></input>
                    <label for="file">파일찾기</label>
                    {/* onChange={AddImg} */}
                    <input
                      type="file"
                      id="file"
                      className="file1"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files[0], e)}
                    ></input>
                  </div>
                  <div className="filebox">
                    <input
                      id="addfilename1"
                      className="upload-name"
                      value="첨부파일"
                      placeholder="첨부파일"
                    ></input>
                    <label for="file">파일찾기</label>
                    {/* onChange={AddImg} */}
                    <input
                      type="file"
                      id="file"
                      className="file2"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files[0], e)}
                    ></input>
                  </div>
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

export const CustomConfirmModal = styled.div`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  /* 모달 창 스타일 */
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .modal-content p {
    margin-bottom: 20px;
  }

  .modal-content button {
    margin: 5px;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }

  .modal-content button:hover {
    background-color: #f0f0f0;
  }
`;
