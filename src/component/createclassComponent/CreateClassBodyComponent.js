import React, { useEffect, useState } from "react";

import styled from "styled-components";
import oneday42 from '../../img2/oneday41.jpg'
import axios from "axios";
// 리랜더링 테스트 용도임
import { DetailMypage } from '../../body/detailmypage'

import { useNavigate } from "react-router-dom";

import { MyInfoBodyComponent } from '../../component/MyInfoBodyComponent/MyInfoBodyComponent'
import {MyCLassAuthoComponent} from '../../component/createclassComponent/MyCLassAuthoComponent'

const MyPageAllWrapper = styled.div`

//현재 디스플레이 플레스 는 LeftAllWrapper 와 연관있는데 필요없어서 주석처림
//안그러면 모달창 위치가 계속 꼬임..
    /* display: flex; */
    gap: 24px;
    margin: 20px auto 0;
    max-width: 1200px;
//css
 & .LeftAllwrapper{

    border: 1px solid #ebebeb;
    border-radius: 12px;
    flex: 0 0 282px;
    height: fit-content;
    margin-top: 12px;

 & ul{
    padding: 0 0;
    margin: 0 0;
 }
    & #last{
        border-bottom:none !important;
    }
    & li{
        border-bottom: 1px solid #ebebeb;
    height: 60px;
    line-height: 24px;
    list-style: none;
    padding: 0 24px;

  & a{   
    color: #333;
    display: flex;
    height: inherit;
    justify-content: space-between;
    text-decoration: none;
/* 주의 하라, 텍스트의 align-items: center; 를 쓰러면 해당 태그를 grid나, flex로 선언해야한다고한다. */
    align-items: center;
  }

    }
 }

& .RightAllwrapper{
    width: 100%;


    & .Rightwrapper{
        margin-left: 24px;
    }

    & h1{
        -webkit-line-clamp: 2;
    
    color: #333;    
    line-height: 29px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-line;
    word-break: keep-all;

    }

    & .pageheader{

        line-height: 21px;
    padding: 16px 0;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    }


 & .reserveul{

    margin-bottom: 24px;

& .reservelist{
    display: flex;
    flex-direction: row;
    padding: 16px 0;
    position: relative;

& .reserveimg{

    background-color: #eee;
    border: none;
    border-radius: 8px;   
    flex-shrink: 0;
    height: 120px;
    margin-right: 16px;
    padding: 0;
    width: 120px;
    background-color: #f5f7fa;
    background-position: 50%;
    background-size: cover;
  
    
}

& .infobox{
    display: flex;
    flex-direction: column;

    & .reservestatus{

        align-items: center;
    display: flex;
    flex-direction: row;
    }

    & .detail{

        display: flex;
    flex-direction: row;
    margin-top: 16px;

        & a{
            align-items: center;
    background: #ebebeb;
    border-radius: 8px;
    color: #333;
    display: flex;
    height: 32px;
    justify-content: center;
    line-height: 14px;
    width: 80px;
        }

    }


}


}

 }


}



`





export const CreateClassBodyComponent= (props) => {



    let [showdetail, setShowdetail] = useState(false);


    let [choicedetail, setChoiceDetail] = useState(null);



    let [myinfo, setMyInfo] = useState(false);
    let infolist = props.reservelist;
    // console.log(props)
    let navi = useNavigate();
    let btn;



    const OpenMyInfo = () => {
        setMyInfo(true);


    }









    return (<>
        <MyPageAllWrapper className="MyPageAllWrapper">
            {/* 현재 필요없는 왼쪽은 주석처리 */}
            {/* <div className="LeftAllwrapper">
                <ul>
                    <li><a>이용내역</a></li>
                    <li onClick={OpenMyInfo}><a>개인정보</a></li>
                    <li id='last'><a>기타알림</a></li>
                </ul>

            </div> */}


            {/* 여기서 갈아 끼우면 될까 싶었는디...  실패했댱 ..ㅎ 아니 가능할듯.! */}
<MyCLassAuthoComponent></MyCLassAuthoComponent>




        </MyPageAllWrapper>

    </>);
}