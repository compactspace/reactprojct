const usermodel = require("../reactmodel/usermodel");
module.exports.NaverLoingService = async (req, res, result) => {
  let data = result.data;

  let check = await usermodel.NaverLoingModel(req, res, data);

  return check;
};

module.exports.loginService = async (req, res) => {
  return await usermodel.loginModel(req, res);
};

module.exports.showmyinfoService = async (req, res) => {
  return await usermodel.showmyinfoModel(req, res);
};

module.exports.changemyinfoService = async (req, res) => {
  return await usermodel.changemyinfoModel(req, res);
};

module.exports.duplicidcheckService = async (req, res) => {
  return await usermodel.duplicidcheckModel(req, res);
};

module.exports.memberjoinkService = async (req, res) => {
  return await usermodel.memberjoinModel(req, res);
};

module.exports.oldpwdcheckService = async (req, res) => {
  return await usermodel.oldpwdcheckModel(req, res);
};

module.exports.changenewpwdService = async (req, res) => {
  return await usermodel.changenewpwdModel(req, res);
};

module.exports.ReserveService = async (req, res) => {
  return await usermodel.ReserveModel(req, res);
};

module.exports.redisproductpaymentService = async (req, res) => {
  return await usermodel.redisproductpaymentModel(req, res);
};

module.exports.restService = async (req, res) => {
  return await usermodel.restModel(req, res);
};

module.exports.getBannerTypeListService = async (req, res) => {
  return await usermodel.getBannerTypeListModel(req, res);
};

module.exports.getBannerTypeProductListService = async (req, res) => {
  return await usermodel.getBannerTypeProductListModel(req, res);
};

module.exports.getSelectOneBannerTypeProductService = async (req, res) => {
  return await usermodel.getSelectOneBannerTypeProducModel(req, res);
};

module.exports.insertFirstAddCartService = async (req, res) => {
  return await usermodel.insertFirstAddCartModel(req, res);
};

module.exports.insertPaymnetInfoService = async (req, res) => {
  return await usermodel.insertPaymnetInfoModel(req, res);
};

module.exports.modalService = async (req, res) => {
  return await usermodel.reservemoadlModel(req, res);
};

module.exports.openclassinfoService = async (req, res) => {
  return await usermodel.openclassinfoModel(req, res);
};

module.exports.paymentService = async (req, res) => {
  return await usermodel.paymentModel(req, res);
};

module.exports.testpaymentService = async (req, res) => {
  return await usermodel.testpaymentModel(req, res);
};

module.exports.paycancleService = async (req, res) => {
  return await usermodel.paycancleModel(req, res);
};

module.exports.getReviewService = async (req, res) => {
  //get 요청은   query: { ' limit': '0 ', ' onedayclass_num': '1' },
  // 이렇게 쿼리 에 담김

  return await usermodel.getReviewModel(req, res);
};

module.exports.getnextReviewService = async (req, res) => {
  return await usermodel.getnextReviewModel(req, res);
};

module.exports.getbackReviewService = async (req, res) => {
  return await usermodel.getbackReviewModel(req, res);
};

module.exports.mypageService = async (req, res) => {
  return await usermodel.mypageModel(req, res);
};
module.exports.myCartListService = async (req, res) => {
  return await usermodel.myCartListModel(req, res);
};

module.exports.eachCartDeleteService = async (req, res) => {
  return await usermodel.eachCartDeleteModel(req, res);
};

module.exports.allCartDeleteService = async (req, res) => {
  return await usermodel.allCartDeleteModel(req, res);
};

module.exports.myreceiptService = async (req, res) => {
  return await usermodel.myreceiptModel(req, res);
};

module.exports.reserveMypage = async (req, res) => {
  return await usermodel.reserveMypageModel(req, res);
};

module.exports.checkreceiptService = async (req, res) => {
  return await usermodel.checkreceiptModel(req, res);
};

module.exports.writingreviewService = async (req, res) => {
  return await usermodel.writingreviewModel(req, res);
};
