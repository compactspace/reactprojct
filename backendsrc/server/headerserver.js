const express = require('express');

const fs = require('fs');

const redis = require('redis');




const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require('body-parser');
const cors = require("cors");
const axios = require('axios');

const userrouter = require('../reactroutes/userroutes');
const teacherrouter = require('../routes/TeacherRouter')


const noneuserrouter = require('../reactroutes/noneuserrouter');
const ReactNoneUserRouter = require('../routes/ReactNoneUserRouter');
const excuteWebsocket = require('../websocketUtil/websocketutil');

const cookieParser = require('cookie-parser')
const cookieUtile = require('../cookieUtile/cookieUtile')
const jwtUtile = require('../reactUtile/jwtutile').verify
const mairiasession = require('../model/maria/mariasession')
// const mairiasession = require('../model/maria/mariasession')
const marialpool = require('../model/maria/mariadbpool');
const jwt = require('jsonwebtoken');
const websocketopen = require('../websocketUtil/websocketutil')
const MemoryStore = require("../model/maria/mariasession");
const { encode } = require('punycode');


require("dotenv").config();
let secret = process.env.secret;
// console.log(secret)
const app = express();
// app.set("port", 4000); // 포트 설정
// app.set("host","192.168.0.52"); // 아이피 설정
const server = require('http').createServer(app);



const client = redis.createClient({ port: 6379, password: "1111" });




//상품은 이런 hset 의 형식으로 저장한다.

// proCode 0 1 2 3 4
// proName 
// proPrice 

//레디스에서 치면 ㅈㄴ 귀찮으니 여기서 잡고 간다.

let product = {

    pro0: {
        "proCode": 0,
        "proName": "고급잔",
        "proPrice": 3000,
        "proQuantity": 10
    }
    ,
    pro1: {
        "proCode": 1,
        "proName": "키링세트",
        "proPrice": 3000,
        "proQuantity": 10
    }

    ,
    pro2: {
        "proCode": 2,
        "proName": "수제연필키트",
        "proPrice": 3000,
        "proQuantity": 10
    }
    ,
    pro3: {
        "proCode": 3,
        "proName": "수제핸드메이드잔",
        "proPrice": 3000,
        "proQuantity": 10
    }


}

//귀찮으니 여기서 redis에 한번 저장 하고
const redisconnect = async (req, res, next) => {
    const check = await client.connect();
    next();
}


//주의: 
app.use(mairiasession.mariasession)

//주의: mairiasession.mariasession 의 설정으로도 req 객체에 cookie 객체가 추가 되지만
// 아래 미들웨어 를 또 추가하면 cookies 객체가 별도로 추가된다.
app.use(cookieParser());





app.use(bodyParser.json({ limit: '50mb' })) // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })) // for parsing application/x-www-form-urlencoded



// 또이놈은 리엑트의 포트 3000 을 허용해주겠다는거임 에휴 씨발
//https://velog.io/@diorjj/React-CORS-%EC%97%90%EB%9F%AC-%ED%95%B4%EA%B2%B0%ED%95%98%EA%B8%B0
//위 사이트가 그나마 cors 오리진 해결책준다...
// app.use(cors({ origin: ['http://localhost:4000/testlogin','https://calm-shortbread-d2aa50.netlify.app','http://calm-shortbread-d2aa50.netlify.app'], credentials: true }));
app.use(cors({ origin: [`http://${process.env.REACT_APP_SMARTPHONE_IP}:3000`, `http://172.30.1.90:3000`, 'http://calm-shortbread-d2aa50.netlify.app', 'https://calm-shortbread-d2aa50.netlify.app/testlogin2', 'http://localhost:3000'], methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));


app.use('/naver', userrouter)

app.use("/headertest",(req,res)=>{

    console.log(req)

    
})

























//레디스 계속 데이터 집어넣기 귀찮으니 서버 초기화시 여기서 집어 넣는다.
app.listen(4000, async (req, res) => {
    console.log(`그냥 http서버 시작`)
  
   
})












