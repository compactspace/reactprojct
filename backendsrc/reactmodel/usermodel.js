const marialpool = require("../model/maria/mariadbpool");

const ENV = require("dotenv").config();
const bcrypt = require("bcrypt");
const {
  onedayListType,
  activiingOnedayNumWithBusinessStatus,
  SelectOneActiviingOnedayNumWithBusinessStatus,
} = require("../SQL/AllTypeOnedayClassQuery/AllTypeOnedayClassQuery");

const {
  getFindUser,
  hasRoleTeacher,
  hasRoleMaster,
} = require("../SQL/LoginQuery/LoginQuery");

const {
  selectOneUnitProductInfo,
  selectListProductImage,
} = require("../SQL/AllTypeProductQuery/AllTypeProductQuery");

const {
  insertFirstAddCartTransaction,
  selectMyCartListTransaction,
  insertFirstAddCartSubTransaction,
  deleteEachCart,
  deleteAllCart,
} = require("../SQL/StudentCartQuery/StudentCartQuery");

const {
  PaymentTransaction,
  PaymentSubTransaction,
  selectListMyReceiptSearch,
} = require("../SQL/StudentPayQuery/StudentPayQuery");

const {
  SelectListMyReserve,
  MyReserveFullSize,
} = require("../SQL/StudentReserveQuery/StudentReserveQuery");

module.exports.NaverLoingModel = async (req, res, data) => {
  // console.log("모델 매핑 성공");
  // console.log(data)
  let checkId = data.response.id;
  let checkName = data.response.name;
  let checkMobile = data.response.mobile;
  let checkEmail = data.response.email;

  console.log(
    `네이버가 주는 고유 아이디 ${checkId} 이름은 ${checkName}  핸드폰은 ${checkMobile} 이메일은 ${checkEmail}`
  );

  const con = await marialpool.pool2.getConnection();
  let sql = "select * from user where id=?";
  let excutequery = await con.query(sql, [checkId]);
  // console.log("쿼리 실행결과")

  if (excutequery[0].length == 0 || excutequery[0][0].id == null) {
    console.log("if문 탐?");
    //rQE_RsS0i5F8jxIgoh88swhDV1UZerijF96octiN2aM
    sql = "insert into user (id ,user_tell,user_name,email) values(?,?,?,?)";

    try {
      //우선 저 query 속의 콜백함수가 없어도 되는데 인터넷엔 다들 적어서 적어는봄..
      excutequery = await con.query(
        sql,
        [checkId, checkMobile, checkName, checkEmail],
        (err, field) => {
          console.log(err);
          console.log(field);
        }
      );
      console.log("try 문 탐?");
      return true;
    } catch (error) {
      return false;
    }

    //세션은 ㅈㄴ 병신이라 jwt로 할것이라 그냥 주석처리함 무시 ㄱ
    // req.session.userid = checkId;
    // console.log(req.session)
    // req.session.save((err) => {

    //     res.send({cookie:req.session.userid});
    // })

    //else 문 즉 이미 기회원 인경우임
  } else {
    // console.log("엘스문 문 탐?")
    return false;
  }
};

module.exports.duplicidcheckModel = async (req, res) => {
  let { id } = req.body;

  // console.log("id->>",id)
  let sql = "select id from user where id=?";
  let con;
  let excutequery;
  let 아이디있나요;

  let obj = new Object();
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [id]);
    아이디있나요 = excutequery[0].length;

    // console.log("excutequery[0].length",excutequery[0].length)

    if (아이디있나요 == 0) {
      //  console.log("사용가능한 아이디")
      obj.dulicstatuscode = 1;
    } else {
      //   console.log("이미 있는 아이디")
      obj.dulicstatuscode = -1;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    return obj;
  }
};

module.exports.loginModel = async (req, res) => {
  let { id, password } = req.body;

  console.log("id: " + id + " password:  " + password);

  let con;
  let excutequery;

  let findUser;
  let 응답제이슨 = new Object();
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(getFindUser, [id]);
    findUser = excutequery[0][0];

    if (findUser === undefined) {
      응답제이슨.statuscode = -1;
    } else {
      //해쉬형테로 저장된 비번을 가져온다.
      let hashedpwd = findUser.password;
      // 그리고 변수로 받은 일반 비밀번호를 해쉬화 해서 비교하고 진위여부 리턴
      const pwdcheck = await bcrypt.compare(password, hashedpwd);

      if (pwdcheck) {
        let returnBusiness_Num = (excutequery = await con.query(
          hasRoleTeacher,
          [id]
        ));

        let business_num = returnBusiness_Num[0][0]?.business_num;

        if (business_num === undefined) {
          let findMaster;

          excutequery = await con.query(hasRoleMaster, [id]);

          findMaster = excutequery[0][0].count;

          if (findMaster != 0) {
            응답제이슨.role = "master";
          } else {
            응답제이슨.role = "student";
          }
        } else {
          응답제이슨.role = "teacher";
          응답제이슨.business_numArr = returnBusiness_Num[0];
        }

        응답제이슨.statuscode = 1;
        응답제이슨.id = findUser.id;
      } else {
        응답제이슨.statuscode = 0;
      }
    }
  } catch (err) {
    console.log(err);
    con.release();
  } finally {
    return 응답제이슨;
  }
};

module.exports.showmyinfoModel = async (req, res) => {
  let id = req.session.userid;

  // console.log("id: " + id);

  let con;
  let excutequery;
  let sql = "select * from user where id=?";

  let 응답제이슨 = new Object();
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [id]);
    유저정보 = excutequery[0][0];
    응답제이슨.myinfo = 유저정보;
  } catch (err) {
    console.log(err);
    con.release();
  } finally {
    return 응답제이슨;
  }
};

module.exports.changemyinfoModel = async (req, res) => {
  let { id, user_tell, user_name, email } = req.body;

  let sqlBuilderStr = [id, user_tell, user_name, email];

  let sqlColumnstr = ["id", "user_tell", "user_name", "email"];

  let builder = await sqlBuilder(sqlColumnstr, sqlBuilderStr);

  let 마지막콤마인덱스 = builder.indexOf(", and");
  // console.log("마지막콤마인덱스," ,마지막콤마인덱스)
  // update user set id='11' , email='e' where id='2';

  let updatesql = builder.substring(0, 마지막콤마인덱스) + "  where id=?";

  let sql = "update user set " + updatesql;

  let con;
  let obj;
  try {
    con = await marialpool.pool2.getConnection();

    let 웨어조건절의기존아이디 = req.session.userid;
    excutequery = await con.query(sql, [웨어조건절의기존아이디]);

    let affectedRows = excutequery[0].affectedRows;

    obj = new Object();
    if (affectedRows > 0) {
      obj.updatestatuscode = 1;

      if (id != undefined || id != null) {
        req.session.userid = id;
      }
    } else {
      obj.updatestatuscode = -1;
    }
  } catch (err) {
    console.log(err);
    con.rollback();
  } finally {
    con.release();
    return obj;
  }
};

async function sqlBuilder(sqlColumnstr, sqlBuilderStr) {
  let sqlstr = "";

  for (let i = 0; i < sqlBuilderStr.length; i++) {
    if (sqlBuilderStr[i] != undefined) {
      sqlstr = sqlstr + ` ${sqlColumnstr[i]}= '${sqlBuilderStr[i]}' ,`;
    }
  }
  sqlstr = sqlstr + " and";

  return sqlstr;
}

module.exports.memberjoinModel = async (req, res) => {
  let { password, id } = req.body;
  let saltRounds = 10;
  const haspassword = await bcrypt.hash(password, saltRounds);
  // console.log(haspassword);
  let sql = "insert into user (id,password) values(?,?)";
  let con;
  let excutequery;

  let obj = new Object();

  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [id, haspassword]);

    // const passwordcheck = await bcrypt.compare(password, haspassword);
    // console.log("비번검증:  " + passwordcheck)
    obj.joinstatuscode = 1;
  } catch (err) {
    obj.joinstatuscode = -1;
    console.log(err);
  } finally {
    con.release();
    return obj;
  }
};

module.exports.oldpwdcheckModel = async (req, res) => {
  let { password } = req.body;
  let id = req.session.userid;

  console.log("id: " + id + " password:  " + password);

  let con;
  let excutequery;

  let sql = "select * from user where id=?";

  let 유저존재성;
  let 응답제이슨 = new Object();
  try {
    con = await marialpool.pool2.getConnection();

    excutequery = await con.query(sql, [id]);

    유저존재성 = excutequery[0];

    let hashedpwd = excutequery[0][0].password;

    const pwdcheck = await bcrypt.compare(password, hashedpwd);

    if (pwdcheck) {
      응답제이슨.statuscode = 1;
    } else {
      응답제이슨.statuscode = 0;
    }
  } catch (err) {
    console.log(err);
    con.release();
  } finally {
    return 응답제이슨;
  }
};

module.exports.changenewpwdModel = async (req, res) => {
  let { password } = req.body;

  let saltRounds = 10;
  const haspassword = await bcrypt.hash(password, saltRounds);
  password = haspassword;

  let con;
  let excutequery;
  let sql = "update user set password=? where id=?";
  let status;
  let obj = new Object();
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [password, req.session.userid]);

    status = excutequery[0].affectedRows;

    if (status > 1) {
      obj.PwdChangeStatusCode = 1;
    } else {
      obj.PwdChangeStatusCode = 1;
    }
  } catch (err) {
    console.log(err);
    con.rollback();
  } finally {
    con.release();
    return obj;
  }
};

module.exports.ReserveModel = async (req, res) => {
  let sql =
    "insert into reserved (id, openclass_id,application_day) values(?,?,?)";
  let duplicate =
    "SELECT count(*) FROM reserved WHERE openclass_id=? AND id=? and application_day=?";
  let executequery;
  let id = req.query.userId;
  let openclass_id = req.query.openclass_id;
  let application_day = req.query.application_day;
  // console.log(`모델에서 받은 id ${id} 이고 받은 오픈클래스 아디니는 ${openclass_id}`)

  const con = await marialpool.pool2.getConnection();
  try {
    executequery = await con.query(duplicate, [
      openclass_id,
      id,
      application_day,
    ]);

    // 객체의 key를 알고있으면 배열인덱스속에 키 명을 집어 넣어도됨
    // console.log(executequery[0][0]['count(*)'])
    let duplic = executequery[0][0]["count(*)"];
    if (duplic >= 1) {
      return false;
    } else {
      executequery = await con.query(sql, [id, openclass_id, application_day]);
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.restModel = async (req, res) => {
  let sql;
  let excutequery;
  let con;
  let { onedayclass_num, openday } = req.body;

  let 리액트로주는JSON = new Object();
  try {
    con = await marialpool.pool2.getConnection();
    await con.query(`SET innodb_lock_wait_timeout = 2`);
    await con.beginTransaction();
    sql =
      "select * from reserverest as r right join  openningclass as o on r.openningclass_num =o.openningclass_num  where o.isopenning ='yes' and o.onedayclass_num=?  and r.openday like" +
      " '%" +
      `${openday}` +
      "%" +
      "'";
    excutequery = await con.query(sql, [onedayclass_num, openday]);

    let resultint = excutequery[0];

    리액트로주는JSON.possibleReserveList = resultint;
    리액트로주는JSON.possibleMessage = 1;
    await con.commit();
  } catch (err) {
    console.log(err);
    // 어쩔수 없음 일반 정수형으로  -1 res 보내면 애러남.. 그래서 객체처럼 보내자.
    리액트로주는JSON.possibleReserveList = resultint;
    리액트로주는JSON.possibleMessage = -1;
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};

module.exports.reservemoadlModel = async (req, res) => {
  let id = req.query.userId;
  let application_day = req.query.application_day;
  let openclass_id = req.query.openclass_id;
  let sql =
    "SELECT NAME,mobile, openclass_name,openclass_time,openclass_price,reserved_num FROM  reserved inner join  snsuser  on  reserved.id=snsuser.id inner JOIN openclass ON reserved.openclass_id=openclass.openclass_id WHERE snsuser.id=? AND reserved.application_day=? AND openclass.openclass_id=?";
  let executequery;
  try {
    let con = await marialpool.pool2.getConnection();
    executequery = await con.query(sql, [id, application_day, openclass_id]);

    let reserved_num = executequery[0][0]["reserved_num"];
    // 지금 manageropenclass 태이블 재고 완료 개념이 불안정 하니 결제 이후 다시 처리하자잉처럼 결제후 인원수 반영할것임
    // sql = "INSERT INTO manageropenclass (reserved_num,rest) VALUES(?,1);"
    // await con.query(sql, [reserved_num]);

    let result = executequery[0][0];
    return result;
  } catch (err) {
    console.log(err);
  }
};

module.exports.redisproductpaymentModel = async (req, res) => {
  // for (let key in req.body) {
  //   console.log(key);
  // }

  let { proCode, proName, proPrice, proQuantity, merchant_uid, id } = req.body;

  let 레디스가먼저장으로DB에상품정보있는지확인쿼리 =
    "SELECT * from redisproduct where proCode=?";

  let executequery;
  let con;
  let obj;
  try {
    obj = new Object();
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();
    executequery = await con.query(
      레디스가먼저장으로DB에상품정보있는지확인쿼리,
      [proCode]
    );

    if (executequery[0].length == 0) {
      let DB에상품정보입력쿼리 =
        "insert into redisproduct (proCode, proName,    proPrice,    proQuantity) values (?, ?, ?, ?) ";

      executequery = await con.query(DB에상품정보입력쿼리, [
        proCode,
        proName,
        proPrice,
        10,
      ]);
    }

    let 재고량업데이트쿼리 =
      "update redisproduct set  proQuantity=? where proCode=?  ";

    executequery = await con.query(재고량업데이트쿼리, [proQuantity, proCode]);

    if (executequery[0].affectedRows == 0) {
      throw new Error("재고수량 반영에러");
    }

    let 주문정보삽입쿼리 =
      "insert into orderinfo (proCode , id,merchant_uid) values(?,?,?)";
    executequery = await con.query(주문정보삽입쿼리, [
      proCode,
      id,
      merchant_uid,
    ]);
    if (executequery[0].affectedRows == 0) {
      throw new Error("주문정보 삽입에러");
    }

    obj.paymentStatusCode = 1;
  } catch (err) {
    console.log(err);
    obj.paymentStatusCode = -1;
    await con.rollback();
  } finally {
    await con.commit();
    await con.release();
    return obj;
  }
};

module.exports.getBannerTypeListModel = async (req, res) => {
  let { uc_bannertype } = req.body;

  let 리액트로주는JSON = {};
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

  console.log(`서버시간: ${currentServerDate}    배너타입: ${uc_bannertype}`);

  let activiingOnedayNumWithBusinessStatusList;
  let BannerTypeArr = [];
  try {
    con = await marialpool.pool2.getConnection();

    excutequery = await con.query(activiingOnedayNumWithBusinessStatus, [
      currentServerDate,
      currentServerDate,
      "confirm",
    ]);

    activiingOnedayNumWithBusinessStatusList = excutequery[0];

    for (let i = 0; i < activiingOnedayNumWithBusinessStatusList.length; i++) {
      let activiingOnedayNumWithBusinessStatus =
        activiingOnedayNumWithBusinessStatusList[i].onedayclass_num;

      console.log(
        `activiingOnedayNumWithBusinessStatusList:   ${activiingOnedayNumWithBusinessStatusList}`
      );

      excutequery = await con.query(onedayListType, [
        activiingOnedayNumWithBusinessStatus,
        currentServerDate,
        currentServerDate,
        uc_bannertype,
      ]);
      //배너가 만기된경우
      if (excutequery[0][0] === undefined) {
        continue;
      }

      BannerTypeArr.push(excutequery[0][0]);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    리액트로주는JSON.list = BannerTypeArr;

    return 리액트로주는JSON;
  }
};

module.exports.getBannerTypeProductListModel = async (req, res) => {
  let { uc_bannertype } = req.body;

  let 리액트로주는JSON = {};
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

  console.log(`서버시간: ${currentServerDate}    배너타입: ${uc_bannertype}`);

  let activiingOnedayNumWithBusinessStatusList;
  let ProductArr = [];
  try {
    con = await marialpool.pool2.getConnection();

    excutequery = await con.query(activiingOnedayNumWithBusinessStatus, [
      currentServerDate,
      currentServerDate,
      "confirm",
    ]);

    activiingOnedayNumWithBusinessStatusList = excutequery[0];

    for (let i = 0; i < activiingOnedayNumWithBusinessStatusList.length; i++) {
      let activiingOnedayNumWithBusinessStatus =
        activiingOnedayNumWithBusinessStatusList[i].onedayclass_num;

      excutequery = await con.query(onedayListType, [
        activiingOnedayNumWithBusinessStatus,
        currentServerDate,
        currentServerDate,
        uc_bannertype,
      ]);
      // 배너 사용일이 끝난경우
      if (excutequery[0][0] === undefined) {
        continue;
      }

      let FindA100TypeOnedayclass_num = excutequery[0][0].onedayclass_num;

      console.log(
        `FindA100TypeOnedayclass_num:  ${FindA100TypeOnedayclass_num}`
      );

      // console.log(
      //   `컨펌이 떨어지며 A100 인 원데이클래스 번호: ${FindA100TypeOnedayclass_num}`
      // );

      excutequery = await con.query(selectOneUnitProductInfo, [
        FindA100TypeOnedayclass_num,
      ]);

      let UnitProductInfo = excutequery[0][0];
      //left 조인은 널을 리턴하네
      if (UnitProductInfo.product_num != null) {
        const box = { ...UnitProductInfo };
        box.product_mainImage = UnitProductInfo.product_mainImage.toString();

        ProductArr.push(box);
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    리액트로주는JSON.productList = ProductArr;
    리액트로주는JSON.productCnt = ProductArr.length;
    return 리액트로주는JSON;
  }
};

module.exports.getSelectOneBannerTypeProducModel = async (req, res) => {
  let { uc_bannertype, product_num, onedayclass_num } = req.body;

  let 리액트로주는JSON = {};
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;

  console.log(`서버시간: ${currentServerDate}    배너타입: ${uc_bannertype}`);

  let selectOneActivingOnedayNumWithBusiness;
  let ProductImageArr = [];
  let productInfo;
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(
      SelectOneActiviingOnedayNumWithBusinessStatus,
      [currentServerDate, currentServerDate, "confirm", onedayclass_num]
    );
    selectOneActivingOnedayNumWithBusiness = excutequery[0][0].onedayclass_num;

    console.log(
      `1  selectOneActivingOnedayNumWithBusiness:  ${selectOneActivingOnedayNumWithBusiness}`
    );

    excutequery = await con.query(onedayListType, [
      selectOneActivingOnedayNumWithBusiness,
      currentServerDate,
      currentServerDate,
      uc_bannertype,
    ]);

    selectOneActivingOnedayNumWithBusiness = excutequery[0][0].onedayclass_num;

    console.log(
      `2 selectOneActivingOnedayNumWithBusiness:  ${selectOneActivingOnedayNumWithBusiness}`
    );

    excutequery = await con.query(selectOneUnitProductInfo, [
      selectOneActivingOnedayNumWithBusiness,
    ]);

    productInfo = excutequery[0];

    excutequery = await con.query(selectListProductImage, [product_num]);

    let selectListImage = excutequery[0];

    for (let k = 0; k < selectListImage.length; k++) {
      let box = { ...selectListImage[k] };

      box.Image_file = selectListImage[k].Image_file.toString();

      ProductImageArr.push(box);
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    리액트로주는JSON.productImageList = ProductImageArr;
    리액트로주는JSON.productInfo = productInfo;

    return 리액트로주는JSON;
  }
};

// 최초카트
module.exports.insertFirstAddCartModel = async (req, res) => {
  let { uc_bannertype, product_num, onedayclass_num } = req.body;

  let user_id = req.session.userid;

  console.log(`product_num: ${product_num}   user_id : ${user_id}`);
  let 리액트로주는JSON = {};
  리액트로주는JSON.addCartStatus = -1;
  let con;
  let excutequery;
  try {
    con = await marialpool.pool2.getConnection();

    excutequery = await con.query(insertFirstAddCartSubTransaction.isFirstAdd, [
      user_id,
    ]);

    let FirstCount = excutequery[0][0].count;

    if (FirstCount === 0) {
      let affectedRow = await 최초로카트자체에담은경우(con, req.body, user_id);

      if (affectedRow <= 0) {
        throw new Error("addcartFail");
      }
      리액트로주는JSON.addCartStatus = 1;
    } else {
      excutequery = await con.query(
        insertFirstAddCartTransaction.alreadyExist,
        [product_num, user_id]
      );
      let count = excutequery[0][0].count;
      if (count > 0) {
        throw new Error("alreadyCart");
      } else {
        excutequery = await con.query(
          insertFirstAddCartTransaction.selectOneRecentProductInfo,
          [product_num]
        );

        let uc_product_num = excutequery[0][0].uc_product_num;

        let affectedRow = await 삭제했거나결제완료후또담은경우(
          con,
          req.body,
          user_id,
          uc_product_num
        );

        if (affectedRow <= 0) {
          throw new Error("addcartFail");
        }

        리액트로주는JSON.addCartStatus = 1;
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();

    return 리액트로주는JSON;
  }
};

const 최초로카트자체에담은경우 = async (con, pram, user_id) => {
  let cart_num;
  let packing_cart_num;
  let uc_product_num;
  let { product_num, product_price } = pram;
  let cart_isPayment = "N";
  let quantity = 1;
  let cart_target_price = product_price;
  //   show_status="N" 으로 수량은 1로!

  excutequery = await con.query(
    insertFirstAddCartSubTransaction.selectOneCurrentCartNumMax
  );

  cart_num = parseInt(excutequery[0][0].cart_num) + 1;
  console.log(`excutequery[0][0].excutequery:  ${cart_num}`);
  packing_cart_num = cart_num;

  excutequery = await con.query(
    insertFirstAddCartTransaction.selectOneRecentProductInfo,
    [product_num]
  );

  uc_product_num = excutequery[0][0].uc_product_num;

  let affectedRow;
  excutequery = await con.query(
    insertFirstAddCartSubTransaction.insertFirstAdd,
    [
      cart_num,
      packing_cart_num,
      uc_product_num,
      user_id,
      quantity,
      cart_isPayment,
      cart_target_price,
    ]
  );
  affectedRow = excutequery[0].affectedRows;

  return affectedRow;
};

const 삭제했거나결제완료후또담은경우 = async (
  con,
  pram,
  user_id,
  uc_product_num
) => {
  let cart_num;
  let packing_cart_num;
  let { product_num, product_price } = pram;
  let cart_isPayment = "N";
  let quantity = 1;
  let cart_target_price = product_price;
  //   show_status="N" 으로 수량은 1로!

  excutequery = await con.query(
    insertFirstAddCartTransaction.selectOneCurrentCartNumAndPackingMax,
    [user_id]
  );
  cart_num = excutequery[0][0].cart_num;
  packing_cart_num = parseInt(excutequery[0][0].packing_cart_num) + 1;

  let affectedRow;
  excutequery = await con.query(
    insertFirstAddCartSubTransaction.insertFirstAdd,
    [
      cart_num,
      packing_cart_num,
      uc_product_num,
      user_id,
      quantity,
      cart_isPayment,
      cart_target_price,
    ]
  );
  affectedRow = excutequery[0].affectedRows;

  return affectedRow;
};

module.exports.insertPaymnetInfoModel = async (req, res) => {
  let user_id = req.session.userid;

  let { payParamList } = req.body;

  let 리액트로주는JSON = {};
  const date = new Date();
  const serverYear = date.getFullYear();
  const serverMonth = String(date.getMonth() + 1).padStart(2, "0"); // 01 ~ 12
  const serverDay = String(date.getDate()).padStart(2, "0"); // 01 ~ 31
  const seqNum = Math.random();
  const currentServerDate = serverYear + "-" + serverMonth + "-" + serverDay;
  const 임시방편거래번호 =
    serverYear + "-" + serverMonth + "-" + serverDay + "-" + seqNum;

  let con;
  리액트로주는JSON.payStatusCode = 1;
  let 집계객체 = {};
  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();
    let payment_complete_num;
    let quantityList = await checkQuantity(con, user_id);
    for (let k = 0; k < quantityList.length; k++) {
      if (quantityList[k].product_quantity < 1) {
        throw new Error("soldOut");
      }
    }

    let selectOne = await con.query(PaymentSubTransaction.isEmpty);
    let cont = selectOne[0][0].count;

    if (cont === 0) {
      payment_complete_num = 1;
      집계객체 = await insertPaymnetInfo(
        con,
        payParamList,
        user_id,
        임시방편거래번호,
        "isFirst"
      );
    }

    if (cont > 0) {
      let selectOne = await con.query(
        PaymentSubTransaction.selectOnePaymentCompleteNum
      );

      payment_complete_num = parseInt(selectOne[0][0].payment_complete_num) + 1;

      집계객체 = await insertPaymnetInfo(
        con,
        payParamList,
        user_id,
        임시방편거래번호,
        payment_complete_num
      );
    }

    집계객체.payment_complete_num = payment_complete_num;
    await insertPaymnetComplete(con, 집계객체);
    await updateCartPayStatus(con, payParamList, user_id);
    //payParamList
  } catch (err) {
    리액트로주는JSON.payStatusCode = -1;
    console.log(err);
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

const checkQuantity = async (con, user_id) => {
  let quantityList;

  let selectList = await con.query(PaymentTransaction.checkQuantity, [user_id]);
  quantityList = selectList[0];
  return quantityList;
};

const insertPaymnetInfo = async (
  con,
  payParamList,
  user_id,
  임시방편거래번호,
  mesaage
) => {
  let payment_complete_num;
  if (mesaage === "isFirst") {
    payment_complete_num = 1;
  } else {
    payment_complete_num = mesaage;
  }

  let 집계객체 = {
    totalprice: 0,
    row_total_quantity: 0,
  };

  for (let k = 0; k < payParamList.length; k++) {
    let { row_total_quantity, row_total_price, uc_product_num } =
      payParamList[k];

    집계객체.totalprice += parseInt(row_total_price);
    집계객체.row_total_quantity += parseInt(row_total_quantity);

    let affectedRows = await con.query(PaymentTransaction.insertPaymentInfo, [
      payment_complete_num,
      user_id,
      임시방편거래번호,
      row_total_quantity,
      row_total_price,
      uc_product_num,
    ]);

    //후
    let affectedRow = affectedRows[0].affectedRows;
    if (affectedRow < 0) {
      throw new Error("payinfoInsertFail");
    }
  }

  return 집계객체;
};

const insertPaymnetComplete = async (con, 집계객체) => {
  let { payment_complete_num, totalprice, row_total_quantity } = 집계객체;
  let affectedRows = await con.query(PaymentTransaction.insertPaymentComplete, [
    payment_complete_num,
    totalprice,
    row_total_quantity,
  ]);

  let affectedRow = affectedRows[0].affectedRows;
  if (affectedRow < 0) {
    throw new Error("payiCompleteInfoInsertFail");
  }
};

const updateCartPayStatus = async (con, payParamList, user_id) => {
  for (let k = 0; k < payParamList.length; k++) {
    let { cart_num, packing_cart_num } = payParamList[k];
    console.log(cart_num, packing_cart_num);
    let affectedRows = await con.query(PaymentTransaction.updateCartPayStatus, [
      cart_num,
      packing_cart_num,
      user_id,
    ]);
    let affectedRow = affectedRows[0].affectedRows;
    if (affectedRow < 0) {
      throw new Error("updatCartPayStatusFail");
    }
  }
};

module.exports.openclassinfoModel = async (req, res) => {
  let sql = "select * from openclass";
  let executequery;

  try {
    const con = marialpool.pool2.getConnection();
    executequery = await con.query(sql);
    let result = executequery[0][0];
  } catch (err) {}
};

module.exports.getReviewModel = async (req, res) => {
  let { cPage, onedayclass_num } = req.body;

  let 리액트로주는JSON = {};
  let con;
  let totalreviewcntsql =
    "SELECT COUNT(*) AS totalReviewCnt FROM review WHERE onedayclass_num=?";

  let reviewssql =
    "SELECT * FROM review WHERE onedayclass_num=? ORDER BY review_create_at DESC LIMIT ?, 10";

  try {
    con = await marialpool.pool2.getConnection();

    const reviewResult = await con.query(reviewssql, [onedayclass_num, cPage]);

    const [totalResult] = await con.query(totalreviewcntsql, [onedayclass_num]);

    리액트로주는JSON.reviewList = reviewResult[0];
    리액트로주는JSON.totalReviewCnt = totalResult[0].totalReviewCnt;
  } catch (err) {
    console.log(err);
  } finally {
    console.log(리액트로주는JSON);
    con.release();
    return 리액트로주는JSON;
  }
};

module.exports.getnextReviewModel = async (req, res) => {
  let nextreivew = false;

  let backreview = false;

  let backbuttoncn = 0;

  let answarobj = {
    nextreivew: nextreivew,

    backreview: backreview,

    start_flag: false,

    end_flag: false,

    buttoncnt: 0,

    backbuttoncnt: 0,

    reviews: null,
  };

  let { limit, onedayclass_num } = req.query;

  let totalreviewcntsql = "select count(*) from review where onedayclass_num=?";

  //주의해라, 이건, 클라이언트가 넥스트 페이지를 눌렀다면
  // 먼저 totalreviewcntsql 총 계산한걸 가져온뒤
  // 바로 아래 쿼리의 첫?:클라이언트가 누른 넥스트페이지 값   두번째?:위에서 구한 총 테이블로우수    에 집어 넣어어
  let nextrescntsql =
    "SELECT COUNT(*) FROM  (SELECT * from review where onedayclass_num=? LIMIT ?,?) AS t";

  let totalrowcnt;
  let excutequery;
  let nexttotalrowcnt;
  try {
    const con = await marialpool.pool2.getConnection();

    excutequery = await con.query(totalreviewcntsql, [onedayclass_num]);

    Object.values(excutequery[0][0]).forEach((v) => {
      totalrowcnt = v;
    });
    console.log("전체게시글수:  " + totalrowcnt);

    excutequery = await con.query(nextrescntsql, [
      onedayclass_num,
      limit,
      totalrowcnt,
    ]);

    console.log(excutequery);

    Object.values(excutequery[0][0]).forEach((v) => {
      nexttotalrowcnt = v;
    });

    console.log("다음페이지 이상 총 게시글수:  " + nexttotalrowcnt);

    let getreviewqeury =
      "select * from review where onedayclass_num=? limit ?, 10";

    if (nexttotalrowcnt != 0) {
      excutequery = await con.query(getreviewqeury, [onedayclass_num, limit]);
      getreviewqeury = excutequery[0];
      answarobj.reviews = getreviewqeury;

      let buttoncnt = nexttotalrowcnt / 10;
      answarobj.backbuttoncnt = limit - 10;
      if (buttoncnt < 1) {
        buttoncnt = Math.floor(buttoncnt);
        answarobj.buttoncnt = buttoncnt;
        answarobj.end_flag = true;
        answarobj.start_flag = false;
        answarobj.nextreivew = false;
        answarobj.backreview = true;

        return answarobj;
      }

      if (buttoncnt >= 1 || buttoncnt >= 5) {
        buttoncnt = parseInt(limit) + 10;
        answarobj.buttoncnt = buttoncnt;
        answarobj.end_flag = false;
        answarobj.start_flag = false;
        answarobj.nextreivew = true;
        answarobj.backreview = true;
        answarobj.backbuttoncnt = parseInt(limit);
        return answarobj;
      }
    } else {
      answarobj.end_flag = true;
      answarobj.start_flag = false;
      answarobj.backreview = true;
      answarobj.nextreivew = false;
      //  answarobj.backbuttoncnt=parseInt(limit)-10;
      answarobj.backbuttoncnt = parseInt(limit);
      return answarobj;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getbackReviewModel = async (req, res) => {
  let start_flag = false;

  let nextreivew = false;

  let backreview = false;

  let backbuttoncn = 0;

  let buttoncnt = 0;

  let reviews = null;

  let { limit, onedayclass_num } = req.query;

  //망할... limit 값 문자열 0 그리고  투르 펠스가 문자열로 오고 있었음.. 아오
  //또 limit도 아마 리엑트에서 `${}` 이렇게 보내서 그런듯
  if (parseInt(req.query.limit) == 0) {
    console.log("첫페이지");
    start_flag = true;
    backbuttoncn = 0;
    buttoncnt = 10;
  } else {
    backbuttoncn = req.query.limit - 10;
    buttoncnt = parseInt(req.query.limit) + 10;

    console.log("buttoncnt!!!!!!!!!!!:    " + buttoncnt);
  }

  let answarobj = {
    nextreivew: nextreivew,

    backreview: backreview,

    start_flag: start_flag,

    end_flag: false,

    buttoncnt: buttoncnt,

    backbuttoncnt: backbuttoncn,

    reviews: null,
  };

  let backreivewsql =
    "select * from review where onedayclass_num=? limit ?, 10";
  let executebackreivewquery;

  try {
    const con = await marialpool.pool2.getConnection();

    executebackreivewquery = await con.query(backreivewsql, [
      onedayclass_num,
      limit,
    ]);

    reviews = executebackreivewquery[0];

    answarobj.reviews = reviews;

    return answarobj;
  } catch (err) {
    console.log(err);
  }
};

module.exports.mypageModel = async (req, res) => {
  console.log(req.body);
  let { id } = req.body;
  console.log("id->>>>>>>>>>", id);
  //쿼리문을 주석처리하고 다음 쿼리로 대체해봄
  // let joinsql = 'SELECT * FROM  reserveinfo AS r INNER JOIN onedayclass AS o ON r.onedayclass_num=o.onedayclass_num INNER JOIN user AS u WHERE r.id=?';

  let joinsql =
    "SELECT * FROM  reserveinfo AS r INNER JOIN onedayclass AS o ON r.onedayclass_num=o.onedayclass_num WHERE r.id=?";

  let excutequery;
  let resobj;
  try {
    let con = await marialpool.pool2.getConnection();
    excutequery = await con.query(joinsql, [id]);

    resobj = excutequery[0];
    return resobj;
  } catch (err) {
    console.log(err);
  }
};

module.exports.myCartListModel = async (req, res) => {
  let user_id = req.session.userid;

  let oldSelectListMyCart;
  let oldselectList;
  let selectList;

  let oldProductInfoList = [];
  let currentProductInfo;

  let 리액트로주는JSON = {};
  let con;
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(
      selectMyCartListTransaction.selectListMyCart,
      [user_id]
    );

    selectList = excutequery[0];

    oldselectList = selectList;

    oldSelectListMyCart = oldselectList;
    if (selectList.length != 0) {
      excutequery = await con.query(
        selectMyCartListTransaction.oldProductInfo,
        [user_id]
      );
      selectList = excutequery[0];

      for (let k = 0; k < selectList.length; k++) {
        let box = { ...selectList[k] };
        box.uc_product_mainImage =
          selectList[k].uc_product_mainImage.toString();

        oldProductInfoList.push(box);
      }

      excutequery = await con.query(
        selectMyCartListTransaction.productUpdateCheck,
        [user_id]
      );

      currentProductInfo = excutequery[0];
    }

    console.log(excutequery[0]);
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    리액트로주는JSON.oldSelectListMyCart = oldSelectListMyCart;
    리액트로주는JSON.oldProductInfoList = oldProductInfoList;
    리액트로주는JSON.currentProductInfo = currentProductInfo;
    return 리액트로주는JSON;
  }
};

module.exports.eachCartDeleteModel = async (req, res) => {
  let user_id = req.session.userid;
  let { cart_num, packing_cart_num } = req.body;

  let 리액트로주는JSON = {};
  let con;
  let affectedRow;

  리액트로주는JSON.deleteStatusCode = 1;
  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();

    excutequery = await con.query(deleteEachCart, [
      user_id,
      cart_num,
      packing_cart_num,
    ]);

    affectedRow = excutequery[0].affectedRows;

    if (affectedRow <= 0) {
      throw new Error("deleteEachCartFial");
    }
  } catch (err) {
    console.log(err);
    await con.rollback();
    리액트로주는JSON.deleteStatusCode = -1;
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.allCartDeleteModel = async (req, res) => {
  let user_id = req.session.userid;
  let 리액트로주는JSON = {};
  let con;
  let affectedRow;

  리액트로주는JSON.deleteStatusCode = 1;
  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();

    excutequery = await con.query(deleteAllCart, [user_id]);

    affectedRow = excutequery[0].affectedRows;

    if (affectedRow <= 0) {
      throw new Error("deleteEachCartFial");
    }
  } catch (err) {
    console.log(err);
    await con.rollback();
    리액트로주는JSON.deleteStatusCode = -1;
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

// 슈
module.exports.myreceiptModel = async (req, res) => {
  let user_id = req.session.userid;
  let { enterence, limitSt } = req.body;
  let 리액트로주는JSON = {};
  let con;
  let myReceiptFullCnt;
  let myReceiptList;

  console.log(
    `user_id: ${user_id}  enterence: ${enterence}, limitSt: ${limitSt}`
  );

  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();

    if (enterence === "fisrt") {
      excutequery = await con.query(selectListMyReceiptSearch.FullSize, [
        user_id,
      ]);

      myReceiptFullCnt = excutequery[0][0].count;
      리액트로주는JSON.myReceiptFullCnt = myReceiptFullCnt;
    }

    excutequery = await con.query(selectListMyReceiptSearch.FullSearch, [
      user_id,
      limitSt,
    ]);

    myReceiptList = excutequery[0];

    let 이미지가공후다시만드배열 = [];
    if (myReceiptList.length > 0) {
      for (let k = 0; k < myReceiptList.length; k++) {
        let box = { ...myReceiptList[k] };
        box.uc_product_mainImage =
          myReceiptList[k].uc_product_mainImage.toString();
        이미지가공후다시만드배열.push(box);
      }
    }

    리액트로주는JSON.myReceiptList = 이미지가공후다시만드배열;
  } catch (err) {
    console.log(err);
  } finally {
    await con.commit();
    con.release();

    return 리액트로주는JSON;
  }
};

module.exports.reserveMypageModel = async (req, res) => {
  let id = req.session.userid;
  let { cPage, enterence } = req.body;
  let con;
  let excutequery;
  let 리액트로주는JSON = {};
  try {
    con = await marialpool.pool2.getConnection();

    //MyReserveFullSize

    console.log(
      `
      검색조건  cPage: ${cPage}  enterence: ${enterence} id: ${id}
      `
    );

    if (enterence === "fisrt") {
      excutequery = await con.query(MyReserveFullSize, [id]);
      리액트로주는JSON.myReserveFullSize = excutequery[0][0].count;
    }

    excutequery = await con.query(SelectListMyReserve, [id, cPage]);

    let 이미지를가공해서다시담을배열 = [];

    for (let k = 0; k < excutequery[0].length; k++) {
      let box = { ...excutequery[0][k] };
      box.reserve_img = excutequery[0][k].reserve_img.toString();
      이미지를가공해서다시담을배열.push(box);
    }

    리액트로주는JSON.myReserveList = 이미지를가공해서다시담을배열;
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    return 리액트로주는JSON;
  }
};

//테이블의 남은 자리를 업데이트 처리 하자.
module.exports.paymentModel = async (req, res) => {
  let statuscod;

  for (key in req.body) {
    if (key == undefined || key == null) {
      throw new Error("리엑트 쪽에서 쿼리스트링을 잘못세팅해서줌");
    }
  }

  let {
    merchant_uid,
    onedayclass_num,
    openday,
    id,
    reserve_name,
    reserve_tell,
  } = req.body;

  //let { merchant_uid, onedayclass_num, openday, id, reserve_name, reserve_tell } ={"merchant_uid":1, "onedayclass_num":2, "openday":"2024-10-05 20:07:55", "id":"김돌골", "reserve_name":"말자", "reserve_tell":"010-9313-0686"}
  //결제하는 도중 다른사람들도 할수있으니 다시한번 남은 자리수를 확인하자.
  let sql =
    "select rest from reserverest where onedayclass_num=" +
    onedayclass_num +
    " and openday like '%" +
    `${openday}` +
    "%" +
    "'";

  let executequery;

  let resultobj;

  const con = await marialpool.pool2.getConnection();

  try {
    executequery = await con.query(sql, onedayclass_num);
    let result = executequery[0][0];
    let restcnt = result.rest;

    // 결제하는 도중 다른사람들도 할수있으니 다시한번 남은 자리수를 확인하자.
    if (result == undefined || restcnt < 0) {
      throw new Error("원데이 클래스 번호 잘못 받아 왔거나 남은자리가 0임!!");
    }

    await con.beginTransaction();

    sql =
      "select max(updateAt) as lasupdaterecode from onedayclassupdaterecode where onedayclass_num=? ";

    let returnrow = await con.query(sql, [onedayclass_num]);
    let lasupdaterecode = returnrow[0][0].lasupdaterecode;

    sql =
      "insert into reserveinfo (merchant_uid,onedayclass_num,openday,id,reserve_name,reserve_tell,updateAt) values (?,?,?,?,?,?,?) for update ";
    result = await con.query(sql, [
      merchant_uid,
      onedayclass_num,
      openday,
      id,
      reserve_name,
      reserve_tell,
      lasupdaterecode,
    ]);

    sql =
      "select rest from reserverest where onedayclass_num=" +
      onedayclass_num +
      " and openday like '%" +
      `${openday}` +
      "%" +
      "'";

    result = await con.query(sql);

    //  throw new Error("남은자리가 0임!!");
    let nowrestcnt = parseInt(result[0][0].rest);
    if (parseInt(nowrestcnt) <= 0) {
      throw new Error("남은자리가 0임!!");
    }
    nowrestcnt--;

    console.log("nowrestcnt:  " + nowrestcnt);
    sql =
      "update reserverest set  rest=" +
      nowrestcnt +
      " where onedayclass_num=" +
      onedayclass_num +
      " and openday like'%" +
      `${openday}` +
      "%'";

    await con.query(sql);

    statuscod = 1;
  } catch (err) {
    console.log(err);
    con.rollback();
    con.release();
    statuscod = -1;
  } finally {
    con.commit();
    con.release();

    return statuscod;
  }
};

module.exports.testpaymentModel = async (req, res) => {
  let statuscod;

  let { merchant_uid, onedayclass_num, openday, reserve_name, reserve_tell } =
    req.body;
  let id = req.session.userid;

  const con = await marialpool.pool2.getConnection();
  //결제하는 도중 다른사람들도 할수있으니 다시한번 남은 자리수를 확인하자.
  let sql =
    "select rest from reserverest where onedayclass_num=" +
    onedayclass_num +
    " and openday like '%" +
    `${openday}` +
    "%" +
    "'  for update";

  let executequery;

  try {
    executequery = await con.query(sql, onedayclass_num);
    let result = executequery[0][0];
    let restcnt = result.rest;

    // 결제하는 도중 다른사람들도 할수있으니 다시한번 남은 자리수를 확인하자.
    if (result == undefined || restcnt < 0) {
      throw new Error("원데이 클래스 번호 잘못 받아 왔거나 남은자리가 0임!!");
    }

    await con.beginTransaction();

    sql =
      "select max(updateAt) as lasupdaterecode from onedayclassupdaterecode where onedayclass_num=? ";

    let returnrow = await con.query(sql, [onedayclass_num]);
    let lasupdaterecode = returnrow[0][0].lasupdaterecode;

    sql =
      "insert into reserveinfo (merchant_uid,onedayclass_num,openday,id,reserve_name,reserve_tell,updateAt) values (?,?,?,?,?,?,?)  ";
    result = await con.query(sql, [
      merchant_uid,
      onedayclass_num,
      openday,
      id,
      reserve_name,
      reserve_tell,
      lasupdaterecode,
    ]);

    sql =
      "select rest from reserverest where onedayclass_num=" +
      onedayclass_num +
      " and openday like '%" +
      `${openday}` +
      "%" +
      "'";

    result = await con.query(sql);

    //  throw new Error("남은자리가 0임!!");
    let nowrestcnt = parseInt(result[0][0].rest);
    if (parseInt(nowrestcnt) <= 0) {
      throw new Error("남은자리가 0임!!");
    }
    nowrestcnt--;

    console.log("nowrestcnt:  " + nowrestcnt);
    sql =
      "update reserverest set  rest=" +
      nowrestcnt +
      " where onedayclass_num=" +
      onedayclass_num +
      " and openday like'%" +
      `${openday}` +
      "%'";

    await con.query(sql);

    statuscod = 1;
  } catch (err) {
    console.log(err);
    con.rollback();
    con.release();
    statuscod = -1;
  } finally {
    con.commit();
    con.release();

    return statuscod;
  }
};

//환불처리 하자.
//
module.exports.paycancleModel = async (req, res) => {
  // console.log(req.body);
  let {
    merchant_uid,
    onedayclass_num,
    openday,
    id,
    reserve_name,
    reserve_tell,
  } = req.body;

  //db에선 되는데 그냥 쿼리 분리하자.
  // let sql1 = "UPDATE reserverest AS t SET rest=(SELECT rest FROM reserverest WHERE  onedayclass_num="+`${onedayclass_num}`+" and openday LIKE '%"+`${openday}`+"%' ) +1000 WHERE  onedayclass_num="+`${onedayclass_num} for update`;
  let sql1 =
    "SELECT rest FROM reserverest WHERE  onedayclass_num=" +
    `${onedayclass_num}` +
    " and openday LIKE '%" +
    `${openday}` +
    "%' for update";
  let sql2 = "UPDATE reserverest  SET rest=? where onedayclass_num=?";
  let sql3 =
    "UPDATE reserveinfo SET reservestatus='paycancle' WHERE merchant_uid=? AND onedayclass_num=?";
  let con;
  try {
    con = await marialpool.pool2.getConnection();
    await con.beginTransaction();
    let excutequery = await con.query(sql1);
    //  console.log(excutequery[0][0])
    let restcnt = parseInt(excutequery[0][0].rest) + 1;
    //  console.log("restcnt:  "+restcnt);
    excutequery = await con.query(sql2, [restcnt, onedayclass_num]);

    excutequery = await con.query(sql3, [merchant_uid, onedayclass_num]);
  } catch (err) {
    await con.rollback();
    console.log(err);
  } finally {
    con.release();
  }
};

module.exports.checkreceiptModel = async (req, res) => {
  let id = req.session.userid;
  let { onedayclass_num } = req.body;
  console.log(`id: ${id} onedayclass_num: ${onedayclass_num}`);
  let sql = "SELECT * FROM reserveinfo WHERE id=? and onedayclass_num=?  ";
  let con;
  let excutequery;
  let resobj = {};
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [id, onedayclass_num]);

    let 예약횟수 = excutequery[0].length;

    console.log(`예약횟수: ${예약횟수}`);

    if (예약횟수 == 0) {
      resobj.usingStatus = -1;
    } else {
      resobj.usingStatus = await 공정한리뷰작성을위한함수(
        con,
        예약횟수,
        id,
        onedayclass_num
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    return resobj;
  }
};

const 공정한리뷰작성을위한함수 = async (con, 예약횟수, id, onedayclass_num) => {
  // 결제를 하였다면, 가능성은 두가지
  // 리뷰를 작성한적이 있거나, 없거나, 혹은
  // 해당년도 04월의 15일 예약후 리뷰작성 20일또 예약하였으나 리뷰는 작성하지 않음
  let usingStatus;
  let sql =
    "SELECT count(*) as reviewCnt FROM review WHERE user_id=? and onedayclass_num=? ";
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [id, onedayclass_num]);
    let 리뷰작성횟수 = excutequery[0][0].reviewCnt;

    console.log(`리뷰작성횟수: ${리뷰작성횟수}`);

    if (리뷰작성횟수 === 0 || 리뷰작성횟수 < 예약횟수) {
      usingStatus = 1;
    } else {
      usingStatus = -100;
    }
  } catch (err) {
    console.log(err);
  } finally {
    con.release();
    return usingStatus;
  }
};

module.exports.writingreviewModel = async (req, res) => {
  let user_id = req.session.userid;

  let {
    onedayclass_num,
    review_name,
    review_comment,
    review_image,
    image_name,
  } = req.body;

  let sql =
    "insert into review (review_comment,user_id,onedayclass_num,review_name,review_image,image_name)  values(?,?,?,?,?,?)";
  let con;
  let excutequery;
  let 리액트로주는JSON = {};
  try {
    con = await marialpool.pool2.getConnection();
    excutequery = await con.query(sql, [
      review_comment,
      user_id,
      onedayclass_num,
      review_name,
      review_image,
      image_name,
    ]);

    리액트로주는JSON.reviewStatusCode = 1;
  } catch (err) {
    console.log(err);
    리액트로주는JSON.reviewStatusCode = -1;
  } finally {
    con.release();
    return 리액트로주는JSON;
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
