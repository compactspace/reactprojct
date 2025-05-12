const MasterServcie = require("../MasterServcie/MasterServcie");

module.exports.getBusinessList = async (req, res) => {
  const list = await MasterServcie.getBusinessListService(req, res);
  res.json(list);
};


module.exports.updateBusinessStatus= async (req, res) => {
  const list = await MasterServcie.updateBusinessStatusService(req, res);
  res.json(list);
};



module.exports.getPromotionList = async (req, res) => {
  const list = await MasterServcie.getPromotionListService(req, res);
  res.json(list);
};
