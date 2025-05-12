const axios = require("axios");
const userservice = require("../reactservice/userservice");
const importUtile = require("../reactUtile/importutile");
const ExpresSsession = require("express-session");
const requestIp = require("request-ip");
const fs = require('fs'); // 꼭 선언했지?


module.exports.NaverLogin = async (accesscode, req, res) => {
  //      console.log("컨트롤러 매핑 성공~")
  // console.log(`접근 코드 값은 ${accesscode}`)
  let check;
  let userId;
  await axios
    .get(
      `
    https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=oIB_pADeJKcErdJaXoqA&client_secret=xhm_mwBHDx&code=${accesscode}&state=STATE_STRING 
    `
    )
    .then(async (result) => {
      // console.log("네이버 님들아..좀 키명이라도 알려줘라 따 찍어봐야알겠따.. 응답값은 JSON이자 키명은 data이다.")
      // console.log(result.data)
      let { access_token } = result.data;

      if (access_token != null) {
        // console.log("접근토큰 받았음")
        // console.log(`access_token 의 값은? ${access_token}  입니다.`);

        //네이버에 있는 회원의 정보를 주는 네이버 api 주소
        await axios
          .get("https://openapi.naver.com/v1/nid/me", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(async (result) => {
            // console.log("회원정보조회값")
            // console.log(result)
            // console.log(result.data.response)

            //네이버 가 주는 고유 식별 아이디로, 이걸로 db를 재설계 하라는 추천을하니 이걸로 만들자.
            userId = result.data.response.id;
            //  console.log("네이버가 주는 고유 식별 id: "+userId);
            check = await userservice.NaverLoingService(req, res, result);
            // console.log("컨트롤러의 리턴값")
            // console.log(check)
          });
      }
    })
    .catch(() => {
      console.log("뭔가 에러");
    });
  return { check: check, userId: userId };
};

module.exports.login = async (req, res) => {
  let 응답받은제이슨 = await userservice.loginService(req, res);

  let 리액트로주는응답제이슨 = new Object();
  if (응답받은제이슨.statuscode == -1) {
    리액트로주는응답제이슨.statuscode = -1;

    res.json(리액트로주는응답제이슨);
    return;
  }
  if (응답받은제이슨.statuscode == 0) {
    리액트로주는응답제이슨.statuscode = 0;

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const logMessage = `[${new Date().toISOString()}] Failed login from ${ip}\n`;
    try {
      const logPath = 'C:/serverfiles/logs/auth.log';  // 윈도우 경로 확인 후 
      fs.appendFileSync(
        logPath,
        "FuckYouFuckYouFuckYouFuckYouFuckYouFuckYouFuckYouFuckYouFuckYou" + logMessage
      );
      console.log("로그 기록 성공!!");
      return res.status(401).json({ statuscode: -1 });
    } catch (err) {
      console.error("로그 기록 실패!! 에러 내용:", err.message);
      return res.status(500).json({ statuscode: -2 });
    }






    res.json(리액트로주는응답제이슨);
    return;
  } else {
    console.log(`컨트롤로에서 받음 : ${응답받은제이슨.role}  `);

    let ReqIP = requestIp.getClientIp(req);
    리액트로주는응답제이슨.statuscode = 1;
    리액트로주는응답제이슨.userid = 응답받은제이슨.id;
    리액트로주는응답제이슨.role = 응답받은제이슨.role;
    //  응답제이슨.business_numArr=returnBusiness_Num[0];
    if (응답받은제이슨.role === "teacher") {
      리액트로주는응답제이슨.business_numArr = 응답받은제이슨.business_numArr;
    }

    req.session.userid = 응답받은제이슨.id;
    req.session.user_code = 응답받은제이슨.user_code;
    req.session.sessionID = req.sessionID;
    req.session.requestIp = ReqIP;
    req.session.role = 응답받은제이슨.role;
    await req.session.save((err) => {});

    res.json(리액트로주는응답제이슨);
    return;
  }
};

module.exports.logout = async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sessionID");
    res.clearCookie("userid");
    res.send({ logoutstatuscode: 1 });
  });
};

module.exports.duplicid = async (req, res) => {
  let 응답받은제이슨 = await userservice.duplicidcheckService(req, res);
  //console.log("응답받은제이슨",JSON.stringify(응답받은제이슨))

  res.json(응답받은제이슨);
};

module.exports.memberjoin = async (req, res) => {
  let 응답받은제이슨 = await userservice.memberjoinkService(req, res);
  //console.log("응답받은제이슨",JSON.stringify(응답받은제이슨))

  res.json(응답받은제이슨);
};

module.exports.showmyinfo = async (req, res) => {
  return await userservice.showmyinfoService(req, res);
};

module.exports.changemyinfo = async (req, res) => {
  let 리액트로주는JSON = await userservice.changemyinfoService(req, res);
  //이제 업데이트가 되엇다면 바로 위에 있는 내정보를 가져오는 컨트롤러를 호출해보자.

  if (리액트로주는JSON.updatestatuscode == 1) {
    let { myinfo } = await userservice.showmyinfoService(req, res);

    리액트로주는JSON.myinfo = myinfo;

    res.json(리액트로주는JSON);
  } else {
    res.json(리액트로주는JSON);
  }
};

module.exports.oldpwdcheck = async (req, res) => {
  let 리액트로주는객 = await userservice.oldpwdcheckService(req, res);
  // console.log(리액트로주는객)

  res.json(리액트로주는객);
};

module.exports.changenewpwd = async (req, res) => {
  let 리액트로주는응답제이슨 = await userservice.changenewpwdService(req, res);
  req.session.destroy(() => {
    res.clearCookie("sessionID");
    res.clearCookie("userid");
    res.json(리액트로주는응답제이슨);
  });
};

module.exports.Reserve = async (req, res) => {
  return await userservice.ReserveService(req, res);
};

//내일부턴 실제 결제 AIP와 연결하자. 그리고 밑의 payment 다른 함수도분석
module.exports.redisproductpayment = async (req, res) => {
  //import 에서 토큰을 발급받자

  let 리액트로주는JSON = await userservice.redisproductpaymentService(req, res);
  if (리액트로주는JSON.paymentStatusCode == -1) {
    //예기치못한 에러등으로 DB삽입에 실패시 토큰을 발급받고 바로 취소 해버린다.
    //import 에서 토큰을 발급받자
    let access_token = await importUtile.getImportAccessToken(req, res);
    console.log("---------------환불시작----------");
    await importUtile.paycancleImport(req, res, access_token);
  }

  res.json(리액트로주는JSON);
};

module.exports.rest = async (req, res) => {
  return await userservice.restService(req, res);
};

module.exports.getBannerTypeList = async (req, res) => {
  return await userservice.getBannerTypeListService(req, res);
};

module.exports.getBannerTypeProductList = async (req, res) => {
  return await userservice.getBannerTypeProductListService(req, res);
};





module.exports.getSelectOneBannerTypeProduct= async (req, res) => {
  return await userservice.getSelectOneBannerTypeProductService(req, res);
};

module.exports.insertFirstAddCart= async (req, res) => {
  return await userservice.insertFirstAddCartService(req, res);
};
module.exports.insertPaymnetInfo= async (req, res) => {
  return await userservice.insertPaymnetInfoService(req, res);
};

module.exports.openclassinfo = async (req, res) => {
  return await userservice.openclassinfoService(req, res);
};

//현재 다른 메서드를만드는 중으로 주석처리
// module.exports.reservedmodal = async (req, res) => {

//     return await userservice.modalService(req, res);
// };

module.exports.review = async (req, res) => {
  //get 요청은   query: { ' limit': '0 ', ' onedayclass_num': '1' },
  // 이렇게 쿼리 에 담김
  let obj = await userservice.getReviewService(req, res);

  res.json(obj);
};

module.exports.nextreview = async (req, res) => {
  let obj = await userservice.getnextReviewService(req, res);

  res.json(obj);
};

module.exports.backreivew = async (req, res) => {
  let obj = await userservice.getbackReviewService(req, res);

  res.json(obj);
};

module.exports.payment = async (req, res) => {
  //import 에서 토큰을 발급받자
  let access_token = await importUtile.getImportAccessToken(req, res);

  let statusNum = await userservice.paymentService(req, res);

  let obj = {
    ImportAccessToken: access_token,
    StatusCode: statusNum,
  };

  if (statusNum == -1) {
    console.log("---------------환불시작----------");
    importUtile.paycancleImport(req, res, access_token);
    obj.StatusCode = -1;
  }

  res.json(obj);
};

module.exports.testpayment = async (req, res) => {
  let statusNum = await userservice.testpaymentService(req, res);

  let obj = {
    StatusCode: statusNum,
  };

  if (statusNum == -1) {
    console.log("---------------환불시작----------");
    importUtile.paycancleImport(req, res, access_token);
    obj.StatusCode = -1;
  }

  res.json(obj);
};

module.exports.paycancle = async (req, res) => {
  let access_token = await importUtile.getImportAccessToken(req, res);

  // console.log("결제 취소를 위한 발급받은 토큰 :  " + access_token);

  let statusCode = await importUtile.paycancleImport(req, res, access_token);

  console.log("statusCode:  " + statusCode);

  if (statusCode == 1) {
    await userservice.paycancleService(req, res);
  }

  let obj = { statusCode: statusCode };
  res.json(obj);
};

module.exports.mypage = async (req, res) => {
  let obj = await userservice.mypageService(req, res);

  res.json(obj);
};


module.exports.myCartList= async (req, res) => {
  let obj = await userservice.myCartListService(req, res);

  res.json(obj);
};

module.exports.eachCartDelete= async (req, res) => {
  let obj = await userservice.eachCartDeleteService(req, res);

  res.json(obj);
};


module.exports.allCartDelete =async (req, res) => {
  let obj = await userservice.allCartDeleteService(req, res);

  res.json(obj);
};

module.exports.myreceipt =async (req, res) => {
  let obj = await userservice.myreceiptService(req, res);

  res.json(obj);
};



module.exports.reserveMypage = async (req, res) => {
  let obj = await userservice.reserveMypage(req, res);

  res.json(obj);
};

module.exports.checkreceipt = async (req, res) => {
  let obj = await userservice.checkreceiptService(req, res);

  res.json(obj);
};

module.exports.writingreview = async (req, res) => {
  let obj = await userservice.writingreviewService(req, res);

  res.json(obj);
};
