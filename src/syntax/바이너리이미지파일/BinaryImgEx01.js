import React from "react";
import axios from "axios";
import { useState } from "react";



global.Buffer = global.Buffer || require('buffer').Buffer; 



export const BinaryImgEx01 = () => {

    let IP
    if (window.location.href.indexOf("localhost") == -1) {
        IP = process.env.REACT_APP_SMARTPHONE_IP;
    } else {
        IP = "localhost"
    }




    let [서버에서받은사진, set서버에서받은사진] = useState(null);
    const 이미지요청 = () => {

        axios.get(`http://${IP}:4000/getthefuckimg`).then((res) => {

           
            let reserve_img = res.data    
          

            console.log(reserve_img)


            const buffer = Buffer.from(reserve_img)
            console.log('from() : ', buffer)
            console.log('length : ', buffer.length)
            console.log('toString() : ', buffer.toString())
            
            const array = [Buffer.from('Node.js '), Buffer.from('buffer '), Buffer.from('concat '), Buffer.from('array')]
            const buffer2 = Buffer.concat(array)
            console.log('concat(), toString() : ', buffer2.toString())
            
            const buffer3 = Buffer.alloc(5)
            console.log('length : ', buffer3.length)          
             set서버에서받은사진(buffer.toString())
        })
            .catch((err) => {
                console.log(err)
            })
    }




console.log("서버에서받은사진,  ",서버에서받은사진
)

    return (<>
        <h1 onClick={이미지요청}>이미지요청 클릭</h1>
       {서버에서받은사진 == null? 
       <>
       
       </>
        :
    <>
     <img src={서버에서받은사진}></img>
    
    </>
    }

    </>)

}