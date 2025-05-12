import { useCookies } from "react-cookie";



export const CookieEx01 =()=>{

    let [c1, setc1]=useCookies(["info1"])
    let [c2, setc2]=useCookies(["info2"])



    const 쿠키1목록확인 =()=>{

     
        console.log(c1.info1.k1);

    }



    return (<>
        <h1
        onClick={()=>{
            let obj=new Object();
            obj.k1="v1"
            obj.k2="v2"
            setc1("info1",obj)
        }}
        
        >쿠키1 클릭</h1>
        <br></br>
        <h1
          onClick={()=>{
            setc2("info2","정보2")
        }}
        
        
        >쿠키2 클릭</h1>

        {c1.info1 ==null?<><span>c1 널</span></> : <span>c1 널아님</span>}
        {c2.info2 ==null?<><span>c2 널</span></> : <span>c2 널아님</span>}


        <br></br>
        <h1 onClick={쿠키1목록확인}>쿠키1 목록확인</h1>
    </>)
}