

import axios from "axios"






export const EclipseJavaSocketServer = () => {



    const 자바웹소켓API호출 = () => {
        var token = "YOUR_ACCESS_TOKEN";
        var header = "Bearer " + "ax123"; // Bearer 다음에 공백 추가
        
           var api_url = 'https://openapi.naver.com/v1/nid/me';
       
           var options = {
               url: api_url,
               headers: {'Authorization': header}
            };
        axios.get("http://localhost:8000/memberInfo?id=won123",options)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (<>

        <h1 onClick={자바웹소켓API호출}>자바웹소켓API호출</h1>
    </>)
}