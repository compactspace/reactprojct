import styled, { css } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from 'react-cookie';

import { useSelector, useDispatch } from 'react-redux';
const HeaderAllwrapper = styled.div`

${(props) => props.vmatch == true ?
        css`
           
            `
        :
        css`position: fixed;
bottom: 0px;
background-color: rgb(255, 255, 255);
z-index: 10;
`

    }
 & .headerarea{
    color: #555555;
    display: grid;
    grid-template-columns: 50% 50%;
    height: 60px;
    width: 364px;
    & .grid{
     
      & .gridarea{
        display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
        & .gridcontent{
            display: flex;
        }
      }
    }
 }
`;

export const PhoneHeader = (props) => {


    //아오 로컬 환경하고 와이파이 때문에 계속 지랄병도지네...





    let IP 
    console.log("로컬아니면 -1",window.location.href.indexOf("localhost"))
    if(window.location.href.indexOf("localhost")==-1){
        IP= process.env.REACT_APP_SMARTPHONE_IP;
    }else{
        IP= "localhost"
    }
    
    
    let navi = useNavigate();
   
    const [cookies, setCookie] = useCookies(['userid']); // 쿠키 훅 주의:


    // let data = JSON.parse(window.localStorage.getItem("persist:root"));

    // let { user } = data;
    // console.log(user);










//네이버 로그인자는 LoginLoadingcompoent에서 다음 두개를 저장
// localStorage.setItem("token", accessToken);
// localStorage.setItem("userId", userId)    
let authtoken = localStorage.getItem("token")

//그냥 로그인자는 익스프레스 서버에서 세션아이디와, 유저의 아이디를 쿠키에 저장
//로그인 삼항연산자는 적절히 손보자
    return (<>
        <HeaderAllwrapper vmatch={props.vmatch} className="HeaderAllwrapper">
            <div className="headerarea">
                <div className="grid">
                    <div className="gridarea">
                        

                        {cookies.userid == null ?
                            <>
                                <div className="gridcontent"
                                    onClick={() => {
                                        navi("/phonelogin");
                                    }}
                                >로그인</div>

                            </>

                            :

                            <>
                                <div className="gridcontent"
                                    onClick={() => {

                                        axios.get(`http://${IP}:4000/user/logout`)
                                            .then((res) => {
                                                if (res.data.logoutstatuscode == 1) {
                                                    console.log("로그아웃 성공은 1:  " + res.data.logoutstatuscode);
                                                    alert("로그아웃 하셨습니다.");
                                                    localStorage.clear();  
                                                    navi('/smain');
                                                    return;

                                                }
                                            })



                                    }}

                                >로그아웃</div>

                            </>}


                    </div>
                </div>
              
                {/* <div className="grid">
                    <div className="gridarea">
                        <div className="gridcontent"
                            onClick={() => {
                                axios.get(`http://${IP}:4000/hascookie`)
                                    .then((res) => {
                                        console.log(res.data);
                                        if(res.data.cookiestatuscode == -0){
                                            alert("쿠키 변조하지마세요 경고입니다")
                                            return;
                                        }
                                        if(res.data.cookiestatuscode == -2){
                                            alert("IP변조는 위배됩니다.")
                                            return;
                                        }

                                    })
                                    .catch((err) => { console.log(err) })
                            }}
                        >쿠키유지확인</div>
                    </div>
                </div> */}
                <div className="grid">
                    <div className="gridarea">
                        <div className="gridcontent" onClick={()=>{
                            navi('/phonemypage');
                        }}>내정보</div>
                    </div>
                </div>
            </div>

        </HeaderAllwrapper>


    </>);
}