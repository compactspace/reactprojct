import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";

import art from "../../img/art.jpg";
import coock from "../../img/coock.jpg";
import drawing from "../../img/drawing.jpg";
import business2 from "../../img/business2.jpg";
import arrowicon from "../../img2/arrowicon.png";

import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper React components

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";

const MainBodyWrapper = styled.div``;

const MainBro1 = styled.div`
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  grid-template-columns: 50% 50%;
  text-align: center;
  padding: 50px 0;
  position: relative;
  width: 100%;
  /* background-color: red; */
  display: grid;
  height: 291px;
  /* 로우의 개수를 결정하며 길이 */
  grid-template-rows: 100%;
  /* 로우에대한  컬럼의 개수를 결정하며 길이 */
  grid-template-columns: 50% 50%;

  & .test {
    display: grid;

    grid-template-columns: 100%;
  }
  & .test > h3 {
    font-family: "Noto Sans KR", sans-serif;
    color: #212121;
    /* background-color: black; */
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 26px;
  }

  & .test > .classlink {
    text-decoration: none;
    height: 43px;
    width: 35%;
    margin: 0 auto;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 100%;
    align-items: center;
  }

  & .test > .classlink > a {
    width: 100%;
    line-height: 40px;
    text-decoration: none;
    height: 100%;
    position: relative;
    margin: 0 auto;
    border: 0.5px solid #ff5862;
    color: #ff5862;
    border-radius: 10px;
    padding: 10px 10px;
    font-weight: 700;
  }
`;

const MainBro2 = styled.div`
  padding: 50px 0;
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  & > div {
    /* height: 46px;         */
  }

  & > div > h2 {
    font-size: 24px;
    font-weight: bold;
  }

  & .list {
    width: 100%;
    height: 168px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-bottom: 2px;
    border-radius: 4px;
  }

  & .listinfo {
    display: grid;
    grid-gap: 40px;
    padding-top: 10px;
  }

  /* & .swiper-slide{
        width: 210px!important;
    } */

  & .infocontent {
    font-weight: 600;
    font-size: 12px;
  }
  & .infotitle {
    height: 29px;
    font-size: 13px;
    line-height: 14px;
  }

  & .infoprice {
    display: grid;
    grid-template-rows: auto auto auto;
    font-size: 14px;
    position: relative;
    margin-top: 10px;
    padding: 1px;
  }

  & .discountcost {
    display: block;
  }

  & .swiper-slide {
    width: ${(props) =>
      props.match == "true" ? "90px!important" : "210px!important"};
  }

  & .swiper-slide > .swiper-slide-link {
    display: block;
    color: black;
    list-style: none;
  }
`;

const MainBro3 = styled.div`
  padding: 50px 0;
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  height: 480px;

  & .bannerbusiness {
    width: 100%;
    height: 100%;
  }

  & .linkbusiness {
    display: block;
    width: 100%;
    height: 100%;
  }

  & .bannerimg {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;

const MainBro4 = styled.div`
  height: 570px;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 50px 0;

  & ul {
    padding: 0px 0px;
    margin: 0px 0px;
    list-style: none;
  }

  & .bestrank {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 100%;
  }

  & .bestlistkit {
    display: grid;
    grid-template-columns: 30% 60%;
  }

  & .listli {
    //  background: #FF5862;
    border-radius: 10px;
    display: grid;
    /* grid-auto-columns: 10% 40% 40%; */
    grid-template-columns: 10% 30% 60%;
    height: 100px;
  }

  & .listlikit {
    //  background: #FF5862;
    border-radius: 10px;
    display: grid;
    /* grid-auto-columns: 10% 40% 40%; */
    grid-template-columns: 10% 30% 60%;
    height: 100px;
  }

  .action0 {
    display: grid;
    background: #f7b500;
    border-radius: 10px;
  }

  .action {
    display: grid;
    background: #ff5862;
    border-radius: 10px;
  }

  & .listimg {
    display: none;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .action2 {
    display: block;
  }

  .listtext {
    /* font-weight: 800; 
        font-size: 22px; 
        color: rgb(255, 255, 255); */
  }

  .action3 {
    font-weight: 800;
    font-size: 22px;
    color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    /* text-align: center; */
    justify-content: center;
  }

  .action4 {
    justify-content: center;
    display: flex;
    align-items: center;
    font-weight: 800;
    font-size: 22px;
    color: rgb(255, 255, 255);
  }

  & .arrowicon {
    width: 100%;
    height: 100%;
    background-image: url("${arrowicon}");
    background-repeat: no-repeat;
    background-position-x: 80%;
    background-position-y: 95%;
  }

  & .newlistkit {
    display: grid;
    grid-template-columns: 30% 60%;
  }
`;

export const MainBody = (props) => {
  const [classinof, setClassinfo] = useState(null);
  const [infokey, setInfokey] = useState(null);
  const navi = useNavigate();
  let key;
  let resultobj;

  const bestkit = document.getElementsByClassName("bestlistkit");
  const newkit = document.getElementsByClassName("newlistkit");
  // console.log(bestkit);
  // // console.log(bestkit[0].LastChild);
  //  console.log(bestkit[1]);

  // 게씨발 일반함수 속에 프롭스 값을 넣으면 읽을수 없다해서 밖에서 대입하고 가자 씨바.ㄹ
  // let xx=props.img3[x].img;
  let arrayimg3 = [];
  for (let k = 0; k < props.img3.length; k++) {
    arrayimg3.push(props.img3[k].img);
  }
  let arrayimg4 = [];
  for (let k = 0; k < props.img4.length; k++) {
    arrayimg4.push(props.img4[k].img);
  }

  let deep = [...arrayimg3];
  let deep2 = [...arrayimg4];
  let x = 0;

  let IP;

  if (window.location.href.indexOf("localhost") == -1) {
    IP = process.env.REACT_APP_SMARTPHONE_IP;
  } else {
    IP = "localhost";
  }

  let [방금등록된클래스, set방금등록된클래스] = useState(null);
  let [레디스특가상품리스트, set레디스특가상품리스트] = useState(null);
  let [레디스특가상품갯수, set레디스특가상품갯수] = useState(0);

  let [productList, setProductList] = useState(null);
  let [productCnt, setProductCnt] = useState(0);
  useEffect(() => {
    axios.get(`http://${IP}:4000/redisSalePro`).then((res) => {
      const { redisPorductList, redisPorductCnt } = res.data;
      set레디스특가상품리스트(redisPorductList);

      set레디스특가상품갯수(redisPorductCnt);
    });

    axios
      .post(`http://${IP}:4000/user/getBannerTypeList`, {
        uc_bannertype: "A100",
      })
      .then((res) => {
        set방금등록된클래스(res.data.list);
      });

    axios
      .post(`http://${IP}:4000/user/getBannerTypeProductList`, {
        uc_bannertype: "A100",
      })
      .then((res) => {
        const { productList, productCnt } = res.data;

        // console.log(productList[0].product_mainImage);

        setProductList(productList);
        setProductCnt(productCnt);
      });
  }, []);

  const arrays = [1, 2, 3, 4, 5];

  const [check, setCheck] = useState();
  //리랜더링 확인중 주석처리함
  useEffect(() => {
    if (props.match == "true") {
      setCheck(30);
    } else if (props.match == "false") {
      setCheck(50);
    }
  }, [props.match]);

  document.querySelectorAll("div");

  SwiperCore.use(Autoplay);
  return (
    <>
      {/* <div style={{backgroundColor:"black", height:"400px", width:"400px"}}>
<div style={{backgroundImage: `url(${arrowicon})`}}></div>
</div> */}

      <MainBodyWrapper>
        <MainBro1>
          <div className="test">
            <h3>
              라이프마당에서
              <br></br>
              배움의 즐거움을 찾으세요
            </h3>
            <div className="test">
              {/* <a href="/">란?</a>
                        <a href="/">란?</a> */}
            </div>
          </div>

          <div className="test">
            <h3>
              클래스를 열어줄 선생님
              <br></br>
              여기로 오세요!
            </h3>
            <div className="classlink">
              <a href="/tmain">나도 선생님되기</a>
            </div>
          </div>
        </MainBro1>
        {레디스특가상품갯수 > 0 && (
          <MainBro2 match={props.match}>
            <div>
              <h2 style={{ color: "#797979" }}>
                오늘 뭐할까가 추천하는 반짝 특가 상품
              </h2>
            </div>
            <div className="classlist">
              <Swiper className="FirstBodyrow3siper" spaceBetween={`${check}`}>
                {레디스특가상품리스트.map((obj, index) => (
                  <SwiperSlide Slide className="swiper-slide">
                    <a
                      key={obj.proCode}
                      className="swiper-slide-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navi(`/eproduct/${obj.proCode}`);
                      }}
                    >
                      <div
                        className="list"
                        style={{ backgroundImage: `url(${obj.imageUrl})` }}
                      ></div>
                      <div className="listinfo">
                        <div className="infocontent">[{obj.proName}]</div>
                        <div className="infotitle" style={{ color: "#ff5862" }}>
                          [한정상품]
                        </div>
                        <div className="infoprice">
                          <span className="discount">{"10%"}~</span>
                          <span className="cost">[{obj.proPrice}]원</span>
                          <span className="discountcost">
                            [ 남은수량 ]{obj.proQuantity}
                          </span>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </MainBro2>
        )}

        <MainBro2 match={props.match}>
          <div>
            <h2>참여자들이 검증한 최신 인기 클래스</h2>
          </div>
          <div className="classlist">
            <Swiper
              className="FirstBodyrow3siper"
              style={
                {
                  // height: "100%",
                  // width: "100%",
                  // position: "relative",
                }
              }
              spaceBetween={`${check}`}
              // slidesPerView={}

              // pagination={{ clickable: true }}
              // autoplay={{ delay: 3000, disableOnInteraction: false }}
              // loop={true}
            >
              {/* 사실 이것도 하드코딩이다 실제 정보는 db에서 받아와야지 */}
              {방금등록된클래스 == null ? (
                <>-불러오는중-</>
              ) : (
                방금등록된클래스.map((obj, index) => (
                  <SwiperSlide Slide className="swiper-slide">
                    <a
                      className="swiper-slide-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navi(
                          `/justregisteredonedayclass/${obj.onedayclass_num}`
                        );
                      }}
                    >
                      <div
                        className="list"
                        style={{ backgroundImage: `url(${obj.reserve_img})` }}
                      ></div>
                      <div className="listinfo">
                        <div className="infocontent">
                          [{obj.onedayclass_name}]
                        </div>
                        <div className="infotitle">[{obj.ClassLocation}]</div>
                        <div className="infoprice">
                          <span className="discount">{"10%"}~</span>
                          <span className="cost">
                            [{obj.onedayclass_price}]원
                          </span>
                          <span className="discountcost">
                            [
                            {obj.onedayclass_price -
                              obj.onedayclass_price * 0.1}
                            ]원
                          </span>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </MainBro2>

        <MainBro2 match={props.match} className="MainBro2 ">
          <div>
            <h2>인기클래스 생생후기</h2>
          </div>
          <div className="classlist">
            <Swiper
              className="FirstBodyrow3siper"
              style={
                {
                  // height: "100%",
                  // width: "100%",
                  // position: "relative",
                }
              }
              spaceBetween={`${check}`}
              // slidesPerView={}

              // pagination={{ clickable: true }}
              // autoplay={{ delay: 3000, disableOnInteraction: false }}
              // loop={true}
            >
              {/* 사실 이것도 하드코딩이다 실제 정보는 db에서 받아와야지 */}
              {props.img2.map((obj, index) => (
                <SwiperSlide className="swiper-slide">
                  <a className="swiper-slide-link">
                    <div
                      className="list"
                      style={{ backgroundImage: `url(${obj.img})` }}
                    ></div>
                    <div className="listinfo">
                      <div className="infocontent">원데이클래스</div>
                      <div className="infotitle">[안양시]{`${obj.title}`}</div>
                      <div className="infoprice">
                        {/* <span class="discount">20%</span>
                                            <span class="cost">20,000원~</span>
                                            <span class="discountcost">20,000원~</span> */}
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </MainBro2>

        <MainBro3>
          <div className="bannerbusiness">
            <a className="linkbusiness" href="/">
              <div
                className="bannerimg"
                style={{ backgroundImage: `url(${business2})` }}
              ></div>
            </a>
          </div>
        </MainBro3>

        <MainBro4 className="MainBro4">
          <div>
            <h1 style={{ color: "#797979" }}>클래스 키트</h1>
          </div>

          <div className="bestrank">
            <div className="best">
              <h2 style={{ color: "#797979" }}>best키트</h2>
              <div className="bestranklist list">
                <ul>
                  {props.img3.map((obj, index) => {
                    return (
                      <>
                        <li className="listli">
                          <div>{index}</div>

                          <div
                            className="listimg"
                            style={{ backgroundImage: `url(${obj.img})` }}
                          ></div>

                          <div className="listtext">
                            [{obj.title}] {obj.originp}
                          </div>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="new">
              <h2 style={{ color: "#797979" }}>신규키트</h2>
              <div className="newranklist list">
                <ul>
                  {props.img4.map((obj, index) => {
                    return (
                      <>
                        <li className="listlikit">
                          <div>{index}</div>

                          <div
                            className="listimg"
                            style={{ backgroundImage: `url(${obj.img})` }}
                          ></div>
                          <div className="listtext">
                            [{obj.title}] {obj.originp}
                          </div>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </MainBro4>

        {productCnt > 0 && (
          <MainBro2 match={props.match}>
            <div>
              <h2 style={{ color: "#797979" }}> 인기 수제 제품을 모아봤어요</h2>
            </div>
            <div className="classlist">
              <Swiper className="FirstBodyrow3siper" spaceBetween={`${check}`}>
                {/* 사실 이것도 하드코딩이다 실제 정보는 db에서 받아와야지 */}
                <SwiperSlide className="swiper-slide">
                  {productList.map((obj, index) => (
                    <a
                      className="swiper-slide-link"
                      key={obj.product_num}
                      onClick={() => {
                        navi(
                          `/gproduct/${obj.product_num}/${obj.onedayclass_num}`
                        );
                      }}
                    >
                      <div
                        className="list"
                        style={{
                          backgroundImage: `url(${obj.product_mainImage})`,
                        }}
                      ></div>

                      <div className="listinfo">
                        {/* <div class="infocontent">원데이클래스</div> */}
                        <div className="infotitle">{obj.product_name}</div>
                        <div className="infoprice">
                          <span className="discount"></span>
                          <span className="cost">{obj.product_price}</span>
                          <span className="discountcost"></span>
                        </div>
                      </div>
                    </a>
                  ))}
                </SwiperSlide>
              </Swiper>
            </div>
          </MainBro2>
        )}
      </MainBodyWrapper>
    </>
  );
};
