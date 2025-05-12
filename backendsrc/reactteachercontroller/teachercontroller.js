const teacherService = require("../teacherService/teacherService");

module.exports.teacherlogin = async (req, res) => {
  let 리액트로주는JSON = await teacherService.loginService(req, res);

  console.log("로그인성공 코드 ", 리액트로주는JSON.loginstatuscode);
  if (리액트로주는JSON.loginstatuscode == 1) {
    if (리액트로주는JSON?.confirm == "yes") {
      req.session.onedayclass_num = 리액트로주는JSON.onedayclass_num;
    }

    리액트로주는JSON.loginstatuscode = 1;
    // req.session.privilege = "teacher";
    // console.log(`세션 넣기전 아이디 ${req.body.tid}`);
    req.session.userid = req.body.tid;
    req.session.sessionID = req.sessionID;

    await req.session.save((err) => {});

    res.json(리액트로주는JSON);
  }
};

module.exports.승인대기중인나의사업자리스트 = async (req, res) => {
  return await teacherService.승인대기중인나의사업자리스트(req, res);
};

module.exports.원데이클래스번호삽입 = async (req, res) => {
  let 리액트로주는JSON = new Object();
  리액트로주는JSON = await teacherService.원데이클래스번호삽입(req, res);

  res.json(리액트로주는JSON);
};

module.exports.원데이클래스번호리스트 = async (req, res) => {
  let 리액트로주는JSON = new Object();
  리액트로주는JSON = await teacherService.원데이클래스번호리스트(req, res);

  res.json(리액트로주는JSON);
};

module.exports.getUsingPaymentBannerAndOnedayInfo = async (req, res) => {
  let 리액트로주는JSON = new Object();
  리액트로주는JSON =
    await teacherService.getUsingPaymentBannerAndOnedayInfoServcie(req, res);
  res.json(리액트로주는JSON);
};

module.exports.getMyBusinessStatusList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getMyBusinessStatusListService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.newCreateOneday = async (req, res) => {
  let 리액트로주는JSON = await teacherService.newCreateOnedayService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.getOneDayClassInfo = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getOneDayClassInfoService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.checkPaymentForBanne = async (req, res) => {
  let 리액트로주는JSON = new Object();
  리액트로주는JSON = await teacherService.checkPaymentForBanneService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.원데이클래스번호리스트 = async (req, res) => {
  let 리액트로주는JSON = new Object();
  리액트로주는JSON = await teacherService.원데이클래스번호리스트(req, res);

  res.json(리액트로주는JSON);
};

module.exports.teacherhasrole = async (req, res) => {
  await teacherService.teacherhasrole(req, res);
};

module.exports.getTeacherPhonNum = async (req, res) => {
  return await teacherService.getTeacherPhonNumService(req, res);
};

module.exports.insertclassinfo = async (req, res) => {
  let 리액트로주는JSON = await teacherService.insertclassinfoService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.updateClassinfo = async (req, res) => {
  let 리액트로주는JSON = await teacherService.updateClassinfoService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.toteacherconfirm = async (req, res) => {
  let 리액트로주는JSON = await teacherService.toteacherconfirmService(req, res);

  req.session.onedayclass_num = 리액트로주는JSON.onedayclass_num;
  req.session.save(() => {});

  res.json(리액트로주는JSON);
};
module.exports.getOpenningClassList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getOpenningClassListService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.getBannerList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getBannerListService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.isFirstBannaer = async (req, res) => {
  let 리액트로주는JSON = await teacherService.isFirstBannaerService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.payForBanner = async (req, res) => {
  let 리액트로주는JSON = await teacherService.payForBannerService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.getRestCount = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getRestCountService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.insertOpenningclas = async (req, res) => {
  let 리액트로주는JSON = await teacherService.insertOpenningclassService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.showmanagerinfo = async (req, res) => {
  let 리액트로주는JSON = await teacherService.showmanagerinfoService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.activitingOnedayNumList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.activitingOnedayNumListService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.getMyPolicyList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getMyPolicyListService(req, res);

  res.json(리액트로주는JSON);
};
module.exports.getMyPolicy = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getMyPolicyService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.updateMyPolicy = async (req, res) => {
  let 리액트로주는JSON = await teacherService.updateMyPolicyService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.inserNewMyPolicy = async (req, res) => {
  let 리액트로주는JSON = await teacherService.inserNewMyPolicyService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.getPolicyList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getPolicyListService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.inserNewProductInfo = async (req, res) => {
   let 리액트로주는JSON = await teacherService.inserNewProductInfoService(req, res);
  res.json(리액트로주는JSON);
};

module.exports.updateProductInfo= async (req, res) => {
  let 리액트로주는JSON = await teacherService.updateProductInfoService(req, res);
 res.json(리액트로주는JSON);
};



module.exports.getMyProductList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getMyProductListService(req, res);
 res.json(리액트로주는JSON);
};
module.exports.getMyProductImage= async (req, res) => {
  let 리액트로주는JSON = await teacherService.getMyProductImageService(req, res);
 res.json(리액트로주는JSON);
};


module.exports.goopnenclass = async (req, res) => {
  let 리액트로주는JSON = await teacherService.goopnenclassService(req, res);

  res.json(리액트로주는JSON);
};

module.exports.getTheReservelists = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getTheReservelistsService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.getTheFullReservelist = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getTheFullReservelistService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.getRocoredOnedayclassNumList = async (req, res) => {
  let 리액트로주는JSON = await teacherService.getRocoredOnedayclassNumService(
    req,
    res
  );

  res.json(리액트로주는JSON);
};

module.exports.getSelectOneOnecayClassInfo = async (req, res) => {
  let 리액트로주는JSON =
    await teacherService.getSelectOneOnecayClassInfoService(req, res);

  res.json(리액트로주는JSON);
};
module.exports.getOneDayClassList = async (req, res) => {
  let 선생님이등록한원데이클래스리스트 =
    await teacherService.getOneDayClassList(req, res);

  let 리액트로주는JSON = new Object();
  리액트로주는JSON["onedayClassList"] = 선생님이등록한원데이클래스리스트;

  res.json(리액트로주는JSON);
};
