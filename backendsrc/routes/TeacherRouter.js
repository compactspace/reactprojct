const express = require("express");
const teachercontroller = require("../reactteachercontroller/teachercontroller");
const router = express.Router();
const axios = require("axios");

router.post("/login", async (req, res) => {
  await teachercontroller.teacherlogin(req, res);
});

router.get("/logout", async (req, res) => {
  console.log("???;");

  req.session.destroy(() => {
    res.clearCookie("sessionID");
    res.clearCookie("tid");
    res.send({ logoutstatuscode: 1 });
  });
});

//선생님 인증을 위한 문자인증
router.post("/messageautho", async (req, res) => {
  let user_tell = await teachercontroller.getTeacherPhonNum(req, res);

  if (user_tell == 0) {
    res.send({ statuscode: "0" });
    return;
  }

  if (user_tell == "미선택" || user_tell == "") {
    res.send({ statuscode: "-1" });
    return;
  }

  let today = new Date();
  let 요청자가받을번호 = user_tell;

  console.log("요청자가받을번호:  " + 요청자가받을번호);

  let authonumber = (Math.floor(Math.random() * 9999) + 10000).toString();

  // messageService.sendOne({
  //    to: 요청자가받을번호,
  //    from: "01093130686",
  //    text: authonumber,
  //    subject: "인증번호보내드립니다."// LMS, MMS 전용 옵션, SMS에서 해당 파라미터 추가될 경우 자동으로 LMS 변경처리 됨
  // }).then(res => console.log(res));

  let seconds = today.getSeconds(); // 초

  req.session.authonumber = authonumber;
  // console.log(req.session)

  console.log(`인증번호 발급: ${authonumber}`);

  res.send(authonumber);
});

//받은 인증번호로 인증하기
router.post("/authocheck", async (req, res) => {
  let { authonumber } = req.body;

  let 서버에서발급했던인증번호 = req.session.authonumber;

  let 리액트로주는JSON = new Object();

  // console.log("authonumber:  ",authonumber)

  // console.log("서버에서발급했던인증번호r:  ",서버에서발급했던인증번호)

  if (서버에서발급했던인증번호 == authonumber) {
    //기존에 작성신청했던 이력이 있는지 확인
    let obj = await teachercontroller.승인대기중인나의사업자리스트(req, res);
    console.log(obj);
    리액트로주는JSON.watingBusinessList = obj.watingBusinessList;
    리액트로주는JSON.watingBusinessListCnt = obj.watingBusinessListCnt;
    리액트로주는JSON.authostatuscode = 1;
    // req.session.destroy(
    //    () => {
    //       res.json(리액트로주는JSON);
    //       return;
    //    }

    // );
    res.json(리액트로주는JSON);
  } else {
    리액트로주는JSON.authostatuscode = -1;
    res.json(리액트로주는JSON);
    return;
  }
});

//진위여부 확인은 개업일자 까지필요하니 일단은 걍 투르로 통과시킨다.
router.post("/authoCorporation", async (req, res) => {
  let { business_num } = req.body;

  let 하이푼나눈배열 = business_num.split("-");
  // console.log(하이푼나눈배열)
  business_num = "";
  if (하이푼나눈배열.length > 0) {
    for (let k = 0; k < 하이푼나눈배열.length; k++) {
      business_num += 하이푼나눈배열[k].trim();
    }
  }
  // console.log("business_num:  "+business_num)

  let 공공데이터서비스키 =
    "GhRJv8ycxRRBetiPJrJJn0wvxKyRWvfo%2B2%2FLp7Ei65PuIROQI7IcZ48p%2F71i%2FpNLUzaRgv9nVNsqXRNNIW4I6w%3D%3D";

  let data = {
    b_no: [`${business_num}`], // 사업자번호 "xxxxxxx" 로 조회 시,
  };
  let 리액트로주는JSON = new Object();
  let headers = { "content-type": "application/json" };
  let url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${공공데이터서비스키}`;

  let 받은사업자의상태;

  await axios
    .post(url, JSON.stringify(data), { headers })
    .then((res) => {
      console.log(res.data);

      let 사업자등록상태객체 = res.data.data[0];
      // console.log(사업자등록상태객체)
      받은사업자의상태 = 사업자등록상태객체.b_stt;

      // 리액트로주는JSON.statuscode = 1
      // return 리액트로주는JSON;
    })
    .catch((err) => {
      console.log("공공데이터 api에러");
      리액트로주는JSON.statuscode = -1;
      return 리액트로주는JSON;
    });
  // console.log("받은사업자의상태:  "+받은사업자의상태);

  리액트로주는JSON.statuscode = 1;

  if (받은사업자의상태 == "") {
    리액트로주는JSON.statuscode = -1;
    res.json(리액트로주는JSON);
    return;
  }

  await teachercontroller.teacherhasrole(req, res);

  res.json(리액트로주는JSON);
  return;
});

//원데이클래스번호 삽입
router.post("/insertonedayclassnum", async (req, res) => {
  await teachercontroller.원데이클래스번호삽입(req, res);
});

//한명의 선생님의 원데이클래스 번호만 가져온다.
router.post("/getOnedayClassNumList", async (req, res) => {
  await teachercontroller.원데이클래스번호리스트(req, res);
});

router.post("/getUsingPaymentBannerAndOnedayInfo", async (req, res) => {
  await teachercontroller.getUsingPaymentBannerAndOnedayInfo(req, res);
});

// 사업자승인 status 가 떨어진 리스트를 가져온다.
router.post("/getMyBusinessStatusList", async (req, res) => {
  await teachercontroller.getMyBusinessStatusList(req, res);
});

// 인증을 받았느나, 원데이클래스 정보를 삽입하지 않은 원데이클래스 번호리스트를 가져온다.
router.post("/newCreateOneday", async (req, res) => {
  await teachercontroller.newCreateOneday(req, res);
});

// 인증을받고 원데이클래스 정보를삽입한 원데이클래스 에 한하여 리스트로  가져온다.
router.post("/getOneDayClassInfo", async (req, res) => {
  await teachercontroller.getOneDayClassInfo(req, res);
});

// 개강을 위한 배너 지불 했는지 여부를 리턴한다.
router.post("/checkPaymentForBanne", async (req, res) => {
  await teachercontroller.checkPaymentForBanne(req, res);
});

//클래스 정보만 삽입
router.post("/insertclassinfo", async (req, res) => {
  await teachercontroller.insertclassinfo(req, res);
});

//클래스 정보를 업데이트
router.post("/updateclassinfo", async (req, res) => {
  await teachercontroller.updateClassinfo(req, res);
});

//클래스 정보만 삽입후 선생님으로 전환
router.post("/toteacherconfirm", async (req, res) => {
  await teachercontroller.toteacherconfirm(req, res);
});

//해당 월의 개강 여부리스트를 가져온다.
router.post("/getOpenningClassList", async (req, res) => {
  await teachercontroller.getOpenningClassList(req, res);
});

// 이제 배너상품 리스트를 가져온다.
router.post("/getBannerList", async (req, res) => {
  await teachercontroller.getBannerList(req, res);
});
//배너 자체를 처음등록하는지 아닌지를 가져온다.
router.post("/isFirstBannaer", async (req, res) => {
  await teachercontroller.isFirstBannaer(req, res);
});

// 이제 배너등록 결제 정보 삽입 시도한다.
router.post("/payForBanner", async (req, res) => {
  await teachercontroller.payForBanner(req, res);
});

// 해당 일의 남은 자리수를 가져온다.
router.post("/getRestCount", async (req, res) => {
  await teachercontroller.getRestCount(req, res);
});

// 최초 해당 년월일의 개강을 시도한다.
router.post("/insertOpenningclass", async (req, res) => {
  await teachercontroller.insertOpenningclas(req, res);
});

//선택한 날짜의 수업 관리 정보만 가져온다.
router.post("/showmanagerinfo", async (req, res) => {
  await teachercontroller.showmanagerinfo(req, res);
});

// 배너결제가 완료되고, 결제시점기준 현재 유효한 원데이클래스 번호 "리스트"를 가져온다.
router.post("/activitingOnedayNumList", async (req, res) => {
  await teachercontroller.activitingOnedayNumList(req, res);
});

router.post("/getMyPolicyList", async (req, res) => {
  await teachercontroller.getMyPolicyList(req, res);
});

router.post("/getMyPolicy", async (req, res) => {
  await teachercontroller.getMyPolicy(req, res);
});

router.post("/updateMyPolicy", async (req, res) => {
  await teachercontroller.updateMyPolicy(req, res);
});

// 새로운 판매  정책 정보를 삽입
router.post("/inserNewMyPolicy", async (req, res) => {
  await teachercontroller.inserNewMyPolicy(req, res);
});

// 위 post랑 헷갈리지 말것 이는 조인문으로 처리함
router.get("/getPolicyList", async (req, res) => {
  await teachercontroller.getPolicyList(req, res);
});

//새로운 제품 정보를 삽입
router.post("/inserNewProductInfo", async (req, res) => {
  await teachercontroller.inserNewProductInfo(req, res);
});


// 제품정보를수정
router.post("/updateProductInfo", async (req, res) => {
  await teachercontroller.updateProductInfo(req, res);
});



// 하나의 product_policy_num 에 대한 제품 리스트를 가져오기
router.post("/getMyProductList", async (req, res) => {
  await teachercontroller.getMyProductList(req, res);
});


// 하나의 product_policy_num 에 대한 제품 리스트를 가져오기
router.post("/getMyProductImage", async (req, res) => {
  await teachercontroller.getMyProductImage(req, res);
});







router.post("/goopnenclass", async (req, res) => {
  await teachercontroller.goopnenclass(req, res);
});

router.post("/getTheReservelist", async (req, res) => {
  await teachercontroller.getTheReservelists(req, res);
});

//선택한 날짜의 인원수 마감등을 한다 가져온다.
router.post("/getTheFullReservelist", async (req, res) => {
  await teachercontroller.getTheFullReservelist(req, res);
});

//선생님이 자신이 원데이클래스테이블에  등록한 원데이클래스 번호만을 가져온다.
router.post("/getRocoredOnedayclassNumList", async (req, res) => {
  await teachercontroller.getRocoredOnedayclassNumList(req, res);
});

//선생님이 자신이 원데이클래스테이블에  등록한 원데이클래스 정보를 단건으로 가져온다.
router.post("/getSelectOneOnecayClassInfo", async (req, res) => {
  await teachercontroller.getSelectOneOnecayClassInfo(req, res);
});

//선생님이 자신이 등록한 원데이클래스 정보를 수정하기위해  자신이 등록한 리스트를 가져온다.
router.post("/teachersOnedayList", async (req, res) => {
  await teachercontroller.getOneDayClassList(req, res);
});

module.exports = router;
