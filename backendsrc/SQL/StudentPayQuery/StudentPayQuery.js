// 마찬가지로 결제 트랜잭션은
// 다날이 되었다는 가정하에 진행하자.

const PaymentTransactionKey = {
  T1: `select pq.product_quantity	
from
	product_quantity as pq
left join (
	select
		puc.product_num
	from
		product_update_recode as puc
	left join (
		select
			c.uc_product_num
		from
			cart as c
		where
			c.user_id = ?
			and c.cart_isPayment = 'N'
) as mycart on
		puc.uc_product_num = mycart.uc_product_num
	group by
		puc.product_num ) as poductNum on
	pq.product_num = poductNum.product_num`,
  T2: `insert 
         into  paymentinfo
     (payment_complete_num,	user_id,	merchant_num,	row_total_quantity,	row_total_price,	uc_product_num	)
     values (?,?,?,?,?,?)`,

  T3: `insert into payment_complete values(?,?,?)`,

  T4: `update cart set cart_isPayment='Y' where  cart_num=? and packing_cart_num=? and user_id=? `,
};

const PaymentTransaction = {
  checkQuantity: PaymentTransactionKey.T1,
  insertPaymentInfo: PaymentTransactionKey.T2,
  insertPaymentComplete: PaymentTransactionKey.T3,
  updateCartPayStatus: PaymentTransactionKey.T4,
};

const PaymentSubTransactionKey = {
  T0: `select count(*) as count from paymentinfo;`,
  T1: `select max(payment_complete_num) as payment_complete_num  from paymentinfo;`,
};

const PaymentSubTransaction = {
  isEmpty: PaymentSubTransactionKey.T0,
  selectOnePaymentCompleteNum: PaymentSubTransactionKey.T1,
};

const selectListMyReceiptSearchKey = {
  FullSize: `
	select
	count(*) as count
from
	paymentinfo
	
		where user_id=?`,

  FullSearch: `select
	*
from
	refund_policy_Detail as rpd
inner join (
	select
		
		p.product_policy_num,
		sub2.product_num,
			sub2.merchant_num ,
			sub2.uc_product_name,
			sub2.uc_product_price,
				sub2.row_total_quantity,
				sub2.row_total_price ,
				sub2.payment_createAt,
				
				sub2.uc_product_mainImage
	From
		product as p
	inner join (
		select
			paytimeinfo .uc_product_num,
			sub1.product_num,
			sub1.merchant_num ,
			sub1.uc_product_name,
			sub1.uc_product_price,
				sub1.row_total_quantity,
				sub1.row_total_price ,
				sub1.payment_createAt,
				
				sub1.uc_product_mainImage
		from
			product_update_recode as paytimeinfo
		inner join(
			select
				puc.product_num,
				puc.uc_product_name,
				puc.uc_product_price,
				pf.uc_product_num,
				pf.merchant_num ,
			
				pf.row_total_quantity,
				pf.row_total_price ,
				pf.payment_createAt,
				
				puc.uc_product_mainImage
			From
				paymentinfo as pf
			left join product_update_recode as puc 

on
				pf.uc_product_num = puc.uc_product_num
			where
				pf.user_id = ?

) as sub1 on
			paytimeinfo.uc_product_num = sub1.uc_product_num
		order by
			sub1.payment_createAt desc
		limit ?,
		10
) as sub2 on
		p.product_num = sub2.product_num

) as sub3 on
	rpd.product_policy_num = sub3.product_policy_num
`,
};

const selectListMyReceiptSearch = {
  FullSize: selectListMyReceiptSearchKey.FullSize,
  FullSearch: selectListMyReceiptSearchKey.FullSearch,
};

module.exports = {
  PaymentTransaction,
  PaymentSubTransaction,
  selectListMyReceiptSearch,
};
