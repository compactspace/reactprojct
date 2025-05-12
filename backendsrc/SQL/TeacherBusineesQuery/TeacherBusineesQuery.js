// DB자체에 데이터가 없는 경우이다.
const TeacherPayForBannerDefaultTransactionValue = {
  T1: "select count(*) as count FROM bannerpayinfo",
  T2: "SELECT IFNULL(MAX(bannerpayinfo_num), 1) AS bannerpayinfo_num FROM bannerpayinfo",
  T3: "insert into bannerpayinfo (bannerpayinfo_num,banner_stdate,banner_eddate, onedayclass_num, uc_bannerinfo_num) values(?,?,?,?,?)",
  T4: "insert into retry_banner_pay(retry_banner_pay_num,bannerpayinfo_num,update_banner_plan) values(?,?,?)",
  T5: "select  IFNULL(MAX(promotion_income_num), 1) as promotion_income_num  from promotion_income",
  T6: "insert into promotion_income (promotion_income_num,income_price,promotion_status,promotion_start_date,promotion_end_date,application_paid_at,onedayclass_num) values(?,?,?,?,?,?,?)",
  T7: "insert into promotion_confirm (promotion_cost_num,promotion_income_num,promotion_confirm_status) values(?,?,?)",
};

//트랜잭션 묶음이다.!
const TeacherPayForBannerTransactionValue = {
  T1: "insert into bannerpayinfo (bannerpayinfo_num,banner_stdate,banner_eddate, onedayclass_num, uc_bannerinfo_num) values(?,?,?,?,?)",
  T2: "insert into retry_banner_pay(retry_banner_pay_num,bannerpayinfo_num,update_banner_plan) values(?,?,?)",
  T3: "insert into promotion_income (promotion_income_num,income_price,promotion_status,promotion_start_date,promotion_end_date,application_paid_at,onedayclass_num) values(?,?,?,?,?,?,?)",
  T4: "insert into promotion_confirm (promotion_cost_num,promotion_income_num,promotion_confirm_status) values(?,?,?)",
};
const TeacherPayForBannerTransaction = {
  insertBannerpayinfo: TeacherPayForBannerTransactionValue.T1,
  insertRetryBannerpayinfo: TeacherPayForBannerTransactionValue.T2,
  insertpromotion_income: TeacherPayForBannerTransactionValue.T3,
  insertpromotion_confirm: TeacherPayForBannerTransactionValue.T4,
};

const TeacherPayForBannerSubTransaction = {
  //해당 클래스가 최초 결제인지 본다. 리턴값은  최초라면 0 아니라면 그에 대응하는값 정수이다.
  SubT1: `SELECT   CASE 
         WHEN MAX(bif.bannerpayinfo_num) IS NULL THEN 0   
       ELSE MAX(bif.bannerpayinfo_num) + 1 
      END AS bannerpayinfo_num 
    FROM bannerpayinfo AS bif WHERE onedayclass_num = ?`,

  //SubT1 가 0 이라면 전체의 최대값에 +1을 리턴;
  SubT12:
    "select max(bif.bannerpayinfo_num)+1 as bannerpayinfo_num from bannerpayinfo as bif",

  //최신 이력 번호를 담는다.
  SubT2:
    "select max(uc_bannerinfo_num) as uc_bannerinfo_num from  bannerinfo_update_record where uc_bannertype=? ",

  //최초 결재 일수 있으니 retry_banner_pay_num 값을 구한다. 단  SubT1 가 0  경우 호출된다.
  SubT3:
    "select max(retry_banner_pay_num)+1  as retry_banner_pay_num  from retry_banner_pay",
  //최초 결재가 아닌경우 retry_banner_pay_num 값을 구한다. 단  SubT1 가 1  경우 호출된다.
  SubT4:
    "SELECT rbp.retry_banner_pay_num FROM	bannerpayinfo AS bif join retry_banner_pay as rbp on bif.bannerpayinfo_num=rbp.bannerpayinfo_num WHERE	onedayclass_num = ?",

  // 마찬 가지로 최초 결제시 소득 테이블에 0 인지 아닌지
  SubT5:
    "select 	case 		when max(promotion_income_num) is null then 0 		else max(promotion_income_num)+ 1 	end as promotion_income_num from 	promotion_income as pi where 	pi.onedayclass_num = ?",
  // SubT5 가 0 일때 호출되고 전체 최대값의 1을 더해 리턴
  SubT6:
    "select max(promotion_income_num)+ 1  as promotion_income_num  from  	promotion_income as pi  ",

  // 마찬 가지로  promotion_income_num 에 대한 최초 결제시
  SubT7:
    "select case	when max(promotion_cost_num) is null then 0   else max(promotion_cost_num)+ 1 end as promotion_cost_num  from  promotion_confirm   where   	promotion_income_num = ?  ",

  //  SubT7 가 0 이라면 호출된다. 그러면 전체에서 가장큰걸 1을 더해 리턴
  SubT8:
    " select 	max(promotion_cost_num)+ 1  as promotion_cost_num from  	promotion_confirm    ",
};

const isFirstCheckBanner =
  "SELECT * FROM bannerpayinfo as b WHERE  b.onedayclass_num=?";

const isExpried =
  "SELECT * FROM bannerpayinfo as b WHERE  b.onedayclass_num=? and    b.banner_eddate BETWEEN ?  and (SELECT max(b.banner_eddate) FROM bannerpayinfo as b WHERE  b.onedayclass_num=?)";

// 해당 원데이클래스  각 배너 상품의 만기 이력 리스트를 리턴
// const activeAndExpriedList = `
//   SELECT
// buc.uc_bannertype,bi.*,
// CASE WHEN bi.banner_eddate < ? THEN 'expired'
// ELSE 'active' END AS expire_status
//   FROM bannerpayinfo AS bi
// INNER JOIN bannerinfo_update_record AS buc
//  ON bi.uc_bannerinfo_num = buc.uc_bannerinfo_num WHERE bi.onedayclass_num = ?`;

const activeList = `
  SELECT  
*
  FROM bannerpayinfo AS bi 
INNER JOIN bannerinfo_update_record AS buc
 ON bi.uc_bannerinfo_num = buc.uc_bannerinfo_num WHERE bi.onedayclass_num = ?`;

const TeacherBusinessList = `select * from teacher as t `;

const SearchKeywordBusinessList = {
  DefaultSearch: "where t.tid=? and t.business_status=?",
  TidSearch: `where t.tid=? `,
};

const getBannerPayMentInfo = ` SELECT * FROM bannerpayinfo AS bif  left join bannerinfo_update_record as buc on bif.uc_bannerinfo_num =buc.uc_bannerinfo_num   WHERE bif.onedayclass_num = ? AND bif.banner_stdate <=? AND bif.banner_eddate >=?`;

const checkPaymentForBanne = `
select
	b.bannerpayinfo_num as bannerpayinfo_num
from
	bannerpayinfo b
where
	b.onedayclass_num = ?
	and b.banner_stdate <= ?
	and b.banner_eddate >= ?

`;
const selectListOnedayNum =
  "select t.onedayclass_num from teacher as t where t.tid=?";
module.exports = {
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
};
