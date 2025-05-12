import styled from "styled-components";

export const BusinessAuthoModalStyle = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 정중앙 위치로 보정 */
  z-index: 9999;

  width: 100%;
  height: 600px;
  display: flex;

  & .modal {
    height: 100%;
    & #oldpwdyes {
      display: none;
    }

    .oldpwdyesaction {
      display: block !important;
      color: #00c73c;
    }

    & #oldpwdno {
      display: none;
    }

    .oldpwdnoaction {
      display: block !important;
      color: #de4b50;
    }

    @media (max-width: 609px) {
      justify-content: center;
    }
    @media (min-width: 610px) and (max-width: 900px) {
    }
  }

  .modalaction {
    display: flex !important;
  }

  .modal_body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 720px;
    width: 100%;

    & .cancleconfirmarea {
      display: flex;
      justify-content: space-around;
    }

    //메디아

    @media (min-width: 345px) and (max-width: 500px) {
      padding: 0 0;
      height: 500px; //모달의 세로크기
      width: 344px; //모달의 가로크기
    }

    @media (min-width: 501px) and (max-width: 609px) {
      padding: 0 0;
      height: 400px; //모달의 세로크기
      width: 400px; //모달의 가로크기
    }
    @media (min-width: 610px) and (max-width: 900px) {
      left: 50%;
      height: 600px; //모달의 세로크기
      width: 400px; //모달의 가로크기
    }
    & .getauthoareapwd {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      & .alertinfo {
        display: none;
      }

      .noactioninfo {
        display: block !important;
        color: red;
      }
      .yesactioninfo {
        display: block !important;
        color: green;
      }
    }

    & .getauthoareaWrapper {
      display: flex;
      flex-direction: column;

      & .getauthoarea {
        /* display: flex;
                justify-content: center; */
        height: 50px;
        vertical-align: middle;
        width: 100%;
      }

      & input {
        display: inline-block;
        width: 80%;
        border: none;
        border-bottom: 1px solid;
      }

      & #getauthomeseeage {
        align-items: center;
        display: flex;
      }
    }

    & .getauthoarea {
      /* display: flex;
                justify-content: center; */

      vertical-align: middle;
      width: 100%;
    }
    & input {
      height: 30px;
      font-size: 15px;
      display: inline-block;
      width: 80%;
      border: none;
      border-bottom: 1px solid;
      margin-bottom: 11px;
    }

    & .samemeseeage {
      display: inline-block;
      background-color: #e4e4e4;
      border-color: #e4e4e4;
      color: #999;
      width: 80%;
      height: 50px;
      & .samebtn {
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }

    & #goauthoarea {
      margin-bottom: 20px;

      & #timeoutarea {
        display: block;
        color: #da1a32;
      }
    }

    position: fixed;
    top: 50%; //모달을 화면가운데 놓기위함.
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px;

    text-align: center;

    background-color: rgb(255, 255, 255); //모달창 배경색 흰색
    border-radius: 10px; //테두리
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15); //테두리 그림자
  }

  .action_getauthoarea {
    display: none !important;
  }

  /* & .goauthoarea{
    display: none;

} */

  .action_goauthoarea {
    display: block !important;
  }

  & #newpwdarea {
    display: flex;
    flex-direction: column;
    height: 200px;
    & textarea {
      width: 100%;
      height: 100%;
    }

    & input {
      display: inline-block;
    }

    & #noequal {
      display: none;
    }

    & #equal {
      display: none;
    }
  }

  .actionnoequal {
    display: inline-block !important;
  }

  .actionequal {
    display: inline-block !important;
  }
`;
