
import axios from "axios";
import { useEffect } from "react";

import { apiClient } from "../악시오스인스턴스인터셉터/apiClient";




export const JavaSocketEx01 = () => {




//간접적으로 하면 가능한듯 하다.  익스프레스서버 자체는 웹브라우져가 아니라 헤더 자체를 조작해서 보내는거니
    const ClickAixos = () => {


        let headers={
            'Content-Type': 'application/json',
           "Authorization": "Bearer ax123"
        }
        axios.get('http://localhost:4000/what',{headers}
        )
        .then((res) => {
          console.log(res);
        });

       
    }


    

    
    const ClickAixos2 = () => {


      const data = { 'bar': 123 }; 

        let  headers= {         
           "content-length":40,
         "content-type":"application/x-www-form-urlencoded",       
        "Cookie" : {"access_token":"fuck_you"}
      }
    
    
       
        axios.post('http://localhost:8000/test', data,{headers}
        
        
        )
        .then((res) => {
          console.log(res);
        });
    
    

       
    }

    const ClickAixos3 = () => {

        axios.get('http://localhost:4000/jsontest',
        
        )
        .then((res) => {
          console.log(res);
        });
    
    

       
    }




    return (<>
        <h1>익스 프레스를 거쳐 자바 HTTP 서버와 통신하기</h1>
        <button onClick={ClickAixos}>외부 API호출</button>
        <br></br>
        <br></br>
        <br></br>

        <h1>다이렉트로 </h1>
        <button onClick={ClickAixos2}>자바 소켓 post 요청 클릭!</button>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h1>다이렉트로 </h1>
        <button onClick={ClickAixos3}>JSON주는  사이트 응답해더 확인용 header</button>

    </>);




}