const e = require("express");
const mariadbpool = require("../model/maria/mariadbpool");
const requestIp = require("request-ip");
const {
  TeacherBusinessList,
  SearchKeywordBusinessList,

  getBannerPayMentInfo,
  TeacherPayForBannerTransaction,
  isFirstCheckBanner,
  isExpried,
  TeacherPayForBannerSubTransaction,
  activeList,
  TeacherPayForBannerDefaultTransactionValue,
  checkPaymentForBanne,
  selectListOnedayNum,
} = require("../SQL/TeacherBusineesQuery/TeacherBusineesQuery");

const {
  getOnedayClassInfo,
  searchOnedayClass,
  getTeacherOnedayClassNumList,
  alreadyOnedayClassInfoCheck,
  checkBusiness_status,
  TeacherInsertOnedayTransaction,
  TeacherInsertOnedayTransactionKey,
  TeacherInsertOpenningTransaction,
  TeacherInsertOpenningTransactionKey,
  getRocoredOnedayclassNum,
  getSelectOneOnedayClassInfo,
} = require("../SQL/TeacherOnedayClassQuery/TeacherOnedayClassQuery");

const {
  getBannerInfoList,
} = require("../SQL/MasterBusinessQuery/MasterBusinessQuery");

const {
  checkOutActivitingBanner,
} = require("../SQL/TeacherBannerQuery/TeacherBannerQuery");

const {
  checkoutNewProduct,
  insertNewProductTransaction,
  selectListMyProduct,
  selectListMyImage,
  updateProductTransaction,
} = require("../SQL/TeacherProductQuery/TeacherProductQuery");

const {
  selectOneMyPolicy,
  insertNewPolicyTransaction,
  updatePolicyTransaction,
  selectListMyPolicy,
} = require("../SQL/TeacherPolicyQuery/TeacherPolicyQuery");

module.exports.teacherLoginModel = async (req, res) => {
  let { tid, password } = req.body;
  //console.log("tid  password  ", tid, password);
  let id = tid;
  let con;
  let executequery;
  let 찾은로우;
  let 응답JSON = new Object();
  try {
    let sql = "select * from user where id=? and password=?";
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(sql, [id, password]);
    찾은로우 = executequery[0];
    //  console.log(찾은로우);

    // let 인증된사업자냐 = executequery[0][0].confirm;

    // if (인증된사업자냐 == "yes") {
    //   // console.log("인증된사업자냐:  ", 인증된사업자냐);
    //   응답JSON.confirm = 인증된사업자냐;
    //   let 원데이클래스번호 = executequery[0][0].onedayclass_num;
    //   //   console.log("원데이클래스번호는?:  ", 원데이클래스번호);
    // }

    if (찾은로우.length == 0) {
      응답JSON.loginstatuscode = -1;
      return;
    }
    let sql2 = "select * from  teacher where tid=?";
    executequery = await con.query(sql2, [tid]);
    // console.log("---여러개사업자인증--");
    // console.log(executequery[0]);
    // console.log("---여러개사업자인증--");
    let onedayclass_num = executequery[0][0].onedayclass_num;
    응답JSON.onedayclass_num = onedayclass_num;
    응답JSON.loginstatuscode = 1;
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    return 응답JSON;
  }
};

module.exports.teacherhasroleModel = async (req, res) => {
  let tid = req.session.tid;
  if (tid == undefined) {
    tid = "teacher1";
  }
  let con;
  let sql = "update teacher set business_status='waiting' where tid=?";
  let executequery;
  let 찾은로우;
  let 응답JSON = new Object();
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(sql, [tid]);
    찾은로우 = executequery[0];

    //console.log(찾은로우);
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    return 1;
  }
};

module.exports.getTeacherPhonNumModel = async (req, res) => {
  let tid = req.session;
  //console.log(tid);
  let con;
  let sql = "select * from user where id=?";
  let executequery;
  let user_tell;
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(sql, [tid]);
    user_tell = executequery[0][0].user_tell;
    //   console.log("가입자 id", tid, "그리고 폰번호, ", user_tell);
  } catch (ree) {
    console.log(err);
  } finally {
    con.release();
    return user_tell;
  }
};

// module.exports.getTeacherPhonNumModel = async (req, res) => {
//   let con;
//   let sql = "select * from teacher where tid=?";
//   let executequery;
//   let tid = req.session.tid;
//   let teacher_tell;
//   console.log(req.session);
//   console.log("tid->>, ", tid);

//   if (tid == null || tid == undefined) {
//     return 0;
//   }
//   try {
//     con = await mariadbpool.pool2.getConnection();
//     executequery = await con.query(sql, [tid]);
//     teacher_tell = executequery[0][0].teacher_tell;
//     console.log("선생id", tid, "그리고 폰번호, ", teacher_tell);
//   } catch (ree) {
//     console.log(err);
//   } finally {
//     con.release();
//     return teacher_tell;
//   }
// };

module.exports.insertclassinfoModel = async (req, res) => {
  let tid = req.session.userid;

  let {
    onedayclass_name,
    onedayclass_price,
    nickname,
    reserve_img,
    ClassLocation,
    Park,
    PlayTime,
    Playinguser,
    ClassIntro,
    business_num,
  } = req.body;

  let onedayclass_info =
    ClassLocation + "_" + Park + "_" + PlayTime + "_" + Playinguser;

  if (nickname === undefined) {
    nickname = "친절한선생님";
  }

  //console.log(`선생님 아이디: ${tid}  그리고 사업자등록번호: ${business_num}`);

  let con;
  let 리액트로주는JSON = {};
  try {
    //선생이 가진 클래스번호를 가져온다. 단 한 선생이 여려 수업을 등록햇을수있으니 max로 가져온다.
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();

    let 개설허가된원데이클래스아이디;
    let returnRow = await con.query(
      TeacherInsertOnedayTransaction.getNoCreatedOnedayNum,
      [tid, business_num]
    );

    //console.log(returnRow[0]);
    개설허가된원데이클래스아이디 = returnRow[0][0].onedayclass_num;

    let 대표이미지 = reserve_img[0];

    let executequery;
    executequery = await con.query(
      TeacherInsertOnedayTransaction.insertFirstOnedayInfo,
      [
        개설허가된원데이클래스아이디,
        onedayclass_name,
        onedayclass_price,
        onedayclass_info,
        ClassLocation,
        Park,
        PlayTime,
        Playinguser,
        ClassIntro,
        대표이미지,
        nickname,
      ]
    );

    executequery = await con.query(
      TeacherInsertOnedayTransaction.insertOnedayRecord,
      [
        개설허가된원데이클래스아이디,
        onedayclass_name,
        onedayclass_price,
        onedayclass_info,
        ClassLocation,
        Park,
        PlayTime,
        Playinguser,
        ClassIntro,
        대표이미지,
      ]
    );

    for (let i = 0; i < reserve_img.length; i++) {
      executequery = await con.query(
        TeacherInsertOnedayTransaction.insertOnedayReserveIamge,
        [reserve_img[i], 개설허가된원데이클래스아이디]
      );
    }
  } catch (err) {
    console.log(err);
    await con.rollback();

    리액트로주는JSON.updatestatuscode = -1;
  } finally {
    await con.commit();
    con.release();
    리액트로주는JSON.updatestatuscode = 1;
    return 리액트로주는JSON;
  }
};

module.exports.updateClassinfoModel = async (req, res) => {
  let tid = req.session.userid;
  let con;

  let 리액트로주는JSON = new Object();
  try {
    //선생이 가진 클래스번호를 가져온다. 단 한 선생이 여려 수업을 등록햇을수있으니 max로 가져온다.
    con = await mariadbpool.pool2.getConnection();
    let affectedRows = await sqlGenerator(req.body, con, tid);

    if (affectedRows <= 0) {
      리액트로주는JSON[updatestatuscode] = affectedRows;
      return 리액트로주는JSON;
    }

    let {
      onedayclass_num,
      onedayclass_name,
      onedayclass_price,
      onedayclass_info,
      reserve_img,
      ClassLocation,
      Park,
      PlayTime,
      Playinguser,
      ClassIntro,
      // business_num,
    } = req.body;

    //console.log(`받은 이미지테이블 갯수 : ${reserve_img.length}`);
    let 대표이미지 = reserve_img[0];
    let 업데이트이력테이블삽입 =
      "insert into onedayclassupdaterecode (onedayclass_num,onedayclass_name, onedayclass_price , ClassLocation , Park,PlayTime, Playinguser, ClassIntro, reserve_img) values (?,?,?,?,?,?,?,?,?)";
    executequery = await con.query(업데이트이력테이블삽입, [
      onedayclass_num,
      onedayclass_name,
      onedayclass_price,
      ClassLocation,
      Park,
      PlayTime,
      Playinguser,
      ClassIntro,
      대표이미지,
    ]);

    // 기존 이미지를 모두 삭제하고 새로 삽입하는 방식
    const minImage_numQuery =
      "select min(image_num) as image_num FROM  onedayclassimg WHERE onedayclass_num=?;";

    // 1. 기존 이미지를 삭제
    const returnRow = await con.query(minImage_numQuery, [onedayclass_num]);
    // console.log(returnRow);
    // console.log(returnRow[0]);

    let minImage_num = returnRow[0][0].image_num;

    // 이는 애초에 사진이 없었던경우
    let 최초삽이image_num;
    if (minImage_num === null) {
      let 최초삽입SQL = `select max(image_num) as maximage_num FROM  onedayclassimg`;
      const returnRow = await con.query(최초삽입SQL);
      //  console.log(returnRow);

      최초삽이image_num = returnRow[0][0].maximage_num + 1;
      console.log(`최초삽이image_num:  ${최초삽이image_num}`);

      await 이미지자체를최초삽입하는함수(
        con,
        reserve_img,
        onedayclass_num,
        최초삽이image_num
      );
    } else {
      await 기존에있던이미지를새로운이미지로업데이트하는함수(
        con,
        reserve_img,
        onedayclass_num,
        minImage_num
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
  }

  // 원데이클래스 테이블은 업데이트 시킨다.

  //그리고 원데이클래스업데이트레코드 테이블은 인설트시킨다.
};

//최초삽입 펑셩
const 이미지자체를최초삽입하는함수 = async (
  con,
  reserve_img,
  onedayclass_num,
  최초삽이image_num
) => {
  console.log(`최초삽이image_num: ${최초삽이image_num}`);
  let 이미지테이블반복문 =
    "insert into onedayclassimg (reserve_img,onedayclass_num ,image_num) values(?,?,?) ";
  for (let i = 0; i < reserve_img.length; i++) {
    executequery = await con.query(이미지테이블반복문, [
      reserve_img[i],
      onedayclass_num,
      최초삽이image_num,
    ]);
    최초삽이image_num++;
  }
};

//최초삽입 펑셩
const 기존에있던이미지를새로운이미지로업데이트하는함수 = async (
  con,
  reserve_img,
  onedayclass_num,
  minImage_num
) => {
  let 이미지테이블반복문 =
    "update onedayclassimg  set  reserve_img=? where onedayclass_num=? and image_num=?";

  for (let i = 0; i < reserve_img.length; i++) {
    executequery = await con.query(이미지테이블반복문, [
      reserve_img[i],
      onedayclass_num,
      minImage_num,
    ]);
    minImage_num++;
  }
};

const sqlGenerator = async (param, con, tid) => {
  let x = con;
  let {
    onedayclass_num,
    onedayclass_name,
    onedayclass_price,
    onedayclass_info,
    reserve_img,
    ClassLocation,
    Park,
    PlayTime,
    Playinguser,
    ClassIntro,
    // business_num,
  } = param;

  onedayclass_name = onedayclass_name !== undefined ? onedayclass_name : null;
  onedayclass_price =
    onedayclass_price !== undefined ? onedayclass_price : null;
  onedayclass_info = onedayclass_info !== undefined ? onedayclass_info : null;
  reserve_img = reserve_img !== undefined ? reserve_img : null;
  ClassLocation = ClassLocation !== undefined ? ClassLocation : null;
  Park = Park !== undefined ? Park : null;
  PlayTime = PlayTime !== undefined ? PlayTime : null;
  Playinguser = Playinguser !== undefined ? Playinguser : null;
  ClassIntro = ClassIntro !== undefined ? ClassIntro : null;
  // business_num = business_num !== undefined ? business_num : null;

  // 동적으로 업데이트 쿼리 생성
  let sql = "UPDATE onedayclass SET ";

  let updates = [];

  if (onedayclass_name !== null)
    updates.push(`onedayclass_name = '${onedayclass_name}'`);
  if (onedayclass_price !== null)
    updates.push(`onedayclass_price = '${onedayclass_price}'`);
  if (onedayclass_info !== null)
    updates.push(`onedayclass_info = '${onedayclass_info}'`);
  if (reserve_img !== null) updates.push(`reserve_img = '${reserve_img[0]}'`);
  if (ClassLocation !== null)
    updates.push(`ClassLocation = '${ClassLocation}'`);
  if (Park !== null) updates.push(`Park = '${Park}'`);
  if (PlayTime !== null) updates.push(`PlayTime = '${PlayTime}'`);
  if (Playinguser !== null) updates.push(`Playinguser = '${Playinguser}'`);
  if (ClassIntro !== null) updates.push(`ClassIntro = '${ClassIntro}'`);
  // if (business_num !== null) updates.push(`business_num = '${business_num}'`);

  // 항상 updateAt을 현재 시간으로 설정
  updates.push("updateAt = CURRENT_TIMESTAMP()");

  // 업데이트 필드가 있으면 쿼리에 추가
  if (updates.length > 0) {
    sql += updates.join(", ") + ` WHERE onedayclass_num = '${onedayclass_num}'`; // 조건 추가 (선생님 아이디)
    //   console.log("업데이트 쿼리:", sql);

    await con.query(sql);
    return 1;
  } else {
    return 0;
  }
};

module.exports.승인대기중인나의사업자리스트 = async (req, res) => {
  let tid = req.session.userid;
  let business_status = "yes";
  let con = await mariadbpool.pool2.getConnection();
  let sql;
  let executequery;
  let returnRow;
  let returnRowCnt = 0;
  let 리액트로주는JSON = new Object();
  try {
    executequery = await con.query(
      TeacherBusinessList + SearchKeywordBusinessList.DefaultSearch,
      [tid, business_status]
    );

    returnRow = executequery[0];
    returnRowCnt = (Array.isArray(returnRow) && returnRow.length) || 0;
  } catch (err) {
    console.log(err);
  } finally {
    리액트로주는JSON.watingBusinessList = returnRow;
    리액트로주는JSON.watingBusinessListCnt = returnRowCnt;
    console.log(tid);
    return 리액트로주는JSON;
  }
};

module.exports.원데이클래스번호삽입 = async (req, res) => {
  let tid = req.session.userid;
  let { business_num, rental_file } = req.body;

  let con = await mariadbpool.pool2.getConnection();
  let sql;
  let executequery;
  let 리액트로주는JSON = new Object();
  sql =
    "select count(*) as duplic , onedayclass_num from teacher  where tid=? and business_num=? ";
  let returnRow = await con.query(sql, [tid, business_num]);
  // console.log(returnRow);
  // console.log(returnRow[0]);
  if (returnRow[0][0].duplic >= 1) {
    리액트로주는JSON.duplicStatuscode = -1;

    let onedayclass_num = returnRow[0][0].onedayclass_num;

    returnRow = await con.query(getSelectOneOnedayClassInfo, [
      tid,
      onedayclass_num,
    ]);

    if (returnRow[0][0]?.onedayclass_num != undefined) {
      리액트로주는JSON.duplicStatuscode = -10;
    }
  } else {
    sql = "insert into teacher (tid,business_num,rental_file) values(?,?,?) ";
    executequery = await con.query(sql, [tid, business_num, rental_file]);

    let 반영여부 = executequery[0].affectedRows;

    리액트로주는JSON.duplicStatuscode = 1;
  }
  return 리액트로주는JSON;
};

module.exports.getUsingPaymentBannerAndOnedayInfoModel = async (req, res) => {
  let tid = req.session.userid;
  let { onedayclass_num } = req.body;
  let con = await mariadbpool.pool2.getConnection();
  let executequery;
  let executeOnedayquery;
  let 리액트로주는JSON = {};
  let returnRowValue;
  let returnRow;
  let returnOnedayRow = null;
  console.log(`검색조건  tid:${tid}   onedayclass_num: ${onedayclass_num} `);
  try {
    리액트로주는JSON.onedayclass_num = onedayclass_num;

    const date = new Date();
    const serverYear = date.getFullYear();
    const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
    const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
    const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

    //좆까
    executequery = await con.query(getBannerPayMentInfo, [
      onedayclass_num,
      currentServerDate,
      currentServerDate,
    ]);
    const rows = executequery[0];
    returnRow = rows.length > 0 ? rows[0] : null;

    executeOnedayquery = await con.query(
      getOnedayClassInfo + searchOnedayClass.default,
      [onedayclass_num]
    );
    const onedayrows = executeOnedayquery[0];

    returnOnedayRow = onedayrows.length > 0 ? onedayrows[0] : null;
    리액트로주는JSON.bannerInfo = returnRow;
    리액트로주는JSON.onedayInfo = returnOnedayRow;
  } catch (err) {
    console.log(err);
  } finally {
    console.log(리액트로주는JSON);
    return 리액트로주는JSON;
  }
};

module.exports.getMyBusinessStatusListModel = async (req, res) => {
  let tid = req.session.userid;
  let { business_status } = req.body;
  let con = await mariadbpool.pool2.getConnection();
  let sql;
  let executequery;
  let returnRow;
  let returnRowCnt = 0;
  let 리액트로주는JSON = new Object();

  // console.log(`검색조건  tid: ${tid}   business_status:${business_status} `);
  try {
    executequery = await con.query(
      TeacherBusinessList + SearchKeywordBusinessList.DefaultSearch,
      [tid, business_status]
    );

    returnRow = executequery[0];
    returnRowCnt = (Array.isArray(returnRow) && returnRow.length) || 0;
  } catch (err) {
    console.log(err);
  } finally {
    리액트로주는JSON.MyBusinessList = returnRow;
    리액트로주는JSON.MyBusinessListCnt = returnRowCnt;
    console.log(tid);
    return 리액트로주는JSON;
  }
};

module.exports.newCreateOnedayModel = async (req, res) => {
  let con = await mariadbpool.pool2.getConnection();

  let { userid } = req.session;
  let 리액트로주는JSON = {};
  let 인증받은원데이클래스배열 = [];
  let returnRow;
  try {
    returnRow = await con.query(getTeacherOnedayClassNumList, [userid]);
    const onedayClassNum = returnRow[0];
    for (let k = 0; k < onedayClassNum.length; k++) {
      let 인증받은원데이클래스단건정보 = await findNoRecoredOnedayClass(
        con,
        onedayClassNum[k].onedayclass_num,
        userid
      );

      if (
        인증받은원데이클래스단건정보 === null ||
        인증받은원데이클래스단건정보 === undefined
      ) {
        let confirmOnedayNum = await checkBusinessStatus(
          con,
          onedayClassNum[k].onedayclass_num,
          userid
        );
        console.log(
          `인증은 떨어지고, 삽입한적 없는 원데이클래스번호 ${confirmOnedayNum}`
        );

        if (confirmOnedayNum != undefined) {
          인증받은원데이클래스배열.push(onedayClassNum[k]);
        }
      }
    }

    리액트로주는JSON.newOnedayNumList = 인증받은원데이클래스배열;
    리액트로주는JSON.newOnedayNumListCnt = 인증받은원데이클래스배열.length;
  } catch (err) {
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};

const findNoRecoredOnedayClass = async (con, onedayclass_num, userid) => {
  let executequery;
  let returnRow;

  console.log(`userid: ${userid}     onedayclass_num: ${onedayclass_num} `);

  try {
    executequery = await con.query(alreadyOnedayClassInfoCheck, [
      userid,
      onedayclass_num,
    ]);

    returnRow = executequery[0][0].onedayclass_num;

    console.log(`returnRow: ${returnRow}`);
  } catch (err) {
    console.log(err);
  } finally {
    return returnRow;
  }
};

const checkBusinessStatus = async (con, onedayclass_num, userid) => {
  let executequery;
  let returnRow;
  let business_status = "confirm";
  try {
    executequery = await con.query(checkBusiness_status, [
      userid,
      onedayclass_num,
      business_status,
    ]);

    returnRow = executequery[0][0]?.onedayclass_num;
  } catch (err) {
    console.log(err);
  } finally {
    return returnRow;
  }
};

module.exports.getOneDayClassInfoModel = async (req, res) => {
  let { onedayclass_numList } = req.body;

  let con = await mariadbpool.pool2.getConnection();

  let 리액트로주는JSON = {};
  let 인증받은원데이클래스배열 = [];
  for (let k = 0; k < onedayclass_numList.length; k++) {
    let 인증받은원데이클래스단건정보 =
      await 인증받은원데이클래스정보단건가져오기(con, onedayclass_numList[k]);

    // 즉 원데이클래스번호는 발급받고 사업자인증을 하였으나 아직 원데이클래스정보는 삽입한적이 없는경우
    if (인증받은원데이클래스단건정보 != undefined) {
      인증받은원데이클래스배열.push(인증받은원데이클래스단건정보);
    }
  }

  리액트로주는JSON.onedayClassListInfo = 인증받은원데이클래스배열;
  리액트로주는JSON.onedayClassListCnt = onedayclass_numList.length;

  return 리액트로주는JSON;
};

module.exports.checkPaymentForBanneModel = async (req, res) => {
  let { onedayclass_num } = req.body;

  let con = await mariadbpool.pool2.getConnection();

  let executequery;
  let 리액트로주는JSON = {};

  리액트로주는JSON.paymentStatus = 1;

  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

  try {
    executequery = await con.query(checkPaymentForBanne, [
      onedayclass_num,
      currentServerDate,
      currentServerDate,
    ]);
    let bannerpayinfo_num = executequery[0][0]?.bannerpayinfo_num;
    if (bannerpayinfo_num === undefined) {
      리액트로주는JSON.paymentStatus = -1;
    }
  } catch (err) {
    console.log(err);
  } finally {
  }

  return 리액트로주는JSON;
};

const 인증받은원데이클래스정보단건가져오기 = async (con, onedayclass_num) => {
  let sql;
  let executequery;
  let returnRow;
  let returnRowCnt = 0;
  console.log(`단건 원데이번호: ${onedayclass_num}`);
  try {
    executequery = await con.query(
      getOnedayClassInfo + searchOnedayClass.default,
      [onedayclass_num]
    );

    returnRow = executequery[0][0];

    console.log(returnRow);
  } catch (err) {
    console.log(err);
  } finally {
    return returnRow;
  }
};

module.exports.원데이클래스번호리스트 = async (req, res) => {
  let tid = req.session.userid;
  let con = await mariadbpool.pool2.getConnection();
  let sql;
  let executequery;
  let 리액트로주는JSON = new Object();

  //사업자 인증만하고 원데이 클래스번호만 발급받고, 원데이클래스 테이블에 삽입하지 않은
  // teacher 의 원데이클래스번호만 가져온다.
  sql =
    "select	* from 	teacher as t right join  onedayclass as o on	t.onedayclass_num = o.onedayclass_num  where t.tid=?	";
  let returnRow = await con.query(sql, [tid]);

  리액트로주는JSON.getList = returnRow[0];
  return 리액트로주는JSON;
};

module.exports.toteacherconfirmModel = async (req, res) => {
  let { tid } = req.body;
  let con;
  let slq = `insert into teacher () `;

  sql =
    'update teacher set confirm = "yes"  where tid=? and rules="인증된사업자"';
  let 원데이클래스번호알밖기쿼리문 = " select * from teacher  where tid=? ";
  let executequery;
  let 반영여부;

  let 리액트로주는JSON = new Object();
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(sql, [tid]);
    반영여부 = executequery[0].affectedRows;

    console.log(반영여부);

    if (반영여부 == 0) {
      리액트로주는JSON.updatestatuscode = -1;
    } else {
      executequery = await con.query(원데이클래스번호알밖기쿼리문, [tid]);
      let 원데이클래스번호 = executequery[0][0].onedayclass_num;
      리액트로주는JSON.onedayclass_num = 원데이클래스번호;
      리액트로주는JSON.updatestatuscode = 1;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};
module.exports.getOpenningClassListModel = async (req, res) => {
  let { onedayclass_num, openningday } = req.body;
  let tid = req.session.userid;
  let con;

  console.log(
    `검색조건 : ${tid}  onedayclass_num:${onedayclass_num}  openningday:${openningday}`
  );
  let sql =
    "SELECT *  FROM openningclass AS o   WHERE o.tid = ?  and o.onedayclass_num=?  AND o.openningday LIKE" +
    " '%" +
    `${openningday}` +
    "%'" +
    " ORDER BY o.openningday ASC";

  let 리액트로주는JSON = new Object();
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(sql, [tid, onedayclass_num]);

    if (executequery[0].length === 0) {
      리액트로주는JSON.currentMontOpenList = undefined;
    } else {
      리액트로주는JSON.currentMontOpenList = executequery[0];
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

//까
module.exports.getBannerListModel = async (req, res) => {
  let con;

  let 리액트로주는JSON = {};
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(getBannerInfoList);

    if (executequery[0].length === 0) {
      리액트로주는JSON.currentMontOpenList = undefined;
    } else {
      리액트로주는JSON.getBannerInfoList = executequery[0];
      리액트로주는JSON.getBannerInfoListCnt = executequery[0].length;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.isFirstBannaerModel = async (req, res) => {
  let con;
  let { onedayclass_num } = req.body;
  let returnRow;
  let 리액트로주는JSON = {};
  리액트로주는JSON.isFirstBannaer = 1;

  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(isFirstCheckBanner, [onedayclass_num]);
    returnRow = executequery[0];
    // console.log(`최초결재?:  ${returnRow[0]?.onedayclass_num}`);
    if (returnRow[0]?.onedayclass_num != undefined) {
      리액트로주는JSON.isFirstBannaer = -1;

      const date = new Date();
      const serverYear = date.getFullYear();
      const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
      const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
      const currentServerDate =
        serverYear + "-" + serverMonth + "-" + serverDay;

      executequery = await con.query(activeList, [onedayclass_num]);

      let activitingList = executequery[0];
      //returnRow = executequery[0];

      for (let i = 0; i < activitingList.length; i++) {
        let stDate = formYyyyMmDd(activitingList[i].banner_stdate);
        let edDate = formYyyyMmDd(activitingList[i].banner_eddate);

        console.log(`stDate: ${stDate}   edDate:${edDate} `);

        console.log(
          `사이값: ${
            currentServerDate >= stDate && currentServerDate <= edDate
          }`
        );
        if (currentServerDate >= stDate && currentServerDate <= edDate) {
          activitingList[i].expire_status = "active";
          continue;
        }
        console.log(
          `미래값: ${
            currentServerDate <= stDate && currentServerDate <= edDate
          }`
        );
        if (currentServerDate <= stDate && currentServerDate <= edDate) {
          activitingList[i].expire_status = "future";
          continue;
        }

        if (currentServerDate > stDate && currentServerDate > edDate) {
          activitingList[i].expire_status = "expired";
          continue;
        }
      }

      리액트로주는JSON.activeAndExpiredList = activitingList;
      리액트로주는JSON.activeAndExpiredCnt = activitingList.length;
    } else {
      리액트로주는JSON.activeAndExpiredList = [];
      리액트로주는JSON.activeAndExpiredCnt = 0;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.payForBannerModel = async (req, res) => {
  let con;
  let returnRow;
  let 리액트로주는JSON = {};
  리액트로주는JSON.payStatusCode = 1;
  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();
    returnRow = executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T1
    );
    let count = returnRow[0][0].count;

    if (count === 0) {
      리액트로주는JSON = await payForBannerModelDefaultTransatcion(
        con,
        req.body
      );
    } else {
      리액트로주는JSON = await payForBannerModelTransatcion(con, req.body);
    }
  } catch (err) {
  } finally {
    return 리액트로주는JSON;
  }
};
//좆
const payForBannerModelDefaultTransatcion = async (con, param) => {
  let {
    banner_eddate,
    banner_stdate,
    onedayclass_num,
    update_banner_plan,
    uc_bannertype,
    total_price,
  } = param;

  let executequery;
  let returnRow;
  let 리액트로주는JSON = {};
  리액트로주는JSON.payStatusCode = 1;

  try {
    let uc_bannerinfo_num;

    //DB자체에 데이터를 최초삽입 하는경우
    returnRow = executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T2
    );
    let bannerpayinfo_num = returnRow[0][0].bannerpayinfo_num;

    returnRow = executequery = await con.query(
      TeacherPayForBannerSubTransaction.SubT2,
      [uc_bannertype]
    );

    uc_bannerinfo_num = returnRow[0][0].uc_bannerinfo_num;

    returnRow = executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T3,
      [
        bannerpayinfo_num,
        banner_stdate,
        banner_eddate,
        onedayclass_num,
        uc_bannerinfo_num,
      ]
    );

    let retry_banner_pay_num = bannerpayinfo_num;

    returnRow = executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T4,
      [retry_banner_pay_num, bannerpayinfo_num, update_banner_plan]
    );

    let income_price = total_price;
    let promotion_status = "active";
    let promotion_start_date = banner_stdate;
    let promotion_end_date = banner_eddate;

    const date = new Date();
    const serverYear = date.getFullYear();
    const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
    const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
    const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

    let application_paid_at = currentServerDate;
    let promotion_income_num;
    returnRow = executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T5
    );

    promotion_income_num = returnRow[0][0].promotion_income_num;

    executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T6,
      [
        promotion_income_num,
        income_price,
        promotion_status,
        promotion_start_date,
        promotion_end_date,
        application_paid_at,
        onedayclass_num,
      ]
    );

    let promotion_confirm_status = "yes";
    let promotion_cost_num = promotion_income_num;
    executequery = await con.query(
      TeacherPayForBannerDefaultTransactionValue.T7,
      [promotion_cost_num, promotion_income_num, promotion_confirm_status]
    );
  } catch (err) {
    console.log(err);
    리액트로주는JSON.payStatusCode = -1;
    await con.rollback();
  } finally {
    await con.commit();

    return 리액트로주는JSON;
  }
};

const payForBannerModelTransatcion = async (con, param) => {
  let {
    banner_eddate,
    banner_stdate,
    onedayclass_num,
    update_banner_plan,
    uc_bannertype,
    total_price,
  } = param;

  let executequery;
  let returnRow;

  let 리액트로주는JSON = {};
  리액트로주는JSON.payStatusCode = 1;

  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();

    let uc_bannerinfo_num;

    // 최초결제라면 0 아니라면 그에대응되는 값의+1
    returnRow = executequery = await con.query(
      TeacherPayForBannerSubTransaction.SubT1,
      [onedayclass_num]
    );

    let bannerpayinfo_num;
    let retry_banner_pay_num;
    bannerpayinfo_num = returnRow[0][0].bannerpayinfo_num;
    console.log(`bannerpayinfo_num: ${bannerpayinfo_num}`);
    // 해당 원데이클래스 번호의 선생님의 최초 결제이다.
    if (bannerpayinfo_num === 0) {
      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT12
      );

      bannerpayinfo_num = returnRow[0][0].bannerpayinfo_num;

      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT3
      );

      retry_banner_pay_num = returnRow[0][0].retry_banner_pay_num;
    } else {
      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT12
      );

      bannerpayinfo_num = returnRow[0][0].bannerpayinfo_num;

      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT3
      );

      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT4,
        [onedayclass_num]
      );
      retry_banner_pay_num = returnRow[0][0].retry_banner_pay_num;
    }
    // 최신 이력 번호를가져온다.
    returnRow = executequery = await con.query(
      TeacherPayForBannerSubTransaction.SubT2,
      [uc_bannertype]
    );

    uc_bannerinfo_num = returnRow[0][0].uc_bannerinfo_num;

    executequery = await con.query(
      TeacherPayForBannerTransaction.insertBannerpayinfo,
      [
        bannerpayinfo_num,
        banner_stdate,
        banner_eddate,
        onedayclass_num,
        uc_bannerinfo_num,
      ]
    );

    executequery = await con.query(
      TeacherPayForBannerTransaction.insertRetryBannerpayinfo,
      [retry_banner_pay_num, bannerpayinfo_num, update_banner_plan]
    );

    let income_price = total_price;
    let promotion_status = "active";
    let promotion_start_date = banner_stdate;
    let promotion_end_date = banner_eddate;

    const date = new Date();
    const serverYear = date.getFullYear();
    const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
    const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
    const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

    let application_paid_at = currentServerDate;

    returnRow = executequery = await con.query(
      TeacherPayForBannerSubTransaction.SubT5,
      [onedayclass_num]
    );

    let promotion_income_num = returnRow[0][0].promotion_income_num;
    // console.log(`promotion_income_num:  ${promotion_income_num}`);
    if (promotion_income_num === 0) {
      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT6
      );
      promotion_income_num = returnRow[0][0].promotion_income_num;
    }
    returnRow = executequery = await con.query(
      TeacherPayForBannerSubTransaction.SubT6
    );
    promotion_income_num = returnRow[0][0].promotion_income_num;
    executequery = await con.query(
      TeacherPayForBannerTransaction.insertpromotion_income,
      [
        promotion_income_num,
        income_price,
        promotion_status,
        promotion_start_date,
        promotion_end_date,
        application_paid_at,
        onedayclass_num,
      ]
    );

    let promotion_confirm_status = "yes";

    let promotion_cost_num;
    returnRow = executequery = await con.query(
      TeacherPayForBannerSubTransaction.SubT7,
      [promotion_income_num]
    );
    promotion_cost_num = returnRow[0][0].promotion_cost_num;

    if (promotion_cost_num === 0) {
      returnRow = executequery = await con.query(
        TeacherPayForBannerSubTransaction.SubT8
      );
      promotion_cost_num = returnRow[0][0].promotion_cost_num;
    }
    console.log(`promotion_cost_num:  ${promotion_cost_num}`);

    executequery = await con.query(
      TeacherPayForBannerTransaction.insertpromotion_confirm,
      [promotion_cost_num, promotion_income_num, promotion_confirm_status]
    );
  } catch (err) {
    console.log(err);
    리액트로주는JSON.payStatusCode = -1;
    await con.rollback();
  } finally {
    await con.commit();

    return 리액트로주는JSON;
  }
};

module.exports.getRestCountModel = async (req, res) => {
  let { openningclass_num } = req.body;
  let con;
  let sql = "select reserverest from reserverest where openningclass_num=?";

  console.log(`openningclass_num: ${openningclass_num} `);
  let 리액트로주는JSON = new Object();
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(sql, [openningclass_num]);

    if (executequery[0].length === 0) {
      리액트로주는JSON.reserveCount = undefined;
    } else {
      리액트로주는JSON.reserveCount = executequery[0][0].reserverest;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

//시간끌기 테스트용임 필요할때 호출해서 쓴다.
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
module.exports.insertOpenningclassModel = async (req, res) => {
  let { openningday, onedayclass_num, rest } = req.body;
  let tid = req.session.userid;

  let con;
  let returnRow;
  let affectedRowsNum;
  let affectedRows;
  let sql;

  let 리액트로주는JSON = {};
  try {
    con = await mariadbpool.pool2.getConnection();
    // 트랜잭션 시작

    await con.beginTransaction(); // 트랜잭션 시작

    const getXRolck = await con.query(
      TeacherInsertOpenningTransaction.getOpenTableXlock,
      [onedayclass_num, openningday]
    );

    //시간끌기용 함수 테스트시 필요하다면 주석 해제 하라.
    // await sleep(100000);

    // 그다음 getOpenningclass_num 을 발급받는다.
    returnRow = await con.query(
      TeacherInsertOpenningTransaction.getOpenningclass_num
    );

    const openningclass_num = returnRow[0][0].openningclass_num;

    affectedRowsNum = await con.query(
      TeacherInsertOpenningTransaction.InsertOpenn,
      [tid, onedayclass_num, openningday, openningclass_num]
    );
    affectedRows = affectedRowsNum[0].affectedRows;
    if (affectedRows <= 0) {
      throw new Error("openningclass Table insertion failed"); // 실패 시 에러 던지기
    }

    returnRow = await con.query(
      TeacherInsertOpenningTransaction.getReserverest
    );

    const reserverest = returnRow[0][0].reserverest;

    const openday = openningday;

    affectedRowsNum = await con.query(
      TeacherInsertOpenningTransaction.insertReserveRest,
      [reserverest, onedayclass_num, openday, rest, openningclass_num]
    );

    affectedRows = affectedRowsNum[0].affectedRows;
    if (affectedRows <= 0) {
      throw new Error("reserverestTable insertion failed"); // 실패 시 에러 던지기
    }

    await con.commit(); // 성공 시 트랜잭션 커밋
    리액트로주는JSON.OpenStatusCode = 1;
  } catch (err) {
    // 롤벡을 처리하라
    await con.rollback();
    console.log(err);
    리액트로주는JSON.OpenStatusCode = -1;
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};

module.exports.showmanagerinfoModel = async (req, res) => {
  //console.log(req.session)

  let tid = req.session.tid;
  let { openningday } = req.body;

  let 공백자름 = openningday.split(" ");

  let 년 = 공백자름[0].replace("년", "-").trim();

  let 월 = 공백자름[1].replace("월", "-");

  if (월.length == 2) {
    월 = "0" + 공백자름[1].replace("월", "-");
  }
  let 일 = 공백자름[2].replace("일", "");

  if (일.length == 1) {
    일 = "0" + 공백자름[2].replace("일", "");
  }

  let DB를위한형식 = 년 + 월 + 일;

  // console.log("공벡으로 자르기",진짜DB향식 )

  // console.log("tid openningday", tid, openningday);

  // let DB를위한형식 = openningday.replace("년 ", "-").trim();
  // DB를위한형식 = DB를위한형식.replace("월 ", "-").trim();
  // DB를위한형식 = DB를위한형식.replace("일", "").trim();

  console.log(`DB를위한형식: ${DB를위한형식}`);

  let con;

  let 선택한날짜수업정보쿼리문 =
    "SELECT * FROM openningclass WHERE openningday LIKE" +
    " '%" +
    `${DB를위한형식}` +
    "%" +
    "'" +
    " AND  tid=?";

  let executequery;
  let 해당날짜의수업개설여부;

  let 리액트로주는JSON = new Object();
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(선택한날짜수업정보쿼리문, [tid]);
    해당날짜의수업개설여부 = executequery[0];

    console.log(해당날짜의수업개설여부);

    if (해당날짜의수업개설여부.length == 0) {
      리액트로주는JSON.openningstatuscode = -1;
    } else {
      리액트로주는JSON.openningstatuscode = 1;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.activitingOnedayNumListModel = async (req, res) => {
  let tid = req.session.userid;
  let con;
  let executequery;
  let 해당날짜의수업개설여부;
  let selectList;
  let 리액트로주는JSON = {};

  let 상품등록가능한원데이클래스배열 = [];

  try {
    con = await mariadbpool.pool2.getConnection();
    [selectList] = await con.query(selectListOnedayNum, [tid]);

    let onedayNumSize = selectList.length;
    for (let i = 0; i < onedayNumSize; i++) {
      let onedayclass_num = selectList[i].onedayclass_num;
      let possibleOnedayclass_num = await Lemma1TOactivitingOnedayNumListModel(
        con,
        onedayclass_num
      );
      if (possibleOnedayclass_num != undefined) {
        // if (
        //   await Lemma2TOactivitingOnedayNumListModel(
        //     con,
        //     possibleOnedayclass_num
        //   )
        // ) {
        //   let obj = {
        //     possibleOnedayclass_num: possibleOnedayclass_num,
        //     onedayclass_name: await Lemma3TOactivitingOnedayNumListModel(
        //       con,
        //       possibleOnedayclass_num
        //     ),
        //   };

        //   상품등록가능한원데이클래스배열.push(obj);
        // }
        let obj = {
          possibleOnedayclass_num: possibleOnedayclass_num,
          onedayclass_name: await Lemma3TOactivitingOnedayNumListModel(
            con,
            possibleOnedayclass_num
          ),
        };

        상품등록가능한원데이클래스배열.push(obj);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    if (상품등록가능한원데이클래스배열.length === 0) {
      상품등록가능한원데이클래스배열 = [];
    }

    리액트로주는JSON.possibleOnedayclass_numAndName =
      상품등록가능한원데이클래스배열;

    return 리액트로주는JSON;
  }
};

module.exports.getMyPolicyListModel = async (req, res) => {
  let { onedayclass_num } = req.body;
  let con;
  let selectOne;
  let myPolicy;
  let 리액트로주는JSON = {};

  try {
    con = await mariadbpool.pool2.getConnection();
    [selectOne] = await con.query(selectOneMyPolicy, [onedayclass_num]);

    myPolicy = selectOne[0];
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    리액트로주는JSON.myPolicy = myPolicy;

    return 리액트로주는JSON;
  }
};

module.exports.getMyPolicyModel = async (req, res) => {
  let { onedayclass_num } = req.body;
  let con;
  let selectOne;
  let myPolicy;
  let 리액트로주는JSON = {};

  try {
    con = await mariadbpool.pool2.getConnection();
    [selectOne] = await con.query(selectOneMyPolicy, [onedayclass_num]);

    myPolicy = selectOne[0];
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    리액트로주는JSON.myPolicy = myPolicy;

    return 리액트로주는JSON;
  }
};

module.exports.updateMyPolicyModel = async (req, res) => {
  let {
    onedayclass_num,
    product_cate,
    ordecount_policy,

    // 이하는 환불 규정 변수
    quantity_policy,
    product_policy_num,
    possible_refunday,
    possible_refund_message,
    refund_option,
    refund_impossible_cuz,
  } = req.body;
  let con;
  let selectOne;
  let XLock;
  let myPolicy;
  let affectedRow;
  let 리액트로주는JSON = {};
  리액트로주는JSON.updateCode = 1;
  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();

    XLock = await con.query(updatePolicyTransaction.getProduct_policyXLock, [
      onedayclass_num,
    ]);

    affectedRow = await con.query(updatePolicyTransaction.updatePolicy, [
      ordecount_policy,
      product_cate,
      quantity_policy,
      onedayclass_num,
    ]);

    if (affectedRow[0].affectedRows <= 0) {
      리액트로주는JSON.updateCode = -1;
    }

    affectedRow = await con.query(updatePolicyTransaction.updateRefundPolicy, [
      possible_refunday,
      possible_refund_message,
      refund_option,
      refund_impossible_cuz,
      product_policy_num,
    ]);

    if (affectedRow[0].affectedRows <= 0) {
      리액트로주는JSON.updateCode = -1;
    }
  } catch (err) {
    console.log(err);
    await con.rollback();
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.inserNewMyPolicyModel = async (req, res) => {
  let {
    onedayclass_num,
    product_cate,
    ordecount_policy,
    quantity_policy,
    possible_refunday,
    possible_refund_message,
    refund_option,
    refund_impossible_cuz,
  } = req.body;
  let con;
  let selectOne;
  let newProduct_policy_num;
  let 리액트로주는JSON = {};
  리액트로주는JSON.insertStatusCode = 1;
  let count;
  try {
    con = await mariadbpool.pool2.getConnection();

    [count] = await con.query(insertNewPolicyTransaction.emptyCheck);

    [selectOne] = await con.query(insertNewPolicyTransaction.getNewPolicyNum, [
      onedayclass_num,
    ]);

    console.log(`총행수: ${count[0].count}`);

    newProduct_policy_num = selectOne[0]?.product_policy_num;

    if (newProduct_policy_num != undefined) {
      throw new Error("duplic");
    }

    if (count[0].count === 0) {
      newProduct_policy_num = 1;
    }

    if (count != 0 && newProduct_policy_num === undefined) {
      [selectOne] = await con.query(
        insertNewPolicyTransaction.getCurrentMaxPolicyNum,
        [onedayclass_num]
      );

      console.log("현재의 최대값:  " + selectOne[0]?.product_policy_num);

      newProduct_policy_num =
        parseInt(selectOne[0]?.product_policy_num) + parseInt(1);

      console.log(
        `새로 발급 판매정책고유번호 : ${selectOne[0]?.product_policy_num}`
      );
      console.log(`새로 발급 판매정책고유번호+1 : ${newProduct_policy_num}`);
    }

    await con.query(insertNewPolicyTransaction.insertNewPolicy, [
      newProduct_policy_num,
      onedayclass_num,
      ordecount_policy,
      quantity_policy,
      product_cate,
    ]);

    await con.query(insertNewPolicyTransaction.inssertRefundPolicyDetail, [
      newProduct_policy_num,
      possible_refunday,
      possible_refund_message,
      refund_option,
      refund_impossible_cuz,
    ]);
  } catch (err) {
    console.log(err);
    await con.rollback();
    리액트로주는JSON.insertStatusCode = -1;
    if (err.message === "duplic") {
      리액트로주는JSON.insertStatusCode = -100;
    }
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

// 배너가 A100 인 것에 한한 원데이클래스 번호를 리턴한다.
const Lemma1TOactivitingOnedayNumListModel = async (con, onedayclass_num) => {
  const currentServerDate = currentDateFormYyyyMmDd();

  let [selectOne] = await con.query(checkOutActivitingBanner, [
    currentServerDate,
    currentServerDate,
    onedayclass_num,
  ]);

  if (selectOne[0]?.uc_bannertype === undefined) {
    return undefined;
  }

  if (selectOne[0]?.uc_bannertype != "A100") {
    return undefined;
  }

  return onedayclass_num;
};

// 해당 원데이클래스 번호에 관한  판매 정책 테이블이 최초 삽이인지 가져온다.
const Lemma2TOactivitingOnedayNumListModel = async (
  con,
  possibleOnedayclass_num
) => {
  let [selectOne] = await con.query(checkoutNewProduct, [
    possibleOnedayclass_num,
  ]);

  // console.log('최초삽입 원데이클래스 번호라면 언디파인'+selectOne[0]?.onedayclass_num);
  if (selectOne[0]?.onedayclass_num === undefined) {
    return true;
  }

  return false;
};

// 상품테이블에 해당 원데이클래스 번호로 최초 삽입 이라면  undefined 이여야  하는것을 리턴한다.
const Lemma3TOactivitingOnedayNumListModel = async (
  con,
  possibleOnedayclass_num
) => {
  let [selectOne] = await con.query(
    `${getOnedayClassInfo + searchOnedayClass.default}`,
    [possibleOnedayclass_num]
  );

  let onedayclass_name = selectOne[0].onedayclass_name;

  return onedayclass_name;
};

module.exports.getPolicyLisModel = async (req, res) => {
  let con;
  let selectList;
  let tid = req.session.userid;
  let 리액트로주는JSON = {};

  try {
    con = await mariadbpool.pool2.getConnection();

    [selectList] = await con.query(selectListMyPolicy, [tid]);
    리액트로주는JSON.myPolicyInfo = selectList;
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.inserNewProductInfoModel = async (req, res) => {
  let {
    product_name,
    product_price,
    product_mainImage,
    product_policy_num,
    show_status,
    Base64ImgArray,
    Base64ImgNameArray,
    product_intro,
  } = req.body;

  let con;
  let count;
  let selectList;
  let selectOne;
  let 리액트로주는JSON = {};
  product_mainImage = Base64ImgArray[0];
  리액트로주는JSON.insertStatusCode = 1;
  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();
    await con.query(insertNewProductTransaction.insertProductInfo, [
      product_name,
      product_price,
      product_mainImage,
      product_policy_num,
      show_status,
      product_intro
    ]);

    let product_num;
    [selectOne] = await con.query(
      insertNewProductTransaction.selectOneProductNum,
      [product_policy_num]
    );

    product_num = selectOne[0].product_num;
    await insertImageFnc(con, product_num, Base64ImgArray, Base64ImgNameArray);

    [selectOne] = await con.query(
      insertNewProductTransaction.insertUpdateRecordProductInfo,
      [product_num, product_name, product_price, product_mainImage, show_status,product_intro]
    );
  } catch (err) {
    console.log(err);
    리액트로주는JSON.insertStatusCode = -1;
    await con.rollback();
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.updateProductInfoModel = async (req, res) => {
  let {
    product_num,
    product_name,
    product_price,
    product_mainImage,
    product_policy_num,
    show_status,
    Base64ImgArray,
    Base64ImgNameArray,
  } = req.body;

  let con;
  let count;
  let selectList;
  let selectOne;
  let 리액트로주는JSON = {};
  product_mainImage = Base64ImgArray[0];

  리액트로주는JSON.insertStatusCode = 1;

  console.log(
    `product_name: ${product_name} product_price: ${product_price} product_policy_num:${product_policy_num} show_status: ${show_status} product_num: ${product_num}`
  );

  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();
    await con.query(updateProductTransaction.upDateProductInfo, [
      product_name,
      product_price,
      product_mainImage,
      show_status,
      product_num,
    ]);

    [selectOne] = await con.query(
      updateProductTransaction.selectOneProductImage_num,
      [product_num]
    );

    let MinProductImage_num = selectOne[0].productImage_num;

    await updateImageFnc(
      con,
      MinProductImage_num,
      product_num,
      Base64ImgArray,
      Base64ImgNameArray
    );

    [selectOne] = await con.query(
      updateProductTransaction.insertUpdateRecordProductInfo,
      [product_num, product_name, product_price, product_mainImage, show_status]
    );
  } catch (err) {
    console.log(err);
    리액트로주는JSON.insertStatusCode = -1;
    await con.rollback();
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.getMyProductListModel = async (req, res) => {
  let { product_policy_num } = req.body;

  let con;

  let selectList;

  let 리액트로주는JSON = {};

  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();
    [selectList] = await con.query(selectListMyProduct, [product_policy_num]);

    리액트로주는JSON.myProductList = selectList;
    리액트로주는JSON.myProductCnt = selectList.length;
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.getMyProductImageModel = async (req, res) => {
  let { product_num } = req.body;

  let con;

  let selectList;

  let 리액트로주는JSON = {};

  try {
    con = await mariadbpool.pool2.getConnection();
    await con.beginTransaction();
    [selectList] = await con.query(selectListMyImage, [product_num]);

    const result = selectList.map((row) => ({
      image_name: row.image_name,
      Image_file: row.Image_file.toString(), // 문자열로 변환만 해주면 React에서 바로 사용 가능
    }));

    리액트로주는JSON.myProductImageList = result;
    리액트로주는JSON.myProductImageCnt = result.length;
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

const insertImageFnc = async (
  con,
  product_num,
  Base64ImgArray,
  Base64ImgNameArray
) => {
  try {
    for (let k = 0; k < Base64ImgArray.length; k++) {
      await con.query(insertNewProductTransaction.insertImageInfo, [
        product_num,
        Base64ImgArray[k],
        Base64ImgNameArray[k],
      ]);
    }
  } catch (err) {
    console.log(err);
    throw new Error("image Table insertion failed");
  }
};

const updateImageFnc = async (
  con,
  MinProductImage_num,
  product_num,
  Base64ImgArray,
  Base64ImgNameArray
) => {
  try {
    for (let k = 0; k < Base64ImgArray.length; k++) {
      await con.query(updateProductTransaction.updateImageInfo, [
        Base64ImgArray[k],
        Base64ImgNameArray[k],
        product_num,
        MinProductImage_num,
      ]);
      MinProductImage_num++;
    }
  } catch (err) {
    console.log(err);
    throw new Error("image Table insertion failed");
  }
};

module.exports.goopnenclassModel = async (req, res) => {
  let tid = req.session.userid;
  let { openningday, onedayclass_num, classclose } = req.body;
  let isopenning = "yes";

  let 공백자름 = openningday.split(" ");

  let 년 = 공백자름[0].replace("년", "-").trim();

  let 월 = 공백자름[1].replace("월", "-");

  if (월.length == 2) {
    월 = "0" + 공백자름[1].replace("월", "-");
  }
  let 일 = 공백자름[2].replace("일", "");

  if (일.length == 1) {
    일 = "0" + 공백자름[2].replace("일", "");
  }

  let DB를위한형식 = 년 + 월 + 일;

  console.log("tid,isopenning,openningday:   ", tid, isopenning, openningday);

  let con;

  let 최초개강인지판단sql =
    "select * from  openningclass where tid=? and  openningday=?";
  let sql =
    "insert into openningclass (tid,onedayclass_num,openningday,isopenning) values (?,?,?,?)";

  let executequery;
  let 개강성공여부;

  let 리액트로주는JSON = new Object();
  try {
    con = await mariadbpool.pool2.getConnection();

    if (classclose == "close") {
      sql =
        "update openningclass set isopenning='no' where tid=? and  openningday=?";

      executequery = await con.query(sql, [tid, DB를위한형식]);
      개강성공여부 = executequery[0].affectedRows;
    } else {
      executequery = await con.query(최초개강인지판단sql, [tid, DB를위한형식]);
      let 최초개강이니 = executequery[0].length;

      console.log("최초개강이니:   ", 최초개강이니);

      if (최초개강이니 == 0) {
        executequery = await con.query(sql, [
          tid,
          onedayclass_num,
          DB를위한형식,
          "yes",
        ]);

        개강성공여부 = executequery[0].affectedRows;
      } else {
        sql =
          "update openningclass set isopenning='yes' where tid=? and  openningday=?";
        executequery = await con.query(sql, [tid, DB를위한형식]);
        개강성공여부 = executequery[0].affectedRows;
      }
    }
  } catch (err) {
    console.log(err);
    리액트로주는JSON.updatestatuscode = -1;
  } finally {
    con.release();
    리액트로주는JSON.updatestatuscode = 1;
    return 리액트로주는JSON;
  }
};

module.exports.getTheReservelistsModel = async (req, res) => {
  let tid = req.session.tid;
  let { openday } = req.body;
  let { onedayclass_num } = req.body;
  let con;

  let 선택날짜로뽑은예약리스트쿼리문 =
    "SELECT * FROM reserveinfo WHERE openday LIKE " +
    "'%" +
    `${openday}` +
    "%" +
    "'" +
    "AND onedayclass_num=?";

  console.log(`개강일: ${openday} 받은 원데이클래스 번호: ${onedayclass_num}`);

  let executequery;
  let 예약자리스트객체배열;
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(선택날짜로뽑은예약리스트쿼리문, [
      onedayclass_num,
    ]);
    // console.log(executequery);

    예약자리스트객체배열 = executequery[0];
  } catch (err) {
    console.log(err);
    con.release();
  } finally {
    con.release();

    return 예약자리스트객체배열;
  }
};

module.exports.getTheFullReservelistModel = async (req, res) => {
  let tid = req.session.tid;
  let { openningday } = req.body;

  let con;

  let onedayclass_num = req.session.onedayclass_num;

  // let 선택날짜로뽑은예약리스트쿼리문 = "SELECT * FROM reserveinfo WHERE  openday LIKE" + " '%" + `${openningday}` + "%" + "'" + ' AND  onedayclass_num=?';

  let 선택날짜로뽑은예약리스트쿼리문 =
    " SELECT * FROM openningclass AS op INNER JOIN reserverest AS re  ON op.openningclass_num=re.openningclass_num  INNER JOIN onedayclass AS O ON O.onedayclass_num=op.onedayclass_num" +
    " WHERE  openday LIKE" +
    " '%" +
    `${openningday}` +
    "%" +
    "'";
  console.log(
    "openningday: ",
    openningday,
    " tid: ",
    tid,
    "  onedayclass_num:  ",
    onedayclass_num
  );

  let executequery;
  let 예약자리스트객체배열;
  try {
    con = await mariadbpool.pool2.getConnection();
    executequery = await con.query(선택날짜로뽑은예약리스트쿼리문);

    예약자리스트객체배열 = executequery[0];
  } catch (err) {
    console.log(err);
    con.release();
  } finally {
    con.release();

    return 예약자리스트객체배열;
  }
};

module.exports.getRocoredOnedayclassNumModel = async (req, res) => {
  let tid = req.session.userid;

  let onedayClassNumList;
  let selectList;
  let 리액트로주는JSON = {};
  let con;
  try {
    con = await mariadbpool.pool2.getConnection();

    selectList = await con.query(getRocoredOnedayclassNum, [tid]);

    onedayClassNumList = selectList[0];
    onedayClassNumCnt = onedayClassNumList.length;
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    리액트로주는JSON.onedayClassNumList = onedayClassNumList;
    리액트로주는JSON.onedayClassNumCnt = onedayClassNumCnt;
    return 리액트로주는JSON;
  }
};

module.exports.getSelectOneOnecayClassInfoModel = async (req, res) => {
  let tid = req.session.userid;
  let { onedayclass_num } = req.body;

  console.log(`onedayclass_num: ${onedayclass_num}`);

  let selectOne;
  let 리액트로주는JSON = {};
  let con;
  try {
    con = await mariadbpool.pool2.getConnection();

    selectOne = await con.query(getSelectOneOnedayClassInfo, [
      tid,
      onedayclass_num,
    ]);

    selectOneonedayClassInfo = selectOne[0];
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    리액트로주는JSON.selectOneonedayClassInfo = selectOneonedayClassInfo;

    return 리액트로주는JSON;
  }
};

module.exports.getOneDayClassList = async (req, res) => {
  let tid = req.session.userid;
  console.log(`선생님아이디  ${tid}`);
  let 선생님이등록한원데이클래스리스트;
  let sql =
    "select * from onedayclass as o inner join teacher as t on o.onedayclass_num=t.onedayclass_num where t.tid=?";
  let con;

  try {
    con = await mariadbpool.pool2.getConnection();
    let returnRow = await con.query(sql, [tid]);
    선생님이등록한원데이클래스리스트 = returnRow[0];
  } catch (err) {
    console.log(err);
  } finally {
    return 선생님이등록한원데이클래스리스트;
  }
};

const currentDateFormYyyyMmDd = () => {
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;
  return currentServerDate;
};

const formYyyyMmDd = (formDateString) => {
  const date = new Date(formDateString);
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;
  return currentServerDate;
};
