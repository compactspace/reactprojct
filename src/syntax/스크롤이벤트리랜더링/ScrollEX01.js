

import { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import { useRef } from "react";





const AllWrapper = styled.div`


& #box1{
    background-color:whitesmoke;
    width: 100%;
    height: 900px;
    margin-bottom: 100px;
}

& #box2{
    background-color: aliceblue;
    width: 100%;
    height: 900px;
    margin-bottom: 100px;
}

.actionadd{
    display: block;
    position: fixed;
    bottom: 0px;
}

.actionadd2{
   display: none;
}


`


export const ScrollEX01 = () => {

    let [isbottom, setIsbottom] = useState(["false"]);
    let [isbottom2, setIsbottom2] = useState("false");

    const messages = useRef();



    //시간차 때문에 버그가 있는거 같은데
    // if(isbottom=="true"){
    //     alert("순서가 이상한데?")
    // }



    var x;

    //범인을 찾음.. 아마 내 생각인데??
    //이벤트가 계속 생기고, 스테이트가 계속 생기는듯하다. 주석해제하고 확인해보자.
    // window.addEventListener('scroll', () => {

    //     let scrollLocation = document.documentElement.scrollTop; // 현재 스크롤바 위치
    //     let windowHeight = window.innerHeight; // 스크린 창
    //     let fullHeight = document.body.scrollHeight; //  margin 값은 포함 x 


        
    //     console.log("isbottom:  ",isbottom)
    //     if (scrollLocation >= 1000 && scrollLocation <= 1100) {
    //         x = "초기화"
    //         let deep = [...isbottom];
    //         deep[0] = "true";
    //         setIsbottom(deep);
    //         return;
    //     }
    //     else {
    //         x = "초기화"
    //         let deep = [...isbottom];
    //         deep[0] = "false";
    //         setIsbottom(deep);
    //     }

    // });






    useEffect(() => {
        console.log("유즈이펙트후: " + isbottom)

        if (isbottom == "true") {
            setStyle("true");
        }
        if (isbottom == "false") {
            setStyle("false");
        }

    }, [isbottom])

    let [style, setStyle] = useState(null);
    useEffect(() => {
        console.log("style 유즈이펙트후: " + style)

        if (style == "true") {
          
            let btn = document.getElementById("btn");

            btn.classList.remove("actionadd")
            btn.classList.add("actionadd2")
        }
        else{

            let btn = document.getElementById("btn");

            btn.classList.add("actionadd");
            btn.classList.remove("actionadd2")

            
        }


    }, [style])




    // if(document.getElementById("btn")!=undefined || null){
    //     document.getElementById("btn").addEventListener("click",()=>{

    //         messages.current?.scrollIntoView({ behavior: 'smooth' });
    //     })
    // }






    console.log("리랜더링확인 x    isbottom ", x, isbottom)





    return (
        <>
            <AllWrapper >
                <div id="box1" onClick={() => {
                    messages.current?.scrollIntoView({ behavior: 'smooth' });
                }}></div>

                <div id="box2" ref={messages}></div>


            <button id="btn">버튼</button>
            </AllWrapper>
        </>);
}