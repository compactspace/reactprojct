

import { PhoneMainBanner } from '../component/mainbodycomponent/PhoneMainBanner'
// PhoneMainBody2 으로 수정중
import { PhoneMainBody } from '../component/mainbodycomponent/phonemainbody'

import {ExistCookie} from '../component/ExistCookie/ExistCookie'
import { PhoneHeader } from '../header/phoneheader'
import { PhoneNewHeader } from '../header/PhoneNewHeader'
import { PhoneMainBody2 } from '../component/mainbodycomponent/phonemainbody2'

import { MainFooter } from '../component/mainfootercompoent/mainfooter'





import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'

import styled from 'styled-components'

import drawing from '../img2/drawing.jpg'
import coffee from '../img2/coffee.jpg'
import coffee2 from '../img2/coffee2.jpg'


import work_img1 from '../img2/work_img1.jpg'
import work_img2 from '../img2/work_img2.jpg'
import work_img3 from '../img2/work_img3.jpg'
import work_img4 from '../img2/work_img4.jpg'
import work_img5 from '../img2/work_img5.jpg'


import work_img21 from '../img2/work_img21.jpg'
import work_img22 from '../img2/work_img22.jpg'
import work_img23 from '../img2/work_img23.jpg'
import work_img24 from '../img2/work_img24.jpg'
import work_img25 from '../img2/work_img25.jpg'




import pro1 from '../img2/pro1.jpg'
import pro2 from '../img2/pro2.jpg'
import pro3 from '../img2/pro3.jpg'
import pro4 from '../img2/pro4.jpg'
import pro5 from '../img2/pro5.jpg'


import newpro1 from '../img2/newpro1.jpg'
import newpro2 from '../img2/newpro2.jpg'
import newpro3 from '../img2/newpro3.jpg'
import newpro4 from '../img2/newpro4.jpg'
import newpro5 from '../img2/newpro5.jpg'


import handpro1 from '../img2/handpro1.jpg'
import handpro2 from '../img2/handpro2.jpg'
import handpro3 from '../img2/handpro3.jpg'
import handpro4 from '../img2/handpro4.jpg'
import handpro5 from '../img2/handpro5.jpg'




import oneday17 from '../img2/oneday17.jpg'
import oneday21 from '../img2/oneday21.jpg'
import oneday41 from '../img2/oneday41.jpg'


const AllWrapper = styled.div`
width: 364px;
`

export const PhoneMainPage = () => {

    //사용자들이 검증한 클래스에서 사용할 이미지 주소 와 정보 배열 백엔드 연결 없어서 어쩔수 없음
    const [img1, setIma1] = useState([
        { img: oneday17, title: "빵빵쿠키만들기", discount: "10%", originp: "20000", discountp: "18000", link: "/phoneonedayclass/0" },
        { img: oneday21, title: "사랑가등초코만들기", discount: "10%", originp: "30000", discountp: "27000", link: "/phoneonedayclass/1" },
        { img: drawing, title: "솜씨그림교실", discount: "10%", originp: "40000", discountp: "36000", link: "/phoneonedayclass/2" },
        { img: oneday41, title: "스킨스쿠버", discount: "10%", originp: "50000", discountp: "45000", link: "/phoneonedayclass/3" },
        { img: coffee2, title: "인기바리스타체험교실", discount: "10%", originp: "60000", discountp: "54000", link: '/phoneonedayclass/4' }
    ]);

    //PhoneMainBody2 컴포에서 사용자들의 솜씨자랑에서 사용할 것
    const [img2, setIma2] = useState([{ img: work_img1, title: "솜씨그림교실", discount: "10%", originp: "20000", discountp: "18000" },
    { img: work_img2, title: "솜씨그림교실", discount: "10%", originp: "30000", discountp: "27000" },
    { img: work_img3, title: "솜씨그림교실", discount: "10%", originp: "40000", discountp: "36000" },
    { img: work_img4, title: "솜씨그림교실", discount: "10%", originp: "50000", discountp: "45000" },
    { img: work_img5, title: "솜씨그림교실", discount: "10%", originp: "60000", discountp: "54000" }]);


    //PhoneMainBody2 컴포에서 사용자들의 솜씨자랑에서 사용할 것
    const [img22, setIma22] = useState([{ img: work_img21, title: "솜씨그림교실", discount: "10%", originp: "20000", discountp: "18000" },
    { img: work_img22, title: "솜씨그림교실", discount: "10%", originp: "30000", discountp: "27000" },
    { img: work_img23, title: "솜씨그림교실", discount: "10%", originp: "40000", discountp: "36000" },
    { img: work_img24, title: "솜씨그림교실", discount: "10%", originp: "50000", discountp: "45000" },
    { img: work_img25, title: "솜씨그림교실", discount: "10%", originp: "60000", discountp: "54000" }]);

    const [img3, setIma3] = useState([
        { img: pro1, title: "빵빵가득필기세트", discount: "10%", originp: "20000", discountp: "18000" },
        { img: pro2, title: "꽃다발가득키트", discount: "10%", originp: "30000", discountp: "27000" },
        { img: pro3, title: "수제접시공예키트", discount: "10%", originp: "40000", discountp: "36000" },
        { img: pro4, title: "친환경물감키트", discount: "10%", originp: "50000", discountp: "45000" },
        { img: pro5, title: "몽글몽글 티코스터", discount: "10%", originp: "60000", discountp: "54000" }
    ]);


    const [img4, setImg4] = useState([
        { img: newpro1, title: "빵방 가방 키링 만들기 키트" },
        { img: newpro2, title: "사랑뿜뿜 초콜릿 만들기 키트" },
        { img: newpro3, title: "심신안정 미니화분 만들기 키트" },
        { img: newpro4, title: "스웨터 바느질 키트" },
        { img: newpro5, title: "사랑가득 레진플라워 키링 키트" }

    ])

    const [img5, setImg5] = useState([
        { img: handpro1, title: "초코 곰돌이 10개입", originp: "20000" },
        { img: handpro2, title: "냥냥 귀여운 술잔", originp: "10000" },
        { img: handpro3, title: "초콜릿을 삼킨 귀여운 곰돌이 칩", originp: "30000" },
        { img: handpro4, title: "고급스러운 수제 커피잔", originp: "110000" },
        { img: handpro5, title: "자연스러운 향이 담긴 수제 섬유탈취제", originp: "70000" }

    ])


    // const ismatchcheck = useMediaQuery({ query: '(max-width:760px)' });

    // const [ismatch, setIsmatch] = useState();

    //     useEffect(() => {

    //         if (ismatchcheck) {
    //             setIsmatch("true")

    //         } else {
    //             setIsmatch("false")

    //         }
    //     }, [ismatchcheck])


    // useEffect 는 어쨋든 한번문 무조건 실행되며
    // 두번째 인자로 값을 넣어주면 그게 변할시 한번만 실행됨     

    const [vmatch, setVmatch] = useState(false);

    //스마트폰 스크롤이벤트에 뭔가..버그가 있는듯 되다 않되다 그럼 아무틈
    // 아마 핸드폰 터치에 암튼 버그있는데 사용가능함 버그는 무시하자.
    let [phonescroll, setPhonescroll] = useState(0);
    
    
    window.addEventListener('scroll', e => {

        let scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
        let windowHeight = window.innerHeight; // 스크린 창
        let fullHeight = document.body.scrollHeight; //  margin 값은 포함 x


        if (scrollLocation + windowHeight > fullHeight || scrollLocation + windowHeight > phonescroll) {
            setVmatch(true);
       
            if(phonescroll ==0){
                setPhonescroll(scrollLocation + windowHeight);
            }
            if (phonescroll >0) {
                console.log(phonescroll);
                return;
            }
          

        }
        //   console.log("추가후 높이: "+scrollLocation + windowHeight+"투르??: "+(scrollLocation + windowHeight >= fullHeight))
        if ((scrollLocation + windowHeight < phonescroll && vmatch) || scrollLocation + windowHeight <= fullHeight && vmatch) {

            setVmatch(false);


        }


    })


    useEffect(()=>{
        
    })



    // console.log("리랜더링확인" + vmatch)
    return (
        <>
            {/* <ExistCookie>
            </ExistCookie> */}
            <AllWrapper className='AllWrapper'>

                <PhoneNewHeader></PhoneNewHeader>
                <PhoneMainBody2 img1={img1} img2={img2} img22={img22} vmatch={vmatch}></PhoneMainBody2>

                <PhoneHeader vmatch={vmatch} ></PhoneHeader>


            </AllWrapper>



            {/* match={ismatch} vmatch={vmatch} 잠시 주석 */}

            {/* <PhoneMainBanner></PhoneMainBanner>               */}
            {/* <PhoneMainBody match={ismatch} img1={img1} img2={img2} img3={img3} img4={img4} img5={img5}></PhoneMainBody>               
                <MainFooter match={ismatch}></MainFooter> */}
        </>

    );


}
