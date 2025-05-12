const marialpool = require("../model/maria/mariadbpool");

const {
  selectListCurrentMontRest,
} = require("../SQL/AllTypeOnedayRestQuery/AllTypeOnedayRestQuery");

module.exports.openclassinfoModel = async (req, res) => {
  let onedayclass_num = req.body.onedayclass_num;

  // console.log(onedayclass_num);

  let sql = "select * from onedayclass where onedayclass_num=?";
  let executequery;

  try {
    const con = await marialpool.pool2.getConnection();
    executequery = await con.query(sql, onedayclass_num);
    let resultobj = executequery[0];
    // console.log("트라이문 씹힘??")
    // console.log(resultobj);

    return resultobj;
  } catch (err) {
    console.log(err);
  }
};

module.exports.OnedayclassRestModel = async (req, res) => {
  let { onedayclass_num, openday } = req.body;
  openday = `%${openday}%`;
  let executequery;
  let con;

  let 오늘의년월일 = currentDateFormYyyyMmDd();
  let 이번달의마지막년월일 = getLastDateOfThisMonthString();
  let 리액트로주는JSON = {};

  try {
    con = await marialpool.pool2.getConnection();
    await con.query(`SET innodb_lock_wait_timeout = 2`);
    await con.beginTransaction();
    executequery = await con.query(selectListCurrentMontRest, [
      onedayclass_num,
      openday,
      이번달의마지막년월일,
      오늘의년월일,
    ]);
    리액트로주는JSON.currentMonthOpenningList = executequery[0];
    리액트로주는JSON.currentMonthOpenningFullsize = executequery[0].length;
  } catch (err) {
    리액트로주는JSON.possibleMessage = -1;
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};

module.exports.justregisterOnedayclassinfoModel = async (req, res) => {
  let onedayclass_num = req.body.onedayclass_num;

  // console.log(onedayclass_num);

  let sql = "select * from onedayclass where onedayclass_num=?";
  let 이미지리스트쿼리 =
    "select reserve_img FROM  onedayclassimg WHERE onedayclass_num=?";
  let executequery;

  try {
    let obj = new Object();
    const con = await marialpool.pool2.getConnection();
    executequery = await con.query(sql, onedayclass_num);
    let resultobj = executequery[0];
    obj.classinfo = resultobj;
    executequery = await con.query(이미지리스트쿼리, onedayclass_num);
    let imglist = executequery[0];
    obj.imglist = imglist;

    // console.log("트라이문 씹힘??")
    // console.log(executequery[0]);

    return obj;
  } catch (err) {
    console.log(err);
  }
};

module.exports.IsMagamModel = async (req, res) => {
  // let onedayclass_num=req.query.onedayclass_num;
  // let openday=req.query.openday;

  let { onedayclass_num, openningday } = req.query;
  console.log(
    "클래스번호: " + onedayclass_num + " openningday: " + openningday
  );

  // let 공백자름 = openningday.split(' ');

  // let 년 = 공백자름[0].replace("년", "-").trim();

  // let 월 = 공백자름[1].replace("월", "-");

  // if (월.length == 2) {
  //     월 = "0" + 공백자름[1].replace("월", "-");
  // }
  // let 일=공백자름[2].replace("일", "");

  // if (일.length == 1) {
  //     일 = "0" + 공백자름[2].replace("일", "");

  // }

  // let DB를위한형식=년+월+일

  let sql =
    "select * from openningclass where onedayclass_num=? and openningday like '%" +
    `${openningday}` +
    "%'";
  let executequery;

  let obj = new Object();
  try {
    const con = await marialpool.pool2.getConnection();
    executequery = await con.query(sql, [onedayclass_num]);

    let 선생이개설자체를않함판단 = executequery[0].length;

    if (선생이개설자체를않함판단 == 0) {
      obj.statuscode = -1;
      obj.rest = 0;
    } else {
      let 개강했냐 = executequery[0][0].isopenning;

      if (개강했냐 == "yes") {
        let 남은자리수 = await getTheFuckRest(onedayclass_num, openningday);
        obj.satstuscode = 1;
        obj.rest = 남은자리수;
      } else {
        obj.statuscode = -1;
        obj.rest = 0;
      }

      return obj;
    }
  } catch (err) {
    console.log(err);
  }
};

async function getTheFuckRest(onedayclass_num, openningday) {
  let openday = openningday;

  console.log("클래스번호: " + onedayclass_num + " openday: " + openday);

  let sql =
    "select rest from reserverest where onedayclass_num=? and openday like '%" +
    `${openday}` +
    "%'";
  let executequery;

  try {
    const con = await marialpool.pool2.getConnection();
    executequery = await con.query(sql, onedayclass_num);
    let 남은자리수 = executequery[0][0].rest;

    return 남은자리수;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

module.exports.FindOutRestModel = async (req, res) => {
  // let onedayclass_num=req.query.onedayclass_num;
  // let openday=req.query.openday;

  let { onedayclass_num, openday } = req.query;
  console.log("클래스번호: " + onedayclass_num + " openday: " + openday);

  let sql =
    "select rest from reserverest where onedayclass_num=? and openday like '%" +
    `${openday}` +
    "%'";
  let executequery;

  try {
    const con = await marialpool.pool2.getConnection();
    executequery = await con.query(sql, onedayclass_num);
    let resultobj = executequery[0][0];

    return resultobj;
  } catch (err) {
    console.log(err);
    return -1;
  }
};
// 월 까지만
const currentDateFormYyyyMm = () => {
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12

  const currentServerDate = serverYear + "-" + serverMonth;
  return currentServerDate;
};

// 일 까지만
const currentDateFormYyyyMmDd = () => {
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;
  return currentServerDate;
};

// 해당 달의 마지막 년 월 일 을 리턴
function getLastDateOfThisMonthString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 현재 월 (1월이 0이니까 +1)

  const lastDay = new Date(year, month, 0);
  const yyyy = lastDay.getFullYear();
  const mm = String(lastDay.getMonth() + 1).padStart(2, "0");
  const dd = String(lastDay.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}
