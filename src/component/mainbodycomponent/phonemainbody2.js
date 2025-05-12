import styled, { css } from 'styled-components';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components

const PhoneMainBodyAllWrapper = styled.div`
position: relative;



${(props) => props.vmatch == true ?
        css`
        top:0px;
        transition: top 2s;
        `
        : 
        css`top: 60px;
         transition: top 2s;
        `};



/* height: 100vh; */
/* background-color: red; */

    & .content1wrapper{
        display: flex;
        flex-direction:column;
        width: 90%;
        margin: 0 auto;
        
        & .content1area{
            display: grid;
            grid-gap: 12px;
            grid-template-columns: 70px 70px 70px 70px;
            grid-template-rows: 60px 60px;

            & .gridcontentarea{

                & .gridcontent{                  
                    display: flex;
                    flex-direction:column;
                    gap:10px;
                    
                    & .imgcontent{
                            display: flex;
                            justify-content: center;
                        
                        & img{
                            width: 30px;
                            height: 30px;

                        }
                    }

                    & .textcontent{
                        font-size: 10px;     
                        text-align:center;

                    }

                }
            }
        }


    }
    & .content2wrapper{
width: 90%;
margin: 0 auto;
padding: 20px 20px;

        & .content2{
            padding: 10px 10px;
        }

     & .swiper-slide-link{
        height: 120px !important;
     }

     & a{
        text-decoration-line: none;
        display: flex;
        flex-direction: column;
        width: 120px;

        & .list{
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size:cover;
            border-radius: 10px;
        }
        & .listinfo{
            display: flex;
            
            & .infotitle{
                color: #212121;
                font-size: 13px;
            }

        }

      }
    }
`

export const PhoneMainBody2 = (props) => {

    let testarr = [1, 2, 3, 4, 5];

    return (<>
        <PhoneMainBodyAllWrapper vmatch={props.vmatch} className='PhoneMainBodyAllWrapper'>
            <div className='content1wrapper'>
                <div>
                    <h3>오늘 뭐할까?</h3>
                </div>
                <div className='content1area'>
                    <div className='grid' >
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/allicon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    ALL클래스
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid'>
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/heartsicon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    불금클래스
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid'>
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/calendaricon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    뜨거운예약
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid'>
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/winningicon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    인기클래스
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid'>
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/ticketicon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    큐티 티켓/공연
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid'>
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/coockicon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    맛집클래스
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid' >
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/jarangicon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    솜씨자랑
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid' >
                        <div className='gridcontentarea'>
                            <div className='gridcontent'>
                                <div className='imgcontent' >
                                    <img src='phoneicon/rumoricon.png'></img>
                                </div>
                                <div className='textcontent'>
                                    뜨거운소식
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='content2wrapper'>
                <div>
                    <h3>참여자들이 검증한 클래스</h3>

                </div>
                <div className='content2'>
                    <Swiper className='FirstBodyrow3siper' style={{
                        // height: "100%",
                        // width: "100%",
                        // position: "relative",

                    }}

                        spaceBetween={10}
                        slidesPerView={2.5}

                    >

                        {/* 사실 이것도 하드코딩이다 실제 정보는 db에서 받아와야지 */}
                        {props.img1.map((obj, index) => (


                            <SwiperSlide Slide className="swiper-slide" >
                                <a className="swiper-slide-link" href={`${obj.link}`} >
                                    <div className="list" style={{ backgroundImage: `url(${obj.img})` }}></div>
                                    <div class="listinfo">
                                        <div class="infotitle">
                                            [안양시]{`${obj.title}`}
                                        </div>
                                    </div>
                                </a>

                            </SwiperSlide>


                        ))}
                    </Swiper>
                </div>
            </div>

            <div className='content2wrapper'>
                <div>
                    <h3>참여자들의 생생한 솜씨자랑</h3>

                </div>
                <div className='content2'>
                    <Swiper className='FirstBodyrow3siper' style={{
                        // height: "100%",
                        // width: "100%",
                        // position: "relative",

                    }}

                        spaceBetween={10}
                        slidesPerView={2.5}

                    >

                        {/* 사실 이것도 하드코딩이다 실제 정보는 db에서 받아와야지 */}
                        {props.img2.map((obj, index) => (


                            <SwiperSlide Slide className="swiper-slide" >
                                <a className="swiper-slide-link" href={`${obj.link}`} >
                                    <div className="list" style={{ backgroundImage: `url(${obj.img})` }}></div>
                                    <div class="listinfo">
                                        <div class="infotitle">
                                            [안양시]{`${obj.title}`}
                                        </div>
                                    </div>
                                </a>

                            </SwiperSlide>


                        ))}
                    </Swiper>
                </div>

                <div className='content2'>
                    <Swiper className='FirstBodyrow3siper' style={{
                        // height: "100%",
                        // width: "100%",
                        // position: "relative",

                    }}

                        spaceBetween={10}
                        slidesPerView={2.5}

                    >

                        {/* 사실 이것도 하드코딩이다 실제 정보는 db에서 받아와야지 */}
                        {props.img22.map((obj, index) => (


                            <SwiperSlide Slide className="swiper-slide" >
                                <a className="swiper-slide-link" href={`${obj.link}`} >
                                    <div className="list" style={{ backgroundImage: `url(${obj.img})` }}></div>
                                    <div class="listinfo">
                                        <div class="infotitle">
                                            [안양시]{`${obj.title}`}
                                        </div>
                                    </div>
                                </a>

                            </SwiperSlide>


                        ))}
                    </Swiper>
                </div>
            </div>


        </PhoneMainBodyAllWrapper>
    </>);
}