const selectOneMyPolicy = `select
	*
from
	refund_policy_Detail as rpd
left join (
	select
		pp.*
	from
		product_policy as pp
	) as sub 
		
		on
	rpd.product_policy_num = sub.product_policy_num
where
		sub.onedayclass_num =?`;

const selectListMyPolicy = `select pp.product_policy_num, pp.onedayclass_num, pp.product_cate from	product_policy as pp  left join teacher as t on 	pp.onedayclass_num = t.onedayclass_num where t.tid = ?`;

const insertNewPolicyTransactionKey = {
  T0: "select count(*) as count from product_policy ",
  T1: `select * from product_policy as pp where pp.onedayclass_num=?`,
  T2: `insert into product_policy ( product_policy_num,onedayclass_num,ordecount_policy,quantity_policy, product_cate ) values(?,?,?,?,?)`,
  T3: `insert into refund_policy_Detail (
product_policy_num,
possible_refunday,
possible_refund_message,
refund_option,
refund_impossible_cuz
  )
values(?,?,?,?,?)

  `,
};

const insertNewPolicySubTransactionKey = {
  SubT1: `select max(product_policy_num) as product_policy_num from product_policy as pp `,
};

const updatePolicyTransactionKey = {
  T0: `select
	*
from
	refund_policy_Detail as rpd
left join (
	select
		pp.*
	from
		product_policy as pp
	) as sub 
		
		on
	rpd.product_policy_num = sub.product_policy_num
where
		sub.onedayclass_num =? for update`,
  T1: "UPDATE product_policy AS pp SET   pp.ordecount_policy = ?,   pp.product_cate = ?,   pp.quantity_policy = ?,   pp.product_policy_updateAt = current_timestamp WHERE pp.onedayclass_num = ? ",

  T2: `UPDATE
	refund_policy_Detail AS rpd SET
	rpd.possible_refunday = ?,
	rpd.possible_refund_message = ?,
	rpd.refund_option = ?,
	rpd.refund_impossible_cuz =?
WHERE
	product_policy_num = ?
  `,
};

const updatePolicyTransaction = {
  getProduct_policyXLock: updatePolicyTransactionKey.T0,
  updatePolicy: updatePolicyTransactionKey.T1,
  updateRefundPolicy: updatePolicyTransactionKey.T2,
};

const insertNewPolicyTransaction = {
  emptyCheck: insertNewPolicyTransactionKey.T0,
  getNewPolicyNum: insertNewPolicyTransactionKey.T1,
  getCurrentMaxPolicyNum: insertNewPolicySubTransactionKey.SubT1,

  insertNewPolicy: insertNewPolicyTransactionKey.T2,
  inssertRefundPolicyDetail: insertNewPolicyTransactionKey.T3,
};

module.exports = {
  selectOneMyPolicy,
  insertNewPolicyTransaction,
  updatePolicyTransaction,
  selectListMyPolicy,
};
