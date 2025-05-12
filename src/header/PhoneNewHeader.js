
import styled ,{css}from "styled-components";


const NewsHeaderAllWrapper = styled.div`
    width: 364px;
   
${(props)=>props.ismobilelogin==true? css``:css`
    z-index: 100;
    position: fixed;
    top: 0px;

`}

    background: #FFF0F1;
    height: 60px;
display: flex;
justify-content: center;
     & .NewsHeader{
        display: grid;
        grid-gap: 10px;
        grid-template-columns: 80px 130px 100px;
        height: 100%;
        & .grid{
            display: flex;
            height: 100%;
            & .gridcontent{
                height: 100%;
                width: 100%;
            }

            & .imgcontent{
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-image: url('phoneicon/phonemainicon.png');
            }

            & .centercontent{
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                & .text1{
                    font-style: normal;
                    font-weight: 800;
                    font-size: 11px;

                }
                & .text2{
                    font-style: normal;
    font-weight: 800;
                    color: #FF5862;
                    font-size: 13px;

                }
            }

            & .onedayclass{

                background: #FF5862;
    border-radius: 7px;
    /* padding: 20px 50px; */
    font-style: normal;
    font-weight: 800;
    font-size: 13px;    
    text-align: center;
    color: #FFFFFF;
    display: flex;
    align-items: center;
                & .good{

                }
            }
        }
     }

`

export const PhoneNewHeader = (props) => {


    return (<>
        <NewsHeaderAllWrapper ismobilelogin={props.ismobilelogin} className="NewsHeaderAllWrapper">
            <div className="NewsHeader">
                <div className="grid">
                    <div className="gridcontent imgcontent"  ></div>
                </div>
                <div className="grid">
                    <div className="gridcontent centercontent">
                        <div className="text1">오늘 뭐할까에오신 여러분</div>
                        <div className="text2">환영합니다.</div>
                    </div>
                </div>
                <div className="grid"  >
                    <div className="gridcontent onedayclass">
                        <div className="good">
                            오늘의 추천클래스
                        </div>

                    </div>
                </div>
            </div>

        </NewsHeaderAllWrapper>
    </>);

}