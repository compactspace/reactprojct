const getOnedayClassInfo = "select * From onedayclass as o ";

// 발급 받은 원데이클래스 번호로
// 원데이클래스 정보를 삽입한적이 없다면 null 아니라면 그 원데이클래스번호를 리턴한다.
const alreadyOnedayClassInfoCheck =
  "SELECT   CASE   WHEN o.onedayclass_num IS NULL THEN NULL   ELSE o.onedayclass_num    END AS onedayclass_num  FROM onedayclass AS o   RIGHT JOIN teacher AS t ON o.onedayclass_num = t.onedayclass_num  WHERE t.tid = ?    AND t.onedayclass_num = ?  ";

// 선생테이블에서, 해당 원데이클래스 번호로 사업이 떨어졌는지 여부를 리턴한다.
const checkBusiness_status = `
select
	t.onedayclass_num as onedayclass_num ,
	t.business_num as business_num
From
	teacher as t
where
	t.tid =? AND t.onedayclass_num = ? and  t.business_status=?`;

const getTeacherOnedayClassNumList =
  "select t.onedayclass_num as onedayclass_num  ,t.business_num  as business_num From teacher as t where t.tid=?";

const searchOnedayClass = {
  default: "where  o.onedayclass_num=?",
};

// 사업자 인증을 받고, teacher테이블에 원데이클래스넘이 기입된
// 그 원데이클래스번호를 가지고, 원데이클래스에 삽입된 그 번호만을 가져온다.
const getRocoredOnedayclassNum = `SELECT
	o.onedayclass_num,
  o.onedayclass_name
FROM
	onedayclass AS o
RIGHT JOIN teacher AS t ON
	o.onedayclass_num = t.onedayclass_num
	
where t.tid=?`;

const getSelectOneOnedayClassInfo = `select * from onedayclass as o inner join teacher as t on o.onedayclass_num = t.onedayclass_num where t.tid =? and o.onedayclass_num=?`;

const TeacherInsertOnedayTransactionKey = {
  //원데이테이블 에 인설트되지 않은  원데이클래스 번호를 가져온다.
  T1: "select  onedayclass_num from teacher where tid=? and business_num=?",
  //원데이클래스테이블에 삽입한다.
  T2: "insert into onedayclass (onedayclass_num,onedayclass_name, onedayclass_price  ,onedayclass_info, ClassLocation , Park,PlayTime, Playinguser, ClassIntro, reserve_img, nickname) values (?,?,?,?,?,?,?,?,?,?,?)",
  //원데이클래스테이블_기록 테이블에 삽입한다.
  T3: "insert into onedayclassupdaterecode (onedayclass_num,onedayclass_name, onedayclass_price ,onedayclass_info, ClassLocation , Park,PlayTime, Playinguser, ClassIntro, reserve_img) values (?,?,?,?,?,?,?,?,?,?)",
  // 이미지테이블에 이미지를 삽입한다.
  T4: "insert into onedayclassimg  (reserve_img,onedayclass_num) values (?,?)",
};

const TeacherInsertOnedayTransaction = {
  getNoCreatedOnedayNum: TeacherInsertOnedayTransactionKey.T1,
  insertFirstOnedayInfo: TeacherInsertOnedayTransactionKey.T2,
  insertOnedayRecord: TeacherInsertOnedayTransactionKey.T3,
  insertOnedayReserveIamge: TeacherInsertOnedayTransactionKey.T4,
};

const TeacherInsertOpenningTransactionKey = {
  T1: `SELECT openningclass_num 
  FROM openningclass 
   WHERE onedayclass_num = ? AND openningday = ?
  FOR UPDATE`,

  T2: `select 
	case		
			when max(openningclass_num) is null then 1		
			else max(openningclass_num)+1
	end as openningclass_num
from openningclass`,
  T3: `insert into openningclass 
        (tid,onedayclass_num,openningday,openningclass_num)  values(?,?,?,?)`,

  T4: `select 
  case		
			when max(reserverest) is null then 1		
			else max(reserverest)+1
	end as reserverest
from reserverest;
`,

  T5: `insert into  reserverest
 (reserverest,onedayclass_num,openday,rest,openningclass_num)
  values(?,?,?,?,?)
`,
};

const TeacherInsertOpenningTransaction = {
  getOpenTableXlock: TeacherInsertOpenningTransactionKey.T1,
  getOpenningclass_num: TeacherInsertOpenningTransactionKey.T2,
  InsertOpenn: TeacherInsertOpenningTransactionKey.T3,
  getReserverest: TeacherInsertOpenningTransactionKey.T4,
  insertReserveRest: TeacherInsertOpenningTransactionKey.T5,
};

module.exports = {
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
};
