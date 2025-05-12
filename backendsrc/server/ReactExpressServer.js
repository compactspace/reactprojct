const express = require('express');

const fs = require('fs');

const redis = require('redis');


const http = require('http');

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
const server = http.createServer(app);



const client = redis.createClient({ port: 6379, password: "1111" });

const redisconnect = async (req, res, next) => {
    const check = await client.connect();
    next();
}


app.use(mairiasession.mariasession)


app.use(cookieParser());


app.use(bodyParser.json({ limit: '50mb' })) 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })) 


// app.use(cors({ origin: ['http://localhost:4000/testlogin','https://calm-shortbread-d2aa50.netlify.app','http://calm-shortbread-d2aa50.netlify.app'], credentials: true }));
app.use(cors({ origin: [`http://${process.env.REACT_APP_SMARTPHONE_IP}:3000`, `http://172.30.1.90:3000`,`http://localhost:8000`, 'http://calm-shortbread-d2aa50.netlify.app', 'https://calm-shortbread-d2aa50.netlify.app/testlogin2', 'http://localhost:3000'], methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));



app.use('/naver', userrouter)



//무적권! use -> 라우터 ->컨트롤러 -> 서비스 순으로 으로 처리하고
// 리턴은 되돌아와서 컨트롤러 또는  라우터에서 응답객체로 응답
app.use('/noneuser', ReactNoneUserRouter);


//토큰 유효기간 처리등 미들웨어는 잠시 주석처리
// app.use('/user', jwtUtile, userrouter)
//유저라우터
app.use('/user', userrouter)


//선생로그인
app.use('/teacher', teacherrouter)

app.use('/insertclassinfo', async (req, res) => {



   

    let { onedayclass_name,
        onedayclass_price,

        onedayclass_info,

        classtotalinfo,


        reserve_img

    } = req.body


    //console.log("onedayclass_name,onedayclass_price",onedayclass_name,onedayclass_price)


    let { ClassLocation, Park, PlayTime, Playinguser, ClassIntro } = classtotalinfo

    //console.log("Park,PlayTime,Playinguser, ClassIntro",Park,PlayTime,Playinguser, ClassIntro)

    //console.log(reserve_img)






    let con;
    let sql = 'insert into onedayclass (onedayclass_name, onedayclass_price , ClassLocation , Park,PlayTime, Playinguser, ClassIntro, reserve_img) values (?,?,?,?,?,?,?,?)';

    let 클래스번호sql = "select * from onedayclass where onedayclass_name=? ";

    let 이미지테이블반복문 = "insert into onedayclassimg  (reserve_img,onedayclass_num) values (?,?)"
    let executequery;
    let 대표이미지 = reserve_img[0];
    let 클래스번호

    // console.log(대표이미지)



    let 리액트로주는JSON = new Object();
    try {
        con = await marialpool.pool2.getConnection();
        executequery = await con.query(sql, [onedayclass_name, onedayclass_price, ClassLocation, Park, PlayTime, Playinguser, ClassIntro, 대표이미지]);

        executequery = await con.query(클래스번호sql, [onedayclass_name]);
        클래스번호 = executequery[0][0].onedayclass_num;

        console.log("받은 원데이클래스번호:  ", 클래스번호)
        for (let i = 0; i < reserve_img.length; i++) {

            executequery = await con.query(이미지테이블반복문, [reserve_img[i], 클래스번호]);


        }


        req.session.onedayclass_num = 클래스번호;
        req.session.save(() => {


        })


    } catch (err) {
        console.log(err)
        리액트로주는JSON.updatestatuscode = -1;

    } finally {
        con.release();
        리액트로주는JSON.updatestatuscode = 1
        res.json(리액트로주는JSON);
    }

})


app.use("/getthefuckimg", async (req, res) => {


    let con;
    let sql = 'select * from  imgs ';
    let executequery;
    let reserve_img;
    let readFile;
    let encode;
    try {
        con = await marialpool.pool2.getConnection();
        executequery = await con.query(sql)
        reserve_img = await executequery[0][0].reserve_img;

        console.log(reserve_img)

    } catch (err) {
        console.log(err)

    } finally {
        con.release();

        res.json(reserve_img);
    }
})


app.get('/redisSalePro', redisconnect,
    async (req, res) => {

        let 객체배열 = new Array();
        for (let i = 0; i < 4; i++) {
            obj = await client.hGetAll(`pro${i}`);
            객체배열.push(obj);

        };

        await client.disconnect();
        console.log(JSON.stringify(객체배열))
        res.json(JSON.stringify(객체배열))
    }


)

app.get('/redisSalegetProinfo', redisconnect,
    async (req, res) => {

        let { proCode } = req.query;
        console.log("proCode:  ", proCode)


        let 상품정보 = await client.hGetAll(`pro${proCode}`)

        await client.disconnect();
        console.log(JSON.stringify(상품정보))
        res.json(JSON.stringify(상품정보))
    }


)


app.post('/redisSaleAddCartProinfo', redisconnect,
    async (req, res) => {

        let { userid, redisproductcode } = req.body;
        console.log("userid:  ", userid, " redisproductcode:  ", redisproductcode);
        //상품 자체에 락을건다.
        await client.watch(`pro${redisproductcode}`);

        let 레디스수량 = await client.hGet(`pro${redisproductcode}`, "proQuantity");

        //console.log("레디스수량:  ", 레디스수량)
        let obj = new Object();

        if (레디스수량 == 0) {
            obj.redisStatusCode = 0
            res.json(obj)
            return;
        }

        let 새로담는유저인지확인 = await client.hGet(`${userid}`, `pro${redisproductcode}`);

        //console.log("새로담는유저인지확인:  ", 새로담는유저인지확인);

        if (새로담는유저인지확인 == null) {

            //상품에만 트랜잭션 작업단위를 둔다.
            await client.multi().hIncrBy(`pro${redisproductcode}`, "proQuantity", -1).exec();

            await client.hSet(`${userid}`, `pro${redisproductcode}`,"담음");
            let 상품정보= await client.hGetAll(`pro${redisproductcode}`);

            상품정보= JSON.stringify(상품정보);

            console.log("상품정보:  ",상품정보)
            obj.redisStatusCode = 1
            obj.proinfo = 상품정보;
        } else {
            obj.redisStatusCode = -1
        }



        await client.disconnect();
        res.json(obj);

        // let {proCode}=req.query;
        // console.log("proCode:  ",proCode)



        // await client.disconnect();
        // console.log(JSON.stringify(상품정보))
        // res.json(JSON.stringify(상품정보))
    }


)

// app.get("/testredis", redisconnect, async (req, res) => {
//     await client.hSet(`younggoo1000`, `pro0`,0);
//     await client.hSet(`younggoo1000`, `pro1`,1);
//     await client.hSet(`younggoo1000`, `pro2`,2);

//     //
//     let 새로담는유저인지확인 = await client.hGetAll(`younggoo1000`);
    





    // let 상품정보배열객체= new Array();
    // if(새로담는유저인지확인!=null){
    //     for(let Feild in 새로담는유저인지확인){

    //         console.log("Feild:  ",Feild, " value :",새로담는유저인지확인[Feild][0] )
          
    //       상품정보배열객체.push(JSON.parse(JSON.stringify(await client.hGetAll(Feild))));
       
    //     }


    // }

//     console.log(상품정보배열객체)


//     await client.disconnect();

// })



//쿠키가 필요한 유저
// app.use('/cookieuser',userrouter)


app.use('/hascookie', cookieUtile.Existcookie);





// 공공데이터 서비스 조회 장애라 공지가 떠 주석처리
// app.use('/authoCorporationread', (req, res) => {

//     let { 사업자등록번호 } = req.body;

//     let 공공데이터서비스키 = "GhRJv8ycxRRBetiPJrJJn0wvxKyRWvfo%2B2%2FLp7Ei65PuIROQI7IcZ48p%2F71i%2FpNLUzaRgv9nVNsqXRNNIW4I6w%3D%3D";

//     let data = {
//         "b_no": [`${사업자등록번호}`] // 사업자번호 "xxxxxxx" 로 조회 시,
//     };
//     let headers = { "content-type": "application/json" }
//     let url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=GhRJv8ycxRRBetiPJrJJn0wvxKyRWvfo%2B2%2FLp7Ei65PuIROQI7IcZ48p%2F71i%2FpNLUzaRgv9nVNsqXRNNIW4I6w%3D%3D`
//     axios.post(url, data, { headers })
//         .then(
//             (res) => { console.log(res.data) }
//         )
//         .catch((err) => {
//             console.log(err)
//         })
// })



//토큰 발급 테스트
//주의: 포트원은 fetch 를 써서 난 악시오스를 쓸거라 살짝 세팅하는게 다루다.
//또한; 발급 받은 접근 토큰은 리엑트서버의 웹브라우저 로컬스토리지에 저장 시킨다.
app.use('/getToken', (req, res) => {

    axios.post("https://api.iamport.kr/users/getToken",
        {
            imp_key: `${process.env.REST_API_access_token}`, // REST API 키
            imp_secret: `${process.env.REST_API_Secret}`, // REST API Secret            
        }

        , {
            headers: { "Content-Type": "application/json" },
        }


    ).then((res) => {
        //status haeders 등 나온다.

        //  console.log(res);
        // for(x in res){
        //     console.log(x);
        // }       
        // console.log(res.status)
        // console.log(res. statusText)


        if (res.status == 200 && res.statusText == 'OK') {
            console.log(res.data.response.access_token);

            let AccessToken = res.data.response.access_token;


        } else if (res.status == 401 && res.statusText == 'Unauthorized') {


        }



    })

})















app.use('/authuser', (req, res) => {
   
    let token = req.headers.token;    
    console.log(token)
    //로그인 없은 놈이나 쿠키 지운 놈들은 널이니 널포인트 익셉션 때문에 if문 만듬
    if (token == null) {

    } else {
        let newaccessToken;
        const expires = jwt.verify(token, secret, (result) => {
            // console.log(result)
            // console.log(`유효기간 만료토큰 ${token}`)
            // console.log(err);

            // console.log(`재발급 토큰 ${newaccessToken}`)
            return result;
        })
        console.log(expires);
        if (expires != null) {
            console.log("만료기간이 지난경우")
            //재발급이 자꾸 기존꺼에서 쌓임으로 초기화해준다.
            token = "newtoken";
            newaccessToken = jwt.sign({ token: token }, secret, { expiresIn: "10m" });
            console.log(`재발급 토큰 ${newaccessToken}`)
            return res.send({ newaccessToken })
        } else {

         
            return res.send({ newaccessToken: token })
        }



    }

})






//리액트 JWTex02 파일과 연동되는 문법용임
//그냥 토큰 값 그리고 필요한 유저의 아디디를 따로 저장 해서 보내는거임 그이상 그이하도 아님
app.use('/jwt', (req, res) => {
    console.log("jtw 매핑 확인");
    let { data1 } = req.query;

    const accessToken = jwt.sign({ what: data1 }, secret, { expiresIn: '100s' });
    const userId = jwt.sign({ what: data1 }, secret, { expiresIn: '100s' });
    console.log(accessToken);
    res.json({ accessToken, userId });
})





//상품은 이런 hset 의 형식으로 저장한다.

// proCode 0 1 2 3 4
// proName 
// proPrice 



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


//레디스 계속 데이터 집어넣기 귀찮으니 서버 초기화시 여기서 집어 넣는다.
app.listen(4000, async (req, res) => {
    console.log(`그냥 http서버 시작`)
    console.log(`호스트 ${process.env.HOST}`)
    await client.connect();
    let i = 0;
    for (let key in product) {
        // console.log(product[key])
        // console.log(`pro${i}`)

        await client.hSet(`pro${i}`, product[key]);
        i++;
    }

    i = 0;
    await client.disconnect();
})


//websoket 서버 = 서버가 능동적으로 요청이 없어도 클라이언트에게 응답을 할 수 있는 서버
websocketopen.websocketopen();









