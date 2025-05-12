const express = require("express");
const router = express.Router();
const usercontrller = require("../reactcontroller/usercontroller");
const jwt = require("jsonwebtoken");
const requestIp = require("request-ip");
const redis = require("redis");
const coolsms = require("coolsms-node-sdk").default;
const messageService = new coolsms(
  "NCSY4BTX5OIPQLWB",
  "MUKUA17KEOWARC69L8WJRTJ5VY3RWWKA"
);

const client = redis.createClient({ port: 6379, password: "1111" });
//귀찮으니 여기서 redis에 한번 저장 하고
const redisconnect = async (req, res, next) => {
  const check = await client.connect();
  next();
};

require("dotenv").config();

let secret = process.env.secret;
// console.log(secret)
router.get("/", async (req, res) => {
  // console.log("라우터 매핑 성공")
  //const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=STATE_STRING&redirect_uri=http://localhost:4000/naver`;
  let accesscode = req.query.code;

  let obj = await usercontrller.NaverLogin(accesscode, req, res);

  let { code } = req.query;
  let { userId } = obj;
  let userid = userId;
  console.log("네이버가 고유하게 주는 아이디 ", userId);

  const accessToken = jwt.sign({ token: code }, secret, { expiresIn: "100m" });
  //  console.log("accessToken값은");
  //  console.log(accessToken);

  let ReqIP = requestIp.getClientIp(req);

  req.session.userid = userId;
  req.session.sessionID = req.sessionID;
  req.session.requestIp = ReqIP;
  await req.session.save((err) => {});

  res.send({ accessToken, userId, userid });
});

router.post("/login", async (req, res) => {
  await usercontrller.login(req, res);
});

router.get("/logout", async (req, res) => {
  await usercontrller.logout(req, res);
});

router.post("/messageautho", async (req, res) => {
  let today = new Date();
  let 요청자가받을번호 = req.body.phonNum;

  console.log("요청자가받을번호:  " + 요청자가받을번호);

  let authonumber = (Math.floor(Math.random() * 9999) + 10000).toString();

  messageService
    .sendOne({
      to: 요청자가받을번호,
      from: "01093130686",
      text: authonumber,
      subject: "인증번호보내드립니다.", // LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
    })
    .then((res) => console.log(res));

  let seconds = today.getSeconds(); // 초

  req.session.authonumber = authonumber;
  // console.log(req.session)

  console.log("--파괴전--");
  console.log(req.session);
  console.log("--파괴전--");

  res.send(authonumber);
});

router.get("/messageauthotimeout", async (req, res) => {
  req.session.authonumber = "";

  res.send({ authostatuscode: -1 });
});

router.post("/authocheck", async (req, res) => {
  let { authonumber } = req.body;

  let 서버에서발급했던인증번호 = req.session.authonumber;

  let 리액트로주는JSON = new Object();

  // console.log("authonumber:  ",authonumber)

  // console.log("서버에서발급했던인증번호r:  ",서버에서발급했던인증번호)

  if (서버에서발급했던인증번호 == authonumber) {
    리액트로주는JSON.authostatuscode = 1;
    req.session.destroy(() => {
      res.json(리액트로주는JSON);
      return;
    });
  } else {
    리액트로주는JSON.authostatuscode = -1;
    res.json(리액트로주는JSON);
    return;
  }
});

router.post("/myinfoauthocheck", async (req, res) => {
  let { authonumber } = req.body;

  let 서버에서발급했던인증번호 = req.session.authonumber;

  let { timeout } = req.body;

  console.log(
    "사용자의 초, 발급시 서버에 저장했던 초",
    timeout,
    req.session.timeout
  );

  let 리액트로주는JSON = new Object();

  if (서버에서발급했던인증번호 == authonumber) {
    리액트로주는JSON.authostatuscode = 1;
    req.session.myinfoauthocheck = "check";
    res.json(리액트로주는JSON);
  } else {
    리액트로주는JSON.authostatuscode = -1;
    res.json(리액트로주는JSON);
    return;
  }
});

router.post("/showmyinfo", async (req, res) => {
  let 리액트로줄유저정보객체;
  리액트로줄유저정보객체 = await usercontrller.showmyinfo(req, res);
  res.json(리액트로줄유저정보객체);
});

router.post("/changemyinfo", async (req, res) => {
  await usercontrller.changemyinfo(req, res);
});

router.post("/oldpwdcheck", async (req, res) => {
  await usercontrller.oldpwdcheck(req, res);
});

router.post("/changenewpwd", async (req, res) => {
  await usercontrller.changenewpwd(req, res);
});

router.post("/duplicid", async (req, res) => {
  await usercontrller.duplicid(req, res);
});

router.post("/memberjoin", async (req, res) => {
  await usercontrller.memberjoin(req, res);
});

router.post("/rest", async (req, res) => {
  //console.log(`라우터 매핑확인 클래스아이디 ${req.query.openclass_id} 이고, 각요일 선택값 ${req.query.eacopenday}`)

  let result = await usercontrller.rest(req, res);

  // console.log(result);
  return res.send(result);
});

router.get("/reserve", async (req, res) => {
  let result = await usercontrller.Reserve(req, res);
  // express deprecated res.send(status): Use res.sendStatus(status) instead
  // res.send 는 객체급만 가능한데 일반 숫자 자료형이 들어가면 위와 같은 오류가 떠서 수정 {result}로 수정해준것임
  res.send(result);
});

router.get("/openclassinfo", async (req, res) => {
  console.log("/openclassinfo 라우터 매핑 확인");
  let resultobj = await usercontrller.openclassinfo(req, res);
});

router.post("/getBannerTypeList", async (req, res) => {
  let resultobj = await usercontrller.getBannerTypeList(req, res);

  res.json(resultobj);
});

router.post("/getBannerTypeProductList", async (req, res) => {
  let resultobj = await usercontrller.getBannerTypeProductList(req, res);
  res.json(resultobj);
});

router.post("/getSelectOneBannerTypeProduct", async (req, res) => {
  let resultobj = await usercontrller.getSelectOneBannerTypeProduct(req, res);
  res.json(resultobj);
});

router.post("/firstAddCart", async (req, res) => {
  let resultobj = await usercontrller.insertFirstAddCart(req, res);
  res.json(resultobj);
});

router.post("/insertPaymnetInfo", async (req, res) => {
  let resultobj = await usercontrller.insertPaymnetInfo(req, res);
  res.json(resultobj);
});

router.post("/redisproductpayment", async (req, res) => {
  await usercontrller.redisproductpayment(req, res);
});

router.post("/showcartlist", redisconnect, async (req, res) => {
  let { userid } = req.body;

  let 장바구니리스트 = await client.hGetAll(`${userid}`);

  console.log("장바구니리스트::     ", 장바구니리스트 == null);

  let obj = new Object();
  if (장바구니리스트 == null || 장바구니리스트 == undefined) {
    //장바구니가 비어 있어요
    obj.cartStatusCode = -1;
    res.json(obj);
    return;
  }

  let 상품정보배열객체 = new Array();

  for (let Feild in 장바구니리스트) {
    //console.log("Feild:  ",Feild, " value :",새로담는유저인지확인[Feild] )

    상품정보배열객체.push(
      JSON.parse(JSON.stringify(await client.hGetAll(Feild)))
    );
  }

  await client.disconnect();

  obj.cartStatusCode = 1;
  obj.proList = 상품정보배열객체;
  console.log(상품정보배열객체);

  res.json(obj);
});

router.post("/delpro", redisconnect, async (req, res) => {
  let { userid, proCode } = req.body;

  console.log("userid:  ", userid, " proCode:  ", proCode);

  let obj = new Object();
  try {
    await client.hDel(`${userid}`, `pro${proCode}`);

    await client.hIncrBy(`pro${proCode}`, "proQuantity", 1);

    obj.delStatusCode = 1;
  } catch (err) {
    obj.delStatusCode = -1;
  } finally {
    await client.disconnect();
    res.json(obj);
  }
});

//다른 메서드 만드는 중으로 주석처리
// router.get("/reservedmodal", async(req,res)=>{
//   let resultobj=await usercontrller.reservedmodal(req,res);
//   //
//   console.log(resultobj)
//   delete resultobj.reserved_num;
//   console.log(resultobj)
//   return res.send(resultobj);
// })

router.post("/reivew", async (req, res) => {
  await usercontrller.review(req, res);
});

//바로위 reivew 에서 처리하고 다래 next/backreivew 는 싹다 지워 버리자.

router.get("/nextreivew", async (req, res) => {
  await usercontrller.nextreview(req, res);
});

router.get("/backreivew", async (req, res) => {
  await usercontrller.backreivew(req, res);
});

router.post("/payment", async (req, res) => {
  await usercontrller.payment(req, res);
});

router.post("/testpayment", async (req, res) => {
  await usercontrller.testpayment(req, res);
});

router.post("/paycancle", async (req, res) => {
  await usercontrller.paycancle(req, res);
});

router.post("/mypage", async (req, res) => {
  await usercontrller.mypage(req, res);
});

router.get("/myCartList", async (req, res) => {
  await usercontrller.myCartList(req, res);
});

router.post("/eachCartDelete", async (req, res) => {
  await usercontrller.eachCartDelete(req, res);
});
router.post("/allCartDelete", async (req, res) => {
  await usercontrller.allCartDelete(req, res);
});

router.post("/myreceipt", async (req, res) => {
  await usercontrller.myreceipt(req, res);
});

router.post("/reservemypage", async (req, res) => {
  await usercontrller.reserveMypage(req, res);
});

// 리뷰를 작성하기전 실제 결제를 하였는가 판단하는 컨트롤러
router.post("/checkreceipt", async (req, res) => {
  await usercontrller.checkreceipt(req, res);
});

//리뷰를 작성하는 컨트롤러
router.post("/writingreview", async (req, res) => {
  await usercontrller.writingreview(req, res);
});

module.exports = router;

// router.get("/", async (req, res) => {
//     console.log("라우터 매핑 성공")
//     //const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=STATE_STRING&redirect_uri=http://localhost:4000/naver`;
//     let accesscode = req.query.code;
//     console.log(accesscode)
//     console.log(req.query)
//     let { code } = req.query;
//     let { state } = req.query;
//     let { error } = req.query;
//     //console.log(`${code}  ${state}  에러는 ${error} `);
//     //즉 로그인 실패
//     if (error != null || error != undefined) {

//     }
//     else {
//     console.log("엘스문속의 컨트롤러 네이버로그인 메서드 호출")
//         usercontrller.NaverLogin(req,res);

//     }
// });

// module.exports = router
