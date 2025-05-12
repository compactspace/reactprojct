// import { useCookies } from 'react-cookie';

// import { useEffect, useState } from 'react';

// import axios from 'axios';

//  async function ExistCookie (){  

   
//     const [cookies, setCookie] = useCookies(['userid']); // 쿠키 훅 주의:
//     const IP=process.env.REACT_APP_SMARTPHONE_IP;
//     let [userid,setUserId]=useState(null);
  

//     let 쿠키있음;
//      await axios.get(`http://${IP}:4000/hascookie`)
//         .then((res) => {
  
//             if(res.data.cookiestatuscode==-1){
//                 쿠키있음=false;
//                 return 쿠키있음;
//             }
            
//             쿠키있음=true;
//             return 쿠키있음;
            
//         })
//         .catch((err) => {
  
//         })
    
   
  
//     return x;
// }

// export default ExistCookie;