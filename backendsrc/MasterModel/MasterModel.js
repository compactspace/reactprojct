const marialpool = require("../model/maria/mariadbpool");
const {
  getActivePromotions,
  PromotionsSearchKeyWord,
} = require("../SQL/ManagerPromotionQuery/ManagerPromotionQuery");

const {
  getBusinessList,
  getBusinessListSearchyCondiction,
  BusinessUpdateTransaction,
  BusinessUpdateTransactionKey,
} = require("../SQL/MasterBusinessQuery/MasterBusinessQuery");

module.exports.getBusinessListModel = async (req, res) => {
  const con = await marialpool.pool2.getConnection();

  let { searchType, business_status, business_creatAt, business_creatAt2 } =
    req.body;
  let excutequery;
  let 리액트로주는JSON = {};

  try {
    if (searchType === "default") {
      business_creatAt = `%${business_creatAt}%`;
      excutequery = await con.query(
        getBusinessList + getBusinessListSearchyCondiction.default,
        [business_status, business_creatAt]
      );
    } else {
      console.log(
        "조회 조건 확인:",
        business_status,
        business_creatAt,
        business_creatAt2
      );

      excutequery = await con.query(
        getBusinessList + getBusinessListSearchyCondiction.between,
        [business_status, business_creatAt, business_creatAt2]
      );
    }

    리액트로주는JSON.businessApplicantCnt = excutequery[0].length;
    리액트로주는JSON.businessApplicantList = excutequery[0];
  } catch (err) {
    리액트로주는JSON.businessApplicantCnt = 0;
    리액트로주는JSON.businessApplicantList = null;
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};

module.exports.updateBusinessStatusModel = async (req, res) => {
  let con;
  let { userid } = req.session;
  let { business_status, reject_cuz, onedayclass_num } = req.body;
  let excutequery;
  let 리액트로주는JSON = {};

  리액트로주는JSON.confirmStatusCode = 1;

  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();
    await con.query(BusinessUpdateTransaction.startXLock);
    if (reject_cuz != undefined) {
      await con.query(BusinessUpdateTransaction.usinessRejectUpdate, [
        business_status,
        reject_cuz,
        userid,
        onedayclass_num,
      ]);
    } else {
      await con.query(BusinessUpdateTransaction.businessConfirmUpdate, [
        business_status,
        userid,
        onedayclass_num,
      ]);
    }
  } catch (err) {
    console.log(err);
    리액트로주는JSON.confirmStatusCode = -1;
  } finally {
    con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.getProMotionListModel = async (req, res) => {
  const con = await marialpool.pool2.getConnection();

  let { searchType, promotion_confirm_status, max_paid } = req.body;
  let excutequery;
  let 리액트로주는JSON = {};
  if (searchType === "default") {
    max_paid = `%${max_paid}%`;
    excutequery = await con.query(
      getActivePromotions + PromotionsSearchKeyWord.default,
      [promotion_confirm_status, max_paid]
    );
  }

  try {
    리액트로주는JSON.bannerpromotionCnt = excutequery[0].length;
    리액트로주는JSON.bannerpromotionList = excutequery[0];
  } catch (err) {
    리액트로주는JSON.bannerpromotionCnt = 0;
    리액트로주는JSON.bannerpromotionList = null;
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};
