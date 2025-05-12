const BusinessUpdateTransactionKey = {
  T1: "select * from teacher for update",
  //승인시
  T2: "update teacher set  business_status=? , reject_cuz='결격사유해소'  , confirm_master_id=? where  onedayclass_num=?",
  //거절시
  T3: "update teacher set  business_status=? , reject_cuz=? ,confirm_master_id=?  where  onedayclass_num=?",
};
const BusinessUpdateTransaction = {
  startXLock: BusinessUpdateTransactionKey.T1,
  businessConfirmUpdate: BusinessUpdateTransactionKey.T2,
  usinessRejectUpdate: BusinessUpdateTransactionKey.T3,
};

const getBannerInfoList = "select * from bannerinfo";

const getBusinessList = `

select * from teacher as t 

`;

const getBusinessListSearchyCondiction = {
  //일 자는 무시하고, 월단위 조회 이다.
  default: `where t.business_status =?  and t.business_creatAt like ?`,
  between: `WHERE t.business_status =? AND DATE(t.business_creatAt) >= ?
    AND DATE(t.business_creatAt) < ?`,
};

module.exports = {
  getBusinessList,
  getBusinessListSearchyCondiction,
  getBannerInfoList,
  BusinessUpdateTransaction,
  BusinessUpdateTransactionKey,
};
