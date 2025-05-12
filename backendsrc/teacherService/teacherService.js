const teachermodel = require("../reactTeachermodel/TeacherModel");

module.exports.loginService = async (req, res) => {
  return await teachermodel.teacherLoginModel(req, res);
};

module.exports.승인대기중인나의사업자리스트 = async (req, res) => {
  return await teachermodel.승인대기중인나의사업자리스트(req, res);
};

module.exports.원데이클래스번호삽입 = async (req, res) => {
  return await teachermodel.원데이클래스번호삽입(req, res);
};

module.exports.getUsingPaymentBannerAndOnedayInfoServcie = async (req, res) => {
  return await teachermodel.getUsingPaymentBannerAndOnedayInfoModel(req, res);
};

module.exports.getMyBusinessStatusListService = async (req, res) => {
  return await teachermodel.getMyBusinessStatusListModel(req, res);
};


// 한쿼리로 하려니 계속 꼬이네
module.exports.newCreateOnedayService = async (req, res) => {
  return await teachermodel.newCreateOnedayModel(req, res);
};

module.exports.getOneDayClassInfoService = async (req, res) => {
  return await teachermodel.getOneDayClassInfoModel(req, res);
};

module.exports.checkPaymentForBanneService= async (req, res) => {
  return await teachermodel.checkPaymentForBanneModel(req, res);
};

module.exports.원데이클래스번호리스트 = async (req, res) => {
  return await teachermodel.원데이클래스번호리스트(req, res);
};

module.exports.teacherhasrole = async (req, res) => {
  await teachermodel.teacherhasroleModel(req, res);
};

module.exports.getTeacherPhonNumService = async (req, res) => {
  return await teachermodel.getTeacherPhonNumModel(req, res);
};

module.exports.insertclassinfoService = async (req, res) => {
  return await teachermodel.insertclassinfoModel(req, res);
};

module.exports.updateClassinfoService = async (req, res) => {
  return await teachermodel.updateClassinfoModel(req, res);
};

module.exports.toteacherconfirmService = async (req, res) => {
  return await teachermodel.toteacherconfirmModel(req, res);
};
module.exports.getOpenningClassListService = async (req, res) => {
  return await teachermodel.getOpenningClassListModel(req, res);
};

module.exports.getBannerListService = async (req, res) => {
  return await teachermodel.getBannerListModel(req, res);
};
module.exports.isFirstBannaerService = async (req, res) => {
  return await teachermodel.isFirstBannaerModel(req, res);
};

module.exports.payForBannerService = async (req, res) => {
  return await teachermodel.payForBannerModel(req, res);
};

module.exports.getRestCountService = async (req, res) => {
  return await teachermodel.getRestCountModel(req, res);
};

module.exports.insertOpenningclassService = async (req, res) => {
  return await teachermodel.insertOpenningclassModel(req, res);
};

module.exports.showmanagerinfoService = async (req, res) => {
  return await teachermodel.showmanagerinfoModel(req, res);
};

module.exports.activitingOnedayNumListService= async (req, res) => {
  return await teachermodel.activitingOnedayNumListModel(req, res);
};


module.exports.getMyPolicyListService= async (req, res) => {
  return await teachermodel.getMyPolicyListModel(req, res);
};

module.exports.getMyPolicyService= async (req, res) => {
  return await teachermodel.getMyPolicyModel(req, res);
};
module.exports.updateMyPolicyService= async (req, res) => {
  return await teachermodel.updateMyPolicyModel(req, res);
};
module.exports.inserNewMyPolicyService= async (req, res) => {
  return await teachermodel.inserNewMyPolicyModel(req, res);
};
module.exports.getPolicyListService= async (req, res) => {
  return await teachermodel.getPolicyLisModel(req, res);
};
module.exports.inserNewProductInfoService= async (req, res) => {
  return await teachermodel.inserNewProductInfoModel(req, res);
};


module.exports.updateProductInfoService= async (req, res) => {
  return await teachermodel.updateProductInfoModel(req, res);
};


module.exports.getMyProductListService= async (req, res) => {
  return await teachermodel.getMyProductListModel(req, res);
};

module.exports.getMyProductImageService= async (req, res) => {
  return await teachermodel.getMyProductImageModel(req, res);
};

module.exports.goopnenclassService = async (req, res) => {
  return await teachermodel.goopnenclassModel(req, res);
};

module.exports.getTheReservelistsService = async (req, res) => {
  return await teachermodel.getTheReservelistsModel(req, res);
};

module.exports.getTheFullReservelistService = async (req, res) => {
  return await teachermodel.getTheFullReservelistModel(req, res);
};
module.exports.getRocoredOnedayclassNumService= async (req, res) => {
  return await teachermodel.getRocoredOnedayclassNumModel(req, res);
};


module.exports.getSelectOneOnecayClassInfoService= async (req, res) => {
  return await teachermodel.getSelectOneOnecayClassInfoModel(req, res);
};



module.exports.getOneDayClassList = async (req, res) => {
  return await teachermodel.getOneDayClassList(req, res);
};
