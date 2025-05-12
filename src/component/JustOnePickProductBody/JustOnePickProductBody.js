import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { PayORAferPayModal } from '../modalcomponent/PayORAferPayModal'


import { useCookies } from "react-cookie";

import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components


import Calendar from 'react-calendar';

import { useNavigate } from 'react-router-dom'
import '../../../src/body/schedul.css'
import { ReservedModal } from '../modalcomponent/reservedmodal'

import back1 from "../../img2/backicon.jpg"
import back2 from "../../img2/backicon2.jpg"

import park from '../../img2/parkicon.jpg'
import time from '../../img2/timeicon.jpg'
import headcount from '../../img2/headcounticon.jpg'
import address from '../../img2/addresicon.jpg'
import axios from "axios";


const AllWrapper = styled.div`
width: 480px;
margin-left: auto;
margin-right: auto;
box-shadow: 0 0 17px 3px rgb(171 171 171 / 50%);
    position: relative;
    background-color: #FFF !important;


& .QnA{

    padding: 10px 0px;
    display: flex;
    width: 480px;
    background: white;
    /* position: fixed; */
    bottom: 0;

    justify-content: end;
    height: 50px;

    & .qnabtn{

        border-radius: 10px 10px 10px 10px;
    text-align: end;
    background-color: #FF5862;
    color: #fff;
    display: flex;
    align-items: center;

   

        /* & button{
            font-size: 18px;
            border: none;
        } */


    }

}


`

const ContentWrapper = styled.div`
    margin: 0;
    padding: 0;



    ///흠.. 아무튼 이상한데
    // header 더의 엄마 또는 조상의 width를 정해도 
    // 자식 손주인 header 의 width: 100%; 는 따로논다.
    // 따라서 잘 모르겠지만 max-widht 480px를 적어주자..
    & .header{
        z-index: 13;
        height: 50px;
        max-width :480px;
        width: 100%;
justify-content: space-between;
display: flex;
flex-direction: row;
position: fixed;
top: 0;

& img{
height: 100%;
width: 50px;

}

    }


& .contentbodywrapper{
    max-width :480px;
    width: 480px;
    margin: 0px auto;
    height: 430px;

& .imgarea{

    height: 430px;


   & .videobanner {
            height: 100%;
            width: 100%;
          
            object-fit: cover;
        }


& .candidateimg{
    height: 10%;
}


& .mainimg{
    height: 85%;
& img{

    height: 100%;
}

}

}


& .swipermcandidateimg{

    padding: 10px 20px;
   
    height: 100%;

    & img{
        height: 100%;
    } 
}


}


& .titlearea{

    position: relative;
    margin: 15px;
    margin-bottom: unset;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(230, 230, 230, 0.5);


& .titlename{
    font-family: NanumSquare, 'Noto Sans KR', sans-serif;
    margin-right: 0px;
    margin-bottom: 10px;
    font-weight: 400;
    font-size: 13px;
    line-height: 15px;
    color: #252525;
}

& .titleinfo{
    color: #252525;
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: -0.08px;
    margin-bottom: 15px;
}


}

& .classdetailarea{
    display: flex;
    margin: 20px 15px;
    margin-bottom: unset;
    padding-bottom: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    & >.adress{
        display: flex;
    flex-flow: row;
    gap: 10px;
    color: #252525;
    font-size: 15px;
    font-weight: 700;
    align-items: center;


    }

& >.park{
    display: flex;
    flex-flow: row;
    gap: 10px;
    color: #252525;
    font-size: 15px;
    font-weight: 700;
    align-items: center;

}

& >.time{
    display: flex;
    flex-flow: row;
    gap: 10px;
    color: #252525;
    font-size: 15px;
    font-weight: 700;
    align-items: center;

}

& >.headcount{
    display: flex;
    flex-flow: row;
    gap: 10px;
    color: #252525;
    font-size: 15px;
    font-weight: 700;
    align-items: center;

}


}

& .close{
    width: 480px;
    /* position: fixed; */
    top:380px;
    background-color: white;
  
    z-index: 100;
    
}


& .restseat{
    width: 80%;
    margin: 0 auto;
display: grid;
grid-gap: 60px;
grid-template-columns: 20% 20% 20%;

}




 & .one{
    
 }
 & .two{
   
 }
 & .three{
    
 }

& .btn{
   margin:10px auto;
    display: block;
    background-color: #FF5862;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    width: 80%;
    height: 50px
}




`

const Reivewwrapper = styled.div`

padding-top: 30px !important;


& .reivewarea{

    display: flex;
    justify-content: space-between;

}

& .reviewtextarea{


    padding: 24px 18px;
    border-radius: 5px;
    background-color: #F8F8F8;
    margin-bottom: 10px;
}


& .reviewheader{

    display: flex;
    width: 100%;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: flex-start;
    align-items: center;

}


& .reviewimg{
    width: 40px;
    height: 40px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
    margin-right: 10px;
}

//css

& .reviewbody{margin-top: 10px;
    height: 105px;
    font-size: 14px;
}

& .writereview{

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}


& .justname{text-align: center;
    width: 70px;
    background-color: #FF5862;
    color: #fff;
    border-radius: 3px 3px 3px 3px;}


`




export const JustOnePickProductBody = (props) => {


    let IP
    if (window.location.href.indexOf("localhost") == -1) {
        IP = process.env.REACT_APP_SMARTPHONE_IP;
    } else {
        IP = "localhost"
    }




    console.log(props)

    let [cookie, setCookie] = useCookies(["userid"]);


    //let testid=window.localStorage.getItem('id');

    let testid = cookie.userid;


    // console.log("testid::  "+testid)

    let onedayclass_num = props.onedayclass_num;
    //   console.log(onedayclass_num);

    //OnedayClass.js 컴포에서 props스에 사진과, 외부호스팅 동영상 주소를 넘겨주고있어서
    //문자열 확인하는 그냥 반복문임
    // for(let i=0; i<props.onedayimg.length; i++){
    //     console.log(props.onedayimg[i].indexOf("http"))      
    // }




    let userId = window.localStorage.getItem("userId");

    //스크립트를 심는 기법이다.
    const script1 = document.createElement("script");
    script1.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script1.type = "text/javascript";
    script1.async = true;
    document.head.appendChild(script1);

    let naviegate = useNavigate();
    const [choiceclick, setChoiceclick] = useState([])
    const [openmodal, setOpenmodal] = useState(false);
    const [choiceday, setChoiceday] = useState(null);
    const [choiceforforDB, setChoiceforforDB] = useState(null);



    const [open, setOpen] = useState(false)


    //페이징을 위한 state이다.
    let [review, setReivew] = useState(null)





    //팩트체크함 자식전용 스테이트가 자식에서 변경시 애미 컴포는 무반응
    //console.log("자식컴포")
    let test;

    let close;

    let isWeekend;
    let choice;

    //달력은 필요 없으니 주석처리함.
    // useEffect(() => {
    //     test = document.getElementsByClassName("react-calendar__tile react-calendar__month-view__days__day");

    //     let restseat1 = document.getElementsByClassName("one")
    //     let restseat2 = document.getElementsByClassName("two");
    //     let restseat3 = document.getElementsByClassName("three");
    //     //console.log(test)
    //     for (let k = 0; k < test.length; k++) {

    //         test[k].addEventListener("click", (e) => {
    //             // e.stopPropagation();


    //             isWeekend = e.currentTarget.className.indexOf("weekend");

    //             //어쩔수 없다. 지금 이벤트가, 서로 겹치고 난리라 e.target != e.currentTarget 기법을 활용
    //             //e.currentTarget 는 진짜 이벤트가 걸린걸 가르키고
    //             // e.target 는 이벤트가 전파된 놈까지 감지함
    //             if (e.target != e.currentTarget) {
    //                 choice = e.target.getAttribute("aria-label");
    //             }
    //             else {
    //                 choice = e.target.firstChild.getAttribute("aria-label");
    //             }

    //             if (isWeekend == -1) {
    //                 alert("주말예약만 가능합니다.");
    //                 return;
    //             }

    //             //aria-label

    //             //아이고 혈압이야.. 한글로 년 월 일 처리 되어있네
    //             let years = choice.split("년")[0].replace("년", '').trim();
    //             let month = choice.split("년")[1].split("월")[0].trim();
    //             let day = choice.split("년")[1].split("월")[1].replace("일", '').trim();


    //             // console.log("년: "+years);
    //             // console.log("월: "+month);
    //             if (month.length == 1) {
    //                 month = '0' + month;
    //             }
    //             if (day.length == 1) {
    //                 day = '0' + day;
    //             }
    //             let choiceforforDB = years + '-' + month + '-' + day;

    //             console.log(choiceforforDB);
    //             setChoiceforforDB(choiceforforDB);



    //             axios.get('http://localhost:4000/noneuser/checkoutrest?onedayclass_num=' + `${props.onedayclass_num}` + '&openday=' + `${choiceforforDB}`)
    //                 .then((result) => {

    //                     let rest = result.data.rest;
    //                     console.log(result.data)
    //                    // console.log("반영이 않되는듯 왜? 스테이트가 변해야 하니까!! 어떻게? setState함수로!")

    //                     if (rest == -1) {
    //                         close = rest;
    //                         console.log("잠시후 다시 시도해주세요")
    //                     } else if (0<rest || rest<=10) {
    //                         close = rest;

    //                         restseat1[0].innerHTML = `<span>${rest}</span> <span>자리 남음</span>`
    //                     } else {
    //                         close = rest;

    //                         restseat1[0].innerHTML = `<span>예약완료</span> <span>0자리 남음</span>`
    //                     }

    //                 })
    //                 .catch(() => { console.log("뭔가 에러") })             

    //         })
    //     }
    //     //개별 페이지 리뷰
    //     axios.get('http://localhost:4000/user/reivew?limit=0 &onedayclass_num=' + `${props.onedayclass_num}`


    //     ).then((res) => {
    //         // console.log(res.data);
    //         // console.log(res.data.reviews);
    //         setReivew(res.data);

    //     })





    // }, [])



    //잠시 모달테스트용 클릭함수
    const Modal = () => {


        setOpenmodal(true);

    }

    let morereviewbtn;
    if ((morereviewbtn = document.getElementById("morereviewbtn")) != undefined) {


        morereviewbtn.addEventListener('click', () => {
            //넥스트 페이지 버튼 누른후 리뷰 조금 로직이 다름
            let limit = (`${review.buttoncnt}`);


            axios.get('http://localhost:4000/user/nextreivew?limit=' + limit + '&onedayclass_num=' + `${props.onedayclass_num}`


            ).then((res) => {

                console.log(res.data);
                // console.log(res.data.end_flag)

                // if(res.data.end_flag){

                //     res.data.reviews=review.reviews;

                // }
                setReivew(res.data);

            })



        });



    }

    //
    let backmorereviewbtn;
    if ((backmorereviewbtn = document.getElementById("backmorereviewbtn")) != undefined) {


        backmorereviewbtn.addEventListener('click', () => {



            let limit = (`${review.backbuttoncnt}`);

            let url = 'http://localhost:4000/user/backreivew?limit=' + limit + '&onedayclass_num=' + `${props.onedayclass_num}`
                + "&start_flag=" + `${review.start_flag}`
            axios.get(url).then((res) => {

                console.log(res.data);
                setReivew(res.data);



            });


        });






    }



    let [결재할래나중에할래, set결재할래나중에할래] = useState(false);

    let [특가상품, set특가상품] = useState(null);



    SwiperCore.use(Autoplay);
    return (<>

        <button onClick={Modal}>모달테스트 버튼</button>
        <AllWrapper className="AllWrapper">
            <ContentWrapper>
                <div className="header">
                    <div className="leftheader">
                        {props.vmatch ?
                            <>
                                <img src={`${back1}`} onClick={() => {
                                    naviegate("/main2")
                                }}></img>
                            </>
                            :
                            <>
                                <img src={`${back2}`} onClick={() => {
                                    naviegate("/main2")
                                }}
                                ></img>
                            </>
                        }
                    </div>
                    <div className="rightheader"></div>
                </div>
                <div className="contentbodywrapper">
                    <div className="imgarea">
                        <div className="mainimg">


                            {props.onedayimg[0].indexOf('http') == 0 ? <>

                                <video className="videobanner"
                                    muted
                                    autoPlay
                                    loop
                                >
                                    {/* 

                                    주의사항
                                    호스팅 사이트가 https://www.pexels.com/ko-kr/videos/

                                    라 작성자들이 동영상 지우거나 하면 동영상 못불러올 가능성도있음 에러나면 주소 링크 의심해볼것

                                https://videos.pexels.com/video-files/17486817/17486817-uhd_2560_1440_60fps.mp4
                                
                                https://videos.pexels.com/video-files/9968970/9968970-uhd_2560_1440_25fps.mp4
                                
                                
                                */}
                                    <source src="https://videos.pexels.com/video-files/17486817/17486817-uhd_2560_1440_60fps.mp4" type="video/mp4" />
                                    <strong>Your browser does not support the video tag.</strong>
                                </video>

                            </> :

                                <>
                                    <Swiper className="swipermainimg" style={{ height: "100%" }} slidesPerView={1}>

                                        {


                                            props.onedayimg.map((obj, index) => (


                                                <SwiperSlide Slide class="swiper-slide" >
                                                    {choiceclick.length == 0 ? <>
                                                        <img style={{ width: "100%" }} src={`${obj}`}></img >

                                                    </> :

                                                        choiceclick[0] != null ?
                                                            <>
                                                                <img style={{ width: "100%" }} src={`${props.onedayimg[choiceclick[0]]}`}></img >
                                                            </>

                                                            : <></>

                                                    }
                                                </SwiperSlide>
                                            ))}

                                    </Swiper>

                                </>

                            }




                        </div>
                        <div className="candidateimg">
                            <Swiper className="swipermcandidateimg" style={{ padding: "5px 4px !important" }}
                                slidesPerView={7}>

                                {props.onedayimg.map((obj, index) => (

                                    <SwiperSlide Slide class="swiper-slide" >
                                        <img className="candidatelist" style={{ width: "57.33px" }} src={`${obj}`}

                                            onClick={obj[0].indexOf("http") == 0 ?
                                                this.disabled = true



                                                : () => {

                                                    let deep1 = [...choiceclick];
                                                    deep1[0] = index;
                                                    setChoiceclick(deep1);
                                                }}


                                            className="imgs"></img >
                                    </SwiperSlide>
                                ))
                                }
                            </Swiper>
                        </div>
                    </div>

                </div>


                <div className="classdetailarea">

                    <div className="adress">
                        <div style={{ height: "20px" }}><img style={{ height: "100%" }} src={`${address}`}></img></div>
                        <div>상품명</div>
                        <div>{props.proinfo.proName}</div>

                    </div>
                    <div className="park">

                        <div style={{ height: "20px" }}><img style={{ height: "100%" }} src={`${park}`}></img></div>
                        <div>상품가격 {props.onedayinfo[1] == null ?
                            <span>[채팅문의 주세요]</span>
                            :

                            props.proinfo.proPrice}
                        </div>

                    </div>
                    <div className="time">

                        <div style={{ height: "20px" }}>
                            <img style={{ height: "100%" }} src={`${time}`}></img>
                        </div>
                        <div> 상품수량 {props.onedayinfo[2] == null ?
                            <span>[채팅문의 주세요]</span> :

                            props.proinfo.proQuantiry}
                        </div>


                    </div>
                    <div className="headcount">

                        <div style={{ height: "20px" }}>

                            <img style={{ height: "100%" }} src={`${headcount}`}></img>

                        </div>
                        <div> 인기상품 {props.onedayinfo[3] == null ?
                            <span>[채팅문의 주세요]</span>

                            : "1인 1구매만 가능"}

                        </div>

                    </div>

                </div>

                {/* <div className="schedul">
                    <Calendar >
                    </Calendar>

                    <div className="restseat">
                        <div className="restseats">
                            <div>

                            </div>
                            <div className="one">

                            </div>

                        </div>
                        <div className="restseats">
                            <div className="two">

                            </div>
                        </div>
                        <div className="restseats">
                            <div className="three">

                            </div>
                        </div>
                    </div>

                </div> */}


                <div className="QnA">


                    {/*단순 담기는 redis 가 담당 하고 실제 결제/ 취소 시에 DB에 반영한다.
                    */}




                    <div className="qnabtn" onClick={() => {
                        if (cookie.userid == null || cookie.userid == undefined) {
                            alert("특가상품 구매는 로그인이 필요합니다.");
                            return;
                        }

                        let data = { "userid": cookie.userid, "redisproductcode": props.redisproductcode }


                        let headers = { "content-type": "application/json" }

                        axios.post(`http://${IP}:4000/redisSaleAddCartProinfo`, data, { headers })
                            .then((res) => {

                                let { redisStatusCode,proinfo } = res.data;
                                console.log(redisStatusCode,"  상품정보는:   ",proinfo)
                                if (redisStatusCode == 0) {
                                    alert("그새 품절되었습니다.")
                                    return;
                                } else if (redisStatusCode == -1) {
                                    alert("특가상품은 1인 1주문 입니다.")
                                    return
                                }
                                else {
                                    alert("장바구니에 담았습니다.")
                                    let 제이슨으로변경=JSON.parse(proinfo);
                                    set특가상품(제이슨으로변경);
                                    set결재할래나중에할래(true);
                                }


                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    }}>
                        담기/결제하기
                    </div>
                </div>
                <Reivewwrapper className="reivewwrapper" >
                    <div className="reivewarea">
                        <h3>후기 20 개</h3>
                        <h3 onClick={() => {
                            naviegate('/writingreview/' + props.id);
                        }}>후기 작성하기</h3>
                    </div>
                    <div className="justline"></div>
                    {
                        review == null ?

                            <><h3>준비중</h3></>

                            : review.reviews != null ?

                                <>
                                    {
                                        review.reviews.map((v) => {

                                            let index = v.review_create_at.indexOf("T");
                                            console.log("T의 인덱스: " + index)
                                            let review_create_at = v.review_create_at.substr(0, index);
                                            console.log(review_create_at)

                                            return (<>
                                                <div className="reviewtextarea">
                                                    <div className="reviewheader">
                                                        <div className="reviewimg" style={{

                                                            backgroundImage: 'url(' + `${v.review_img == "noimg" ? "../imgss/defaultreviewimg.jpg" : "나중사진경로삽입"}` + ')'

                                                        }} >

                                                        </div>
                                                        <div className="justname">{v.review_name}

                                                        </div>

                                                    </div>
                                                    <div className="justreveiwcreateat">리뷰번호:{v.review_num} 작성일:{

                                                        review_create_at

                                                    }</div>
                                                    <div className="reviewbody">
                                                        <div className="writereview" onError={() => {

                                                        }}>
                                                            {v.review_comment}
                                                            {/* {alert(window.localStorage.getItem("userId"))} */}
                                                        </div>

                                                    </div>


                                                </div>

                                            </>);

                                        })



                                    }

                                    {review.buttoncnt >= 1 ?

                                        review.start_flag ?

                                            <><h3 style={{
                                                textAlign: 'center',
                                                backgroundColor: "#FF5862",
                                                color: "#fff",
                                                borderRadius: " 3px 3px 3px 3px"

                                            }} className="backmorereviewbtn" id="backmorereviewbtn">이전 후기보기</h3>


                                            </> :
                                            <>

                                                <h3 style={{
                                                    textAlign: 'center',
                                                    backgroundColor: "#FF5862",
                                                    color: "#fff",
                                                    borderRadius: " 3px 3px 3px 3px"

                                                }} className="morereviewbtn" id="morereviewbtn">더많은 후기보기</h3>

                                            </>


                                        :






                                        <></>}


                                    {
                                        // 현재 엔드 플레그 에서 이전 후기를 하면 또 스테이이트 난리쳐야하니 그냥 이전후기  주석처리.
                                        review.end_flag ?
                                            <>
                                                {/* <h3 style={{
                                                textAlign: 'center',
                                                backgroundColor: "#FF5862",
                                                color: "#fff",
                                                borderRadius: " 3px 3px 3px 3px"

                                            }} className="backmorereviewbtn" id="backmorereviewbtn">이전 후기보기</h3>
                                             */}
                                            </>

                                            : <>

                                            </>
                                    }



                                </>

                                :
                                <>
                                    <h3 style={{
                                        textAlign: 'center',
                                        backgroundColor: "#FF5862",
                                        color: "#fff",
                                        borderRadius: " 3px 3px 3px 3px"

                                    }} >
                                        등록된 후기가없어요
                                    </h3>
                                </>

                    }
                </Reivewwrapper>





            </ContentWrapper>

        </AllWrapper >
        {결재할래나중에할래 ?
            <>
                <PayORAferPayModal
                    device={"PC"} openmodal={결재할래나중에할래}  proinfo={특가상품}  choiceforforDB={choiceforforDB} fordbobj={props.fordbobj}>

                </PayORAferPayModal>
            </>
            :
            <>
            </>


        }


    </>);

}