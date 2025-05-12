const MasterModel = require("../MasterModel/MasterModel");



module.exports.getBusinessListService= async (req, res) => {
  return await MasterModel.getBusinessListModel(req, res);
};

module.exports.updateBusinessStatusService= async (req, res) => {
  return await MasterModel.updateBusinessStatusModel(req, res);
};

module.exports.getPromotionListService = async (req, res) => {
  return await MasterModel.getProMotionListModel(req, res);
};
