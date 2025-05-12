import styled, { css } from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { ShowCreateClass } from '../../component/createclassComponent/ShowCreateClass';




const MyInfoWrapper = styled.div`


& .showCreateClass{
            justify-content: center;
   
    display: block;
    
    height: 50px;
    
    justify-content: center;
    display: flex;
   
    border-radius: 10px 10px 10px 10px;

    background-color: #FF5862;
    color: #fff;
    display: flex;
    align-items: center;
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


   &  label {
    display: inline-block;
    padding: 10px 10px;
    color: #fff;
    vertical-align: middle;
    background-color: #999999;
    cursor: pointer;
    height: 30px;
    margin-left: 10px;
}


&  #file {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
}


& .authowrapper{
    align-items: center;
    display: flex;
    justify-content: space-between;
    background: #f5f7fa;
    height: 58px;
    margin-top: 16px;
    padding: 12px 16px;
 & .inconarea{
    display: flex;
    font-size: 14px;
    font-weight: 600;
    color: #49627a;
 }

 & .authobtnarea{
    font-size: 14px;
    font-weight: 600;
    color: #49627a;

    & #authosuccess{
        color:#0068bd !important;
    }

 }
}


& .myinfowrapper{
   display: flex;
   flex-direction: column;  
   gap: 50px;


   & .addimgarea{
        width: 100% !important;

        & #addimgcontent{
            width: 100% !important;
        }

    }



   & .infowrapper{

      


    display: flex;

    @media (max-width: 410px) {

flex-direction: column;
width: 100%;
}


    justify-content: space-between;



   


    & .infoarea{
    display: flex;
    flex-direction: column;
    
    @media (max-width: 410px) {
width: 100%;
}

@media (min-width: 411px){
    width: 50%;
}
    

    & .infoheader{
        color: #707070;
    display: flex;
    line-height: 16px;
    margin-bottom: 4px;
    font-size: 13px;
    font-weight: 600;

       & #duplicbtn{
        color: #4AB56A;
       }

       & #duplicarea{
        width: 80%;
    display: flex;
    justify-content: space-between;
       }

    }


    .dupliccheckaction{
        gap:20px;

    }



    & .infocontent{

        max-width: 480px;        
        display: flex;
       justify-content: space-between;
       background-color: #fafafa;
       border: 1.5px solid #fafafa;
       width: 80%;

       @media (max-width: 609px) {
width: 100%;
}


        & .read{
            padding: 10px 10px;
            display: flex;
            align-items: center;
            width: 100%;

            & input {
                background-color: #fafafa;
                display: inline-block;
                height: 40px;
                 width: 100%;
                 border:none;
            }


        }



    
    & .changeinput::-webkit-input-placeholder{
color: #DE4B50;
    }
    
    
    
    }

  }

   }

 

}


`
const ReadAndWriteWRapper = styled.div`

& .cut{
    width: 100%;
    height: 1px;  
    border-bottom: 1px solid #ebebeb;
   }



 & .change{

    display: flex;
    flex-direction: column;
    gap: 20px;


  
 }

 .actionchange{
    display: none;
 }


& span{

    display: inline-block;
    width: 100%;
    height: 100%;
    font-family: "Noto Sans KR";
    font-weight: 400;
    font-size: 16px;
    color: #707070;
    text-align: center;
    line-height: 30px !important;
    
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 10px;
    background-color: #fafafa;
    @media (max-width: 609px) {

        padding: 0 0;

}
@media   (min-width: 610px) and (max-width: 900px) {
    padding: 0 16px;
    
    }


}

& .changemyinfomodal{
    display: flex;
}

& .changemyinfomodal{
    display: none;
}

.actionchangemyinfomodal{
    display: flex;
    justify-content: space-around;
}

`
// 문자인증
const MessageAuthoarea = styled.div`

        & .modal{

            position: fixed;
    display: flex;
    /* flex-direction: column; */
    /* justify-content: center; */
    top: 0;
    /* left: 0; */
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);


     & #oldpwdyes{
        display: none;
     }


     .oldpwdyesaction{
        display: block !important;        
        color: #00c73c;
     }



     & #oldpwdno{
        display: none;
     }

     .oldpwdnoaction{
        display: block !important;
        color: #DE4B50;
        
     }




    @media (max-width: 609px) {

        justify-content: center;
      

}
@media   (min-width: 610px) and (max-width: 900px) {


}



}
    


            .modalaction{
                display: flex !important;
            }

            .modal_body{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                max-width: 720px;
                width: 100%;

                & .cancleconfirmarea{

                    display: flex;
                    justify-content: space-around;
                }
    


 

//메디아

    @media  (min-width:345px) and (max-width: 500px)   {
                    padding: 0 0;
                    height:500px; //모달의 세로크기 
                    width:344px;  //모달의 가로크기 
                    }



                @media (min-width: 501px) and (max-width: 609px) {
                    padding: 0 0;
                    height:400px; //모달의 세로크기 
                    width:400px;  //모달의 가로크기 
                    }
                @media   (min-width: 610px) and (max-width: 900px) {
                     left: 50%;
                     height:600px; //모달의 세로크기 
                     width:400px;  //모달의 가로크기 
                    }
                    & .getauthoareapwd{
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      gap:10px;  
                      & .alertinfo{
                        display: none;
                      }

                      .noactioninfo{
                        display: block !important;
                        color: red;
                      }
                      .yesactioninfo{
                        display: block !important;
                        color: green;
                      }

                    }   

                   & .getauthoareaWrapper{
                    display: flex;
                    flex-direction: column;


                    
                    
                       & .getauthoarea{
                        /* display: flex;
                        justify-content: center; */
                        height: 50px;
                        vertical-align: middle;
                        width: 100%;
                         }




                      & input{
                         display: inline-block;
                         width: 80%;
                        border: none;
                        border-bottom: 1px solid;
                      }   


                      & #getauthomeseeage{
                            align-items: center;
                            display: flex;
                        }


                   } 

                   & .getauthoarea{
                        /* display: flex;
                        justify-content: center; */
                        height: 50px;
                        vertical-align: middle;
                        width: 100%;
                         }
                      & input{
                         display: inline-block;
                         width: 80%;
                        border: none;
                        border-bottom: 1px solid;
                        
                      }   
                     

                      & .samemeseeage{

                            display: inline-block;
                            background-color: #e4e4e4;
                         border-color: #e4e4e4;
                         color: #999;
                            width: 80%;
                            height: 50px;
                          & .samebtn{
                            display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
                          }   
                        }

                        & #goauthoarea{
                                    margin-bottom: 20px;

                                   & #timeoutarea{
                                    display: block;
                                    color:#da1a32;
                                    }
                                }

                position: fixed;
            top:50%; //모달을 화면가운데 놓기위함. 
        

          
          

            padding:40px;  

            text-align: center;

            background-color: rgb(255,255,255); //모달창 배경색 흰색
            border-radius:10px; //테두리 
            box-shadow:0 2px 3px 0 rgba(34,36,38,0.15); //테두리 그림자 

            transform:translateY(-50%); //모듈창열었을때 위치설정 가운데로 
        }



        .action_getauthoarea{
            display: none !important;
        }



        /* & .goauthoarea{
            display: none;

        } */


        .action_goauthoarea{
            display: block !important;
        }


        & #newpwdarea{
            display: flex;
            flex-direction: column;
            height: 200px;
            & textarea{
                width: 100%;
                height: 100%;
            }

            & input{
                display: inline-block;
            }

            & #noequal{
                display: none;
            }

            & #equal{
                display: none;
            }

        }

        .actionnoequal{
            display: inline-block !important;
        }

        .actionequal{
            display: inline-block !important;
        }



`
const 미리보기모달레퍼 = styled.div`



    ///흠.. 아무튼 이상한데
    // header 더의 엄마 또는 조상의 width를 정해도 
    // 자식 손주인 header 의 width: 100%; 는 따로논다.
    // 따라서 잘 모르겠지만 max-widht 480px를 적어주자..
    & .header{
        z-index: 13;
        height: 50px;
        max-width :480px;
        
justify-content: space-between;
display: flex;
flex-direction: row;
position: fixed;
top: 0;
border-radius: 10px 10px 10px 10px;
    text-align: end;
    background-color: #FF5862;
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

  & .imgmodal{
   

    & .modaltarget{

    }

  }

`



export const MyCLassAuthoComponent = () => {




    let [openmodal, setOpenmodal] = useState();
    let navi = useNavigate();
    const OpenModal = () => {
        if (!openmodal) {
            setOpenmodal(true)
        }
        else {
            setOpenmodal(false)
        }
    }

    let IP
    if (window.location.href.indexOf("localhost") == -1) {
        IP = process.env.REACT_APP_SMARTPHONE_IP;
    } else {
        IP = "localhost"
    }



    let phoneregex;
    let 사업자등록번호;
    const PhoneNumChange = () => {
        사업자등록번호 = document.getElementById("phonNum").value;
        let result = /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
        phoneregex = result.test(사업자등록번호);

    }


    let today = new Date();


    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초

    let milliseconds = today.getMilliseconds(); // 밀리초

    //console.log(hours + ':' + minutes + ':' + seconds + ':' + milliseconds);

    var timeout;
    var time;
    var min;
    var sec;




    let [인증된사업자, set인증된사업자] = useState(false);
    const GetAuthoMeseeage = () => {

        // if (!phoneregex || 사업자등록번호 == null || 사업자등록번호 == undefined) {
        //     alert("핸드폰 형식에 맞지 않습니다 다시 입력해주세요");
        //     document.getElementById("phonNum").value = null;
        //     사업자등록번호 = null;
        //     return;
        // }




        let data = { "사업자등록번호": 사업자등록번호 };
        let headers = { "content-type": "application/json" };
        console.log(data)
        axios.post(`http://${IP}:4000/teacher/authoCorporation`, data, { headers })
            .then((res) => {
                console.log(res.data);

                if (res.data.statuscode == 1) {
                    document.getElementById("timeoutarea").innerHTML = "인증되셨습니다."
                    set인증된사업자(true);
                    setAuthocheck(true);


                    axios.post(`http://${IP}:4000/teacher/insertonedayclassnum`);
                    return;

                }
                else{

                    document.getElementById("timeoutarea").innerHTML = "등록하신 번호로 사업자번호를 조회할 수 없습니다."
                }
             


                //     document.getElementById("getauthoarea").classList.add("action_getauthoarea");
                //     alert("핸드폰으로 받은 인증번호를 입력해주세용");
                //     document.getElementById("goauthoarea").classList.add("action_goauthoarea");

                //      time = 60;
                //      min = "";
                //      sec = ""; 

                //  timeout= setInterval(function () {

                //     min = parseInt(time/60);
                //     sec = time%60;


                //     console.log( min + "분 " + sec + "초"

                //     )     //아웃
                //        time--;
                //        document.getElementById("timeoutarea").innerHTML=min + ":" + sec;
                //     if(time < 0){
                //         clearInterval(timeout);
                //         alert("시간을 초과하였습니다.\n 인증번호를 재 요청 해주세요");
                //          time = 180;
                //          min = "";
                //          sec = ""; 
                //          document.getElementById("timeoutarea").innerHTML="";
                //         axios.get(`http://${IP}:4000/user/messageauthotimeout`)
                //         .then((res=>{
                //             if(res.data.authostatuscode==-1){
                //                 alert("시간이 지났습니다.\n 다시 인증번호를 요청해주세요")
                //             }
                //         }))

                //     }

                // },1000)

            })
            .catch((err) => {

            })



    }





    let authonumberregex;
    let authonumber;
    const AuthonumberNumChange = () => {
        authonumber = document.getElementById("authonumber").value;
        let result = /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
        authonumberregex = result.test(authonumber);

    }

    let [authocheck, setAuthocheck] = useState(false);

    let [내정보객체, set내정보객체] = useState(null);

    let [선생님으로전환, set선생님으로전환] = useState(false);


    const GoAuthonumberNumChange = () => {


        // if (!authonumberregex || authonumber == null || authonumber == undefined) {
        //     alert("핸드폰 형식에 맞지 않습니다 다시 입력해주세요");
        //     document.getElementById("phonNum").value = null;
        //     phonNum = null;
        //     return;
        // }
        clearInterval(timeout);

        time = 180;
        min = "";
        sec = "";
        document.getElementById("timeoutarea").innerHTML = "";

        let data = { "authonumber": authonumber };
        let headers = { "content-type": "application/json" };

        axios.post(`http://${IP}:4000/user/myinfoauthocheck`, data, { headers })
            .then((res) => {

                let { authostatuscode } = res.data
                if (authostatuscode == 1) {

                    alert("인증되셨습니다.\n 개인정보 보호를 위해 \n 가려있던 개인정보가 노출됩니다.");
                    axios.post(`http://${IP}:4000/user/showmyinfo`).then((res) => {
                        //내일 여기서 부터 res.data.authostatuscode 1 -1 로 분기처리하라
                        let { myinfo } = res.data

                        //   console.log(myinfo)
                        set내정보객체(myinfo);
                        setAuthocheck(true);



                    })

                } else if (authostatuscode == -1) {
                    alert("발송해드린 인증번호와.\n일치하지 않습니다. ");
                    return;
                }

            })
            .catch((err) => {

            })
    }



    let changeobj = new Object();
    // changeobj = { "id": null, "user_tell": null, "user_name": null, "email": null }

    changeobj = { "onedayclass_name": null, "onedayclass_price": null, "onedayclass_info": null, "reserve_img": null }
   
   //하..
   let [수업정보상태,set수업정보상태]=useState({ "onedayclass_name": null, "onedayclass_price": null, "onedayclass_info": null, "reserve_img": new Array() ,"classtotalinfo":new Object() });//토탈
   
    console.log(수업정보상태)

    const IdChange = () => {
        changeobj.id = document.getElementById('id').value;
        // 수업정보상태.id= document.getElementById('id').value;
        // let deep = {...수업정보상태};
        //     deep= 수업정보상태;
        //     set수업정보상태(deep);

        //변경 아이디 확인해 두고 또 아이디 살작바꾸면 idCheck는 투루 이기 때문에 처리
        //이게다 이용자들이 상식밖의 행동을 해서 그럼
        if (idCheck) {

            idCheck = false;
        }
        //다지우면 찌거기 빈문자열남음
        if (changeobj.id == '') {
            changeobj.id = null;
            
        }

    }

    const PriceChange = () => {
        changeobj.onedayclass_price = document.getElementById('tell').value;
        수업정보상태.onedayclass_price= document.getElementById('tell').value;
        let deep = {...수업정보상태};         
            set수업정보상태(deep);

        //다지우면 찌거기 빈문자열남음
        if (changeobj.onedayclass_price == '') {
            changeobj.onedayclass_price = null;
            수업정보상태.onedayclass_price=null;
            deep= 수업정보상태;
            set수업정보상태(deep);
        }
       
    }
    const NameChange = () => {

        changeobj.onedayclass_name = document.getElementById('name').value;
        수업정보상태.onedayclass_name= document.getElementById('name').value;
        let deep = {...수업정보상태};           
            set수업정보상태(deep);
        //다지우면 찌거기 빈문자열남음
        if (changeobj.onedayclass_name == '') {
            changeobj.onedayclass_name = null;
            수업정보상태.onedayclass_name=null;
            deep= 수업정보상태;
            set수업정보상태(deep);
        }

    }
    const ClassInfoChange = () => {
        changeobj.onedayclass_info = document.getElementById('email').value;
        let deep = {...수업정보상태};
        deep= changeobj;
        set수업정보상태(deep);
        //다지우면 찌거기 빈문자열남음
        if (changeobj.onedayclass_info == '') {
            changeobj.onedayclass_info = null;
            deep= 수업정보상태;
            set수업정보상태(deep);
        }


    }

    let idCheck = false;
    const IdDuplicCheck = () => {

        if (changeobj.id == undefined || changeobj.id == null) {
            alert("변경하실 아이디를 먼저 입력해주세요");
            return;
        }
        let data = { "id": changeobj.id };
        let headers = { "content-type": "application/json" }

        axios.post(`http://${IP}:4000/user/duplicid`, data, { headers })
            .then((res) => {
                if (res.data.dulicstatuscode == 1) {
                    alert("변경 가능한 아이디 입니다.");
                    idCheck = true;
                } else {
                    alert("이미 사용중인 아이디 입니다.")
                }

            })



    }




    let [내정보변경버튼, set내정보변경버튼] = useState(false)
    const OpenChangeMyInfoModal = () => {
        if (!authocheck) {
            alert("정보 보호를 위해 문자인증이 먼저 필요합니다.")
            return;
        }
        document.getElementById("change").classList.add("actionchange")
        document.getElementById("changemyinfomodal").classList.add("actionchangemyinfomodal")
        set내정보변경버튼(true)
    }

    const CloseChangeMyInfoModal = () => {

        document.getElementById("change").classList.remove("actionchange")
        document.getElementById("changemyinfomodal").classList.remove("actionchangemyinfomodal")
        set내정보변경버튼(false)
    }



    //수업 정보까지 반영을 했으면 이제야 스테이트로 담는다.

    let [수업정보스테이트, set수업정보스테이트] = useState(null)
    const 수업정보반영 = () => {
        changeobj.reserve_img = Base64ImgArray;
        console.log(changeobj)
        // let nullprevent = 0;
        // let 정보갯수 = 0;
        // for (let key in changeobj) {
        //     정보갯수++;
        //     if (changeobj[key] == null || undefined) {
        //         nullprevent++;
        //     }
        // }

        // if (정보갯수 == nullprevent) {
        //     alert("변경할 사항이 없습니다.");
        //     nullprevent = 0;
        //     정보갯수 = 0;
        //     return;
        // }

        // // changeobj = { "id": null, "user_tell": null, "user_name": null, "email": null }

        // if (!authocheck) {
        //     alert("정보 보호를 위해 문자인증이 먼저 필요합니다.")
        //     return;
        // }
        let data = 수업정보상태;

        // if ((changeobj.id != undefined || changeobj.id != null) && !idCheck) {
        //     alert("아이디변경 까지는 중복확인이 필요합니다.\n 중복확인 초록색버튼을 눌러주세요")
        //     return;
        // }




        let headers = { "content-type": "application/json" };

        console.log(changeobj);
        axios.post(`http://${IP}:4000/insertclassinfo`, data, { headers })
            .then((res) => {
                console.log(res.data)
                if (res.data.updatestatuscode == 1) {
                    alert("수업 정보가 반영되었습니다.")
                    setAuthocheck(true);
                    set내정보객체(res.data.myinfo);
                    set선생님으로전환(true);
                    set수업정보스테이트(changeobj)
                    // 솔직히 잘 모르겠는데..하위 컴포에서 상위 컴포의 css 접근이 가능하네
                    document.getElementById("header1").classList.remove("headeraction");
                    document.getElementById("header2").classList.remove("headeraction");
                    document.getElementById("header3").classList.add("headeraction");



                }
                else {
                    alert("잠시후 다시 시도해주세요");
                }
            })

    }




    //주의 할것은 이건 스테이트 이기 때문에 만약 개인정보를 인풋창에 입력하고
    // 비밀번호 변경 스테이트 변경시 인풋창에는 입력된 것처럼 보이나  기존 자바스크립트 값들은 언디파인으로 재 초기화 됨을 주의하자...
    //따라서 적절히 아래 코드를 추가할것이다.
    let [changepwdmodal, setChangepwdmodal] = useState(false);
    const ChangePassWordModal = () => {

        if (!authocheck) {
            alert("정보 보호를 위해 문자인증이 먼저 필요합니다.")
            return;
        }

        console.log(changeobj)

        // 뭔가 꼬여서 잠시 주석처리
        // document.getElementById('id').value = null;
        // document.getElementById('tell').value = null;
        // document.getElementById('name').value = null;
        // document.getElementById('email').value = null;


        setChangepwdmodal(true);

    }


    let oldpwd;
    const PassWordChange = () => {
        oldpwd = document.getElementById("oldpwd").value;
    }

    let [oldpwdcheck, setOldpwdcheck] = useState(false);
    const OldPassWordCheck = () => {


        if (oldpwd == undefined || oldpwd == null) {

            alert("먼저 기존 사용 비밀번호를 입력해주세요");

            return;
        }


        let data = { "password": oldpwd }
        let headers = {
            "content-type": "application/json"
        }

        axios.post(`http://${IP}:4000/user/oldpwdcheck`, data, { headers })
            .then(
                (res) => {




                    if (res.data.statuscode == 1) {
                        alert("기존 비밀번호 확인")
                        setOldpwdcheck(true);
                        document.getElementById("oldpwdyes").classList.add("oldpwdyesaction");
                        document.getElementById("oldpwdno").classList.remove("oldpwdnoaction");




                    }
                    else if (res.data.statuscode == 0) {
                        alert("기존 비밀번호 를 다시 확인해주세요")
                        document.getElementById("oldpwdyes").classList.remove("oldpwdyesaction");
                        document.getElementById("oldpwdno").classList.add("oldpwdnoaction");

                    }
                }
            )
            .catch((err) => {


            })


    }



    let newpwd1
    const NewPwd1 = () => {

        if (!oldpwdcheck) {
            alert("기존비번을 먼저 확인해주세요")
            return;
        }
        newpwd1 = document.getElementById("newpwd1").value;
    }

    const Cleaer = () => {

        console.log("클리어 클릭 newpwd2 :  ", newpwd2)
        if (newpwd2 != undefined || newpwd2 != null) {

            document.getElementById("newpwd1").value = null
            document.getElementById("newpwd2").value = null
        }
    }



    let newpwd2
    let newpwdcheck = false
    const NewPwd2 = () => {

        if (!oldpwdcheck) {
            alert("기존비번을 먼저 확인해주세요")
            return;
        }

        newpwd2 = document.getElementById("newpwd2").value;



        console.log("newpwd1,newpwd2, ", newpwd1, newpwd2)

        if (newpwd1 == newpwd2) {


            document.getElementById("noequal").classList.remove("actionnoequal")
            document.getElementById("equal").classList.add("actionequal")
            newpwdcheck = true
        }
        else {
            document.getElementById("noequal").classList.add("actionnoequal")
            document.getElementById("equal").classList.remove("actionequal")
            newpwdcheck = false
        }




    }

    const GoNewPWDChange = () => {


        console.log("newpwdcheck newpwd2, ", newpwdcheck, newpwd2)
        if (newpwdcheck && newpwd2 != undefined) {
            let data = { "password": newpwd2 };
            let headers = {
                "content-type": "application/json"
            }

            axios.post(`http://${IP}:4000/user/changenewpwd`, data, { headers })
                .then(
                    (res) => {
                        if (res.data.PwdChangeStatusCode == 1) {
                            alert("비밀번호 변경에 성공하였습니다. \n 로그인창으로 이동합니다")
                            navi("/login")
                        }

                    }
                )
                .catch((err) => {


                })



        }
        else {
            alert("새롭게 변경할 비밀번호를 작성해주세요")
        }
    }

    let ImgFileList = new Array();
    let size = 0;
    let Base64ImgArray = new Array();

    const [imageSrcArray, setImageSrcArray] = useState(null);
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
            reader.onload = () => { // FileReader가 성공적으로 파일을 읽어들였을 때 트리거 되는 이벤트 핸들러
                
                
                
                Base64ImgArray.push(reader.result);
              

                let deepBaseImgArray=[...수업정보상태.reserve_img];
                deepBaseImgArray.push(reader.result);

                수업정보상태.reserve_img= deepBaseImgArray;                
                let deep = {...수업정보상태};         
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
    let [미리보기담을상태, set미리보기담을상태] = useState(null)
    const ShowClass = () => {

        console.log(수업정보상태);

        set미리보기(true);
       // set미리보기담을상태(imageSrcArray);
       set미리보기담을상태(Base64ImgArray)
    }



    //console.log("선생님으로전환?:   ", 선생님으로전환)



    let [cookie, setCookie] = useCookies(['tid']);
    let [클래스정보쿠키, set클래스정보쿠키] = useCookies(["classinfo"]);
    const 선생님으로등록완료하기 = () => {

        let data = { "tid": cookie.tid };
        let headers = { "content-tye": "application/json" };


        axios.post(`http://${IP}:4000/teacher/toteacherconfirm`, data, { headers })
            .then((res) => {
                let { updatestatuscode } = res.data;

                if (updatestatuscode == 1) {
                    alert("수업등록과 \n 선생님으로 전환 되셨습니다.\n 메인홈으로 이동합니다.")
                    navi("/openclass");
                }



            })


    }

    let [클래스정보모달, set클래스정보모달] = useState(false)





    var park; 

// console.log("인포:   ",클래스정보쿠키.classinfo)
// console.log("park:  ", park)

let [강제로한번,set강제로한번]=useState(true)
const 클래스정보모달열기 = () => {
    set클래스정보모달(true); 
       
    }
   

  



function 클래스정보입력란마우스오버(){

    let classlocation =document.getElementById("classlocation");
    let park=document.getElementById("park");
    
    let playtime  =document.getElementById("playtime");
    let playinguser  =document.getElementById("playinguser");
    let classintro =document.getElementById("classintro");

    if(클래스정보쿠키.classinfo!=null){
        alert("최근 저장하신 정보를 \n 불러옵니다.");
        classlocation.value = 클래스정보쿠키.classinfo.ClassLocation;
        park.value= 클래스정보쿠키.classinfo.Park;
        playtime.value=클래스정보쿠키.classinfo.PlayTime;
        playinguser.value=클래스정보쿠키.classinfo.Playinguser;
        classintro.value=클래스정보쿠키.classinfo.classintro;
    }

set강제로한번(false)
//console.log(e.target)

//document.getElementById("infomoal").removeEventListener("mouseover",deltarget)

}    
   

   








    const 선생님으로등록전환취소버튼 = () => {
        set선생님으로전환(false)
    }



    let 클래스정보객체 = new Object();

    let ClassLocation;
    const ClasslocationChange = () => {
        ClassLocation = document.getElementById("classlocation").value;
        클래스정보객체.ClassLocation = ClassLocation;
        if ( ClassLocation == "") {
            ;
            클래스정보객체.ClassLocation = null
        }
    }


    let Park;
    const ParkChange = () => {



        Park = document.getElementById("park").value;
        if (Park == "가능" || Park == "불가능") {
            document.getElementById("noalertpark").classList.remove("noactioninfo");
            document.getElementById("yesalertpark").classList.add("yesactioninfo");
            클래스정보객체.Park = Park;
        }
        else {
            document.getElementById("noalertpark").classList.add("noactioninfo");
            document.getElementById("yesalertpark").classList.remove("yesactioninfo");
            클래스정보객체.Park = null;
        }

        if (Park == "") {
            document.getElementById("noalertpark").classList.remove("noactioninfo");
            document.getElementById("yesalertpark").classList.remove("yesactioninfo");
            클래스정보객체.Park = null
        }
    }

    let PlayTime;
    const PlaytimeChange = () => {
        let regex = /^[0-9]{1,4}(분)$/;
        PlayTime = document.getElementById("playtime").value;
        console.log(regex.test(PlayTime))
        if (regex.test(PlayTime)) {
            document.getElementById("noalertplaytime").classList.remove("noactioninfo");
            document.getElementById("yesalertplaytime").classList.add("yesactioninfo");
            클래스정보객체.PlayTime = PlayTime;

        } else {
            document.getElementById("noalertplaytime").classList.add("noactioninfo");
            document.getElementById("yesalertplaytime").classList.remove("yesactioninfo");
            클래스정보객체.PlayTime = null;
        }
        if (PlayTime == "") {
            document.getElementById("noalertplaytime").classList.remove("noactioninfo");
            document.getElementById("yesalertplaytime").classList.remove("yesactioninfo");
            클래스정보객체.PlayTime = null
        }
    }

    let Playinguser;
    const PlayinguserChange = () => {
        let regex = /^(최대)[0-9]{1,4}(명)$/;
        Playinguser = document.getElementById("playinguser").value;
        console.log(regex.test(Playinguser))
        //yesalertplayinguser
        if (regex.test(Playinguser)) {
            document.getElementById("noalertplayinguser").classList.remove("noactioninfo");
            document.getElementById("yesalertplayinguser").classList.add("yesactioninfo");
            클래스정보객체.Playinguser = Playinguser;

        } else {
            document.getElementById("noalertplayinguser").classList.add("noactioninfo");
            document.getElementById("yesalertplayinguser").classList.remove("yesactioninfo");
            클래스정보객체.Playinguser = null;
        }
        if (Playinguser == "") {
            document.getElementById("noalertplayinguser").classList.remove("noactioninfo");
            document.getElementById("yesalertplayinguser").classList.remove("yesactioninfo");
            클래스정보객체.Playinguser = null;
        }

    }
    let ClassIntro
    const ClassintroChange = () => {
        ClassIntro = document.getElementById("classintro").value;
        클래스정보객체.ClassIntro = ClassIntro;
    }

    let [클래스정보스테이트, set클래스정보스테이트] = useState(null);
    const 정보확인 = () => {
       // console.log(클래스정보객체)
        for (let key in 클래스정보객체) {

            if (클래스정보객체[key] == null || 클래스정보객체[key] == undefined) {
                alert("모든 정보를 입력해주세요");
                return;
            }

        }

        if (클래스정보쿠키.classinfo == undefined || 클래스정보쿠키.classinfo == null) {

            set클래스정보쿠키("classinfo", 클래스정보객체);
        }
        set클래스정보쿠키("classinfo", 클래스정보객체);
        set클래스정보모달(false);
        set강제로한번(true);
        //클래스정보객체
       //퍽유
       수업정보상태.classtotalinfo=클래스정보객체;
       let deep={...수업정보상태};
       set수업정보상태(deep);
    }


   // console.log("changeobj: ", JSON.stringify(changeobj))


    return (<>

        <div className="RightAllwrapper">

            <div className="Rightwrapper">

                <div className="pagetitle" id='pagetitle'>
                    {인증된사업자 ?
                        <>
                            <h1>수업 등록하기</h1>
                        </>
                        : <>
                            <h1>등록된 사업자임을인증</h1>
                        </>}

                </div>
                <div className="pagecontent">
                    <div className="pageheader">
                        확인 및 변경
                    </div>
                    <MyInfoWrapper>

                        <div className="authowrapper">
                            <div className="inconarea">
                                <div className="img"></div>
                                <div>선생님으로 전환 및 수업 등록전 사업자 등록번호화 사업장 거래계약서 인증을해주세요</div>
                            </div>
                            <div className="authobtnarea">
                                {authocheck ?
                                    <>
                                        <div className="authobtn" id="authosuccess" >인증성공</div>
                                    </>
                                    :
                                    <>
                                        <div className="authobtn" id="authobtn" onClick={OpenModal}>인증하기</div>
                                    </>}



                            </div>
                        </div>



                        <div className="myinfowrapper" onClick={() => {
                            if (!내정보변경버튼) {
                                alert("설명대로 해주세요..\n 하단의 수업등록하기 버튼을 눌러주세요");
                                return;
                            }

                        }}>
                            <div className="infowrapper">

                                <div className="infoarea">
                                    <div className="infoheader">
                                        <span>등록할클 래스명</span>

                                    </div>
                                    <div className="infocontent">
                                        <div className="read writie">
                                            {인증된사업자 && 내정보변경버튼 ?
                                                <>
                                                    <input className="changeinput" placeholder={`수업이름을 작성해주세요`} id='name' onChange={NameChange}></input>

                                                </>
                                                :
                                                <>


                                                    <input placeholder="개인정보보호를 위해 먼저 인증을해주세요" readOnly></input>

                                                </>}

                                        </div>
                                    </div>
                                </div>

                                <div className="infoarea">
                                    <div className="infoheader">
                                        <span>닉네임</span>
                                    </div>
                                    <div className="infocontent">
                                        <div className="read writie">
                                            {인증된사업자 && 내정보변경버튼 ?
                                                <>
                                                    <input className="changeinput" placeholder={`수업에 활동하실 닉네임을 입력해주세요`} ></input>

                                                </>
                                                :
                                                <>


                                                    <input placeholder="개인정보보호를 위해 먼저 인증을해주세요" readOnly></input>

                                                </>}


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

                                            {인증된사업자 && 내정보변경버튼 ?
                                                <>
                                                    <input className="changeinput" placeholder={`수업의 이용요금을 작성해주세요`} id="tell" onChange={PriceChange}></input>

                                                </>
                                                :
                                                <>


                                                    <input placeholder="개인정보보호를 위해 먼저 인증을해주세요" readOnly></input>

                                                </>}




                                        </div>
                                    </div>
                                </div>

                                <div className="infoarea">
                                    <div className="infoheader">
                                        <span>클래스정보</span>
                                    </div>
                                    <div className="infocontent">
                                        <div className="read writie">

                                            {인증된사업자 && 내정보변경버튼 ?
                                                <>
                                                    <input className="changeinput" placeholder={`클래스정보를 입력해주세요`} id='email' onClick={클래스정보모달열기} onChange={ClassInfoChange}></input>


                                                </>
                                                :
                                                <>


                                                    <input placeholder="개인정보보호를 위해 먼저 인증을해주세요" readOnly></input>

                                                </>}
                                        </div>
                                    </div>
                                </div>
                            </div>


{/* 
                            <div className="infowrapper">

                                <div className="infoarea">
                                    <div className="infoheader" id='dupliccheck'>
                                        {내정보객체 == null ? <><span>사용중인아이디</span></> : <><div id="duplicarea"><span>사용중인아이디</span> <span id="duplicbtn" onClick={IdDuplicCheck}>아이디중복확인</span></div></>}
                                    </div>
                                    <div className="infocontent">
                                        <div className="read writie">
                                            {인증된사업자 && 내정보변경버튼 ?
                                                <>
                                                    <input className="changeinput" placeholder={`새롭게 변경하실 아이디를 입력해주세요`} id="id" onChange={IdChange}></input>

                                                </>
                                                :
                                                <>


                                                    <input placeholder="개인정보보호를 위해 먼저 인증을해주세요" readOnly></input>

                                                </>}
                                        </div>
                                    </div>
                                </div>

                                <div className="infoarea">
                                    <div className="infoheader">
                                        <span>가입일</span>
                                    </div>
                                    <div className="infocontent">
                                        <div className="read writie">
                                            {내정보객체 == null ?
                                                <>
                                                    <input placeholder="개인정보보호를 위해 먼저 인증을해주세요" readOnly></input>
                                                </>
                                                :
                                                <>
                                                    <input placeholder={`가입일 선생님 연락처`}></input>
                                                </>}

                                        </div>
                                    </div>
                                </div>
                            </div> */}



                            <div className="infowrapper ">

                                <div className="infoarea addimgarea">
                                    <div className="infoheader">
                                        <span>등록할 사진</span>
                                    </div>
                                    <div className="addimgcontent" id="addimgcontent">
                                        <div className="read writie">
                                            <div className="filebox">
                                                <input id="addfilename" className="upload-name" value="첨부파일" placeholder="첨부파일"></input>
                                                <label for="file">파일찾기</label>
                                                {/* onChange={AddImg} */}
                                                <input type="file" id="file" className="file1" multiple onChange={(e) =>


                                                    handleImageUpload(e.target.files[0], e)} ></input>
                                            </div>
                                            <div className="filebox">
                                                <input id="addfilename1" className="upload-name" value="첨부파일" placeholder="첨부파일"></input>
                                                <label for="file">파일찾기</label>
                                                {/* onChange={AddImg} */}
                                                <input type="file" id="file" className="file2" multiple onChange={(e) => handleImageUpload(e.target.files[0], e)} ></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {내정보변경버튼?
                             <>
                              <div class="showCreateClass" onClick={ShowClass}><div><span>작성 미리보기</span></div></div>
                             </>
                             :
                             <>
                             </>}
                           
                        </div>
                        <div className="pageheader">

                            {선생님으로전환 ? <>선생님으로전환</> : <> 개인정보 수정 및 비밀번호 변경</>}
                        </div>


                        <ReadAndWriteWRapper>


                            {선생님으로전환 ?
                                <>

                                    <div className="change" id="change">
                                        <div className="changemyinfo ">
                                            <div onClick={선생님으로등록완료하기}><span>선생님으로전환</span></div>
                                        </div>
                                        <div className="changemypassword ">
                                            <div onClick={선생님으로등록전환취소버튼}><span>취소</span></div>
                                        </div>
                                    </div>


                                </>
                                :
                                <>
                                    <div className="cut">
                                    </div>
                                    <div className="change" id="change">
                                        <div className="changemyinfo ">
                                            <div onClick={OpenChangeMyInfoModal}><span>수업정보작성하기</span></div>
                                        </div>
                                        <div className="changemypassword ">
                                            <div onClick={ChangePassWordModal}><span>비밀번호변경</span></div>
                                        </div>
                                    </div>

                                    <div className="changemyinfomodal" id="changemyinfomodal">
                                        <div className="changemyinfo ">
                                            <div onClick={CloseChangeMyInfoModal}><span>취소</span></div>
                                        </div>
                                        <div className="changemypassword ">
                                            <div onClick={수업정보반영}><span>수업정보 반영</span></div>
                                        </div>
                                    </div>
                                </>
                            }

                        </ReadAndWriteWRapper>

                    </MyInfoWrapper>



                </div>
            </div>

        </div>


                          








                          
        {openmodal ?

            <>
                <MessageAuthoarea>
                    <div className="modal" id="modal">
                        <div className="modal_body" id="modal_body">
                            <h2 >사업자등록번호 인증하기</h2>
                            <div className="getauthoarea" id="getauthoarea">


                                {/*  쫌있다 와서 여기서 id 값 과 체인지 클릭 에 비밀번호 확인 컨트롤러 만들어주자. */}
                                <input placeholder="하이픈 상관없이 사업자등록번호를입력해주세요" id="phonNum" onChange={PhoneNumChange}></input>
                                <div className="samemeseeage" id="getauthomeseeage" onClick={GetAuthoMeseeage}><div className="samebtn">인증하기</div></div>

                            </div>


                            <div className="goauthoarea getauthoarea" id="goauthoarea">
                                <span id="timeoutarea"></span>
                            </div>
                            <div className="cancleconfirmarea">
                                <div onClick={() => {
                                    //clearInterval(timeout);
                                    setOpenmodal(false);
                                    // axios.get(`http://${IP}:4000/user/messageauthotimeout`)
                                    // .then((res=>{
                                    //     if(res.data.authostatuscode==-1){
                                    //         alert("취소하셨습니다.")
                                    //     }
                                    // }))
                                }}>취소</div>
                                <div onClick={() => {
                                    //  clearInterval(timeout);
                                    setOpenmodal(false);


                                }}>확인</div>
                            </div>
                        </div>
                    </div>
                </MessageAuthoarea>
            </>


            :
            <>
            </>}

        {changepwdmodal ?

            <>
                <MessageAuthoarea>
                    <div className="modal" id="modal">
                        <div className="modal_body" id="modal_body">
                            <h2 >비밀번호변경</h2>
                            <div className="getauthoareaWrapper">

                                <h2 >사용중인 비밀번호 확인</h2>
                                <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                                    <input placeholder="기존비밀번호를 입력해주세요" id="oldpwd" onChange={PassWordChange} type="password"></input>
                                    <div id="getauthomeseeage" onClick={OldPassWordCheck}>확인</div>

                                </div>
                                <div id="oldpwdyes">사용하시던 비밀번호 확인</div>
                                <div id="oldpwdno">사용하시던 비밀번호 불일치</div>

                            </div>

                            <div className="goauthoarea getauthoareapwd" id="newpwdarea">
                                <h2 >새롭게 사용하실 비밀번호</h2>
                                <input placeholder="새롭게사용하실 비밀번호를입력해주세요" id="newpwd1" onClick={Cleaer} onChange={NewPwd1} type="password"></input>

                                <input placeholder="다시한번 입력해주세요" id="newpwd2" onChange={NewPwd2} type="password"></input>
                                <span id="noequal">비밀번호가 일치하지 않습니다.</span>
                                <span id="equal">비밀번호가 일치</span>
                                <div id="getauthomeseeage" onClick={GoNewPWDChange}>등록변경하기</div>
                            </div>
                            <div onClick={() => {
                                setChangepwdmodal(false);

                            }}>확인</div>
                        </div>
                    </div>
                </MessageAuthoarea>
            </>


            :
            <>
            </>}

        {미리보기 ?
            <>

                <미리보기모달레퍼>

                    <div className="header">
                        <div className="leftheader">
                            <div onClick={() => {
                                set미리보기(false);
                            }}>미리보기 접기</div>
                        </div>
                        <div className="rightheader"></div>
                    </div>
                    <div className="imgmodal">
                        <div className="modaltarget">
                            <ShowCreateClass 수업정보상태={수업정보상태}></ShowCreateClass>


                        </div>


                    </div>


                </미리보기모달레퍼>

            </>

            :
            <>

            </>
        }

        {클래스정보모달 ?
            <>
            {
                

            }
                <MessageAuthoarea id="infomoal" onMouseOver={
                   
                  
                    ()=>{
                       // console.log("강제로한번: ",`${강제로한번}`==true)
                        
                        if(`${강제로한번}`=="true"){
                           
                            클래스정보입력란마우스오버();
                            return;
                        }
                       return;
                    }
                    
                    
                    
                    } >
                    <div className="modal" id="modal" >
                        <div className="modal_body" id="modal_body">
                            <h2 >클래스 기본 정보 기입</h2>
                            <div className="getauthoareaWrapper">

                                <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                                    <span>지역:</span>
                                    <input placeholder="해당 클래스 지역을 행정시 까지만 적어주세요 ex 군포시, 안양시" id="classlocation" onChange={ClasslocationChange} type="text"></input>


                                </div>
                                <div className="getauthoarea getauthoareapwd" id="parkarea">
                                    <span>주차:</span>
                                    <input placeholder="주차가능 여부를 가능,불가능 으로만 적어주세요 ex 가능, 불가능" id="park" onChange={ParkChange}></input>

                                </div>
                                <div className="getauthoareapwd">
                                    <span className="alertinfo" id="noalertpark">가능 또는 불가능  으로만 적어주세요</span>
                                    <span className="alertinfo" id="yesalertpark">옳바르게 작성하셨습니다.</span>

                                </div>
                                <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                                    <span>이용시간:</span>
                                    <input placeholder="이용시간을  xx분 으로 적어주세요 ex 45분" id="playtime" onChange={PlaytimeChange} type="text"></input>

                                </div>
                                <div className="getauthoareapwd">
                                    <span className="alertinfo" id="noalertplaytime">xx분 으로만 작성해주세요 ex :1분, 60분</span>
                                    <span className="alertinfo" id="yesalertplaytime">옳바르게 작성하셨습니다.</span>


                                </div>
                                <div className="getauthoarea getauthoareapwd" id="getauthoarea">
                                    <span>이용인원:</span>
                                    <input placeholder="최대 이용인원수를 최대xx명 으로 적어주세요 ex 최대12명" id="playinguser" onChange={PlayinguserChange} type="text"></input>

                                </div>
                                <div className="getauthoareapwd">
                                    <span className="alertinfo" id="noalertplayinguser">xx분 으로만 작성해주세요 ex :1분, 60분</span>
                                    <span className="alertinfo" id="yesalertplayinguser">옳바르게 작성하셨습니다.</span>

                                </div>

                            </div>

                            <div className="goauthoarea getauthoareapwd" id="newpwdarea">
                                <h2> 클래스 소개 내용을 기입 </h2>
                                <textarea placeholder="새롭게사용하실 비밀번호를입력해주세요" id="classintro" onClick={Cleaer} onChange={ClassintroChange} type="password"></textarea>



                            </div>
                            {/* 쿠키 */}
                            <div onClick={
                                정보확인
                                //     () => {
                                //     console.log(클래스정보객체)
                                //     for(let key in 클래스정보객체){

                                //         if(클래스정보객체[key]==null || 클래스정보객체[key]==undefined){
                                //             alert("모든 정보를 입력해주세요");
                                //             return;
                                //         }

                                //     }
                                //     set클래스정보쿠키(클래스정보객체);


                                //     setChangepwdmodal(false);

                                // }

                            }>확인</div>
                        </div>
                    </div>
                </MessageAuthoarea>
            </>
            :
            <>
            </>
        }
    </>);

}