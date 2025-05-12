import React, { useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";

import receipticon from "../icon/receipt.png";

const ModalBackground = styled.div`
  /* 테스트용 높이 관찰로 나중에 삭제 */

  & .centerPosition {
    max-width: 480px;
    box-shadow: 0 0 17px 3px rgb(171 171 171 / 50%);
    background-color: rgba(26, 112, 220, 0.2117647059);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    z-index: 999;

    & .steponename {
      text-align: center;

      & h3 {
        padding: 50px 0px;
        background: white;
      }
    }
  }
`;

const InputArea = styled.div`
  max-height: 320px;
  height: 220px;
  background-color: #fff !important;
  border-radius: 20px 20px 20px 20px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  padding: 10px 10px;

  & .rowBox {
    display: flex;
  }

  & .reviewarea {
    width: 90%;
    height: 90%;

    & textarea {
      font-size: 30px;
      width: 100%;
      height: 100%;
    }
  }
`;

const BtnArea = styled.div`
  height: 150px;
  width: 480px;

  & .confirmarea {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;

    align-items: center;
    height: 100%;

    & .writerconfirm {
      align-items: center;
      display: flex;

      & button {
        border: none;
        border-radius: 10px 10px 10px 10px;
        height: 40px;
        width: 100px;
        color: white;
        background-color: rgb(59 130 246 / 0.5);
      }
    }
  }
`;

export const WritingReview = (props) => {
  let navi = useNavigate();

  const { onedayclass_num } = useParams();

  const [base64, setBase64] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // ✅ 수정!

    if (!file) return;

    const reader = new FileReader();

    //이미지의 blob 값
    const base64 = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("파일 읽기 실패"));
      reader.readAsDataURL(file);
    });

    //console.log(base64);
    setBase64(base64);
    //image_name

    //file.name
    document.getElementById("image_name").value = file.name;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 막기

    const formData = new FormData(e.target); // 자동 수집

    // 확인용
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    // 필수 입력값 검사
    const review_comment = formData.get("review_comment")?.trim();
    const review_name = formData.get("review_name")?.trim();

    if (!review_comment) {
      alert("리뷰 내용을 입력해주세요!");
      return;
    }

    if (!review_name) {
      formData.set("review_name", "아무개");
    }

    if (base64 != "") {
      formData.set("review_image", base64);
    } else {
      formData.set("review_image", null);
    }
    //const file = formData.get("review_img");
    // console.log(file);
    // console.log(`file.size:   ${file.size}`);

    let bodyData = {
      onedayclass_num: onedayclass_num,
      review_comment: review_comment,
      review_name: review_name,
      review_image: formData.get("review_image"),
      image_name: document.getElementById("image_name").value,
    };

    console.log(bodyData);

    await axios
      .post("http://localhost:4000/user/writingreview", bodyData)
      .then((res) => {
        let { reviewStatusCode } = res.data;
        if (reviewStatusCode == 1) {
          alert("후기가 등록되었습니다.홈으로 이동합니다.");
          navi("/justregisteredonedayclass/" + onedayclass_num);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ModalBackground className="modalBackground">
        <div className="centerPosition">
          <div className="steponename">
            <h3>이용한 클래스 후기를 작성해주세요!!</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <InputArea className="inputArea">
              <div className="reviewarea">
                <textarea
                  id="textarea"
                  name="review_comment"
                  placeholder="
                작성하지 않을경우 기본적으로 `재미있게 이용했습니다.` 로 작성됩니다.
                "
                />
                <div className="rowBox">
                  <div style={label}> 리뷰 등록 닉네임:</div>
                  <input type="text" name="review_name" />
                </div>
                <div className="rowBox">
                  <label htmlFor="review_image" style={label}>
                    사진선택
                  </label>
                  <input
                    id="review_image"
                    className="review_image"
                    type="file"
                    name="review_image"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e)}
                  />

                  <input
                    id="image_name"
                    className="review_image"
                    type="text"
                    name="image_name"
                    readOnly
                  />
                </div>
              </div>
            </InputArea>

            <BtnArea>
              <div className="confirmarea">
                <div className="writerconfirm">
                  <button
                    onClick={() => {
                      navi("/justregisteredonedayclass/" + onedayclass_num);
                    }}
                  >
                    뒤로
                  </button>
                </div>
                <div className="writerconfirm">
                  <button type="submit">등록</button>
                </div>
              </div>
            </BtnArea>
          </form>
        </div>
      </ModalBackground>
    </>
  );
};

const label = {
  width: "120px",
};

const labelTarget = {};
