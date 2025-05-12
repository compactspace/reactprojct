// 주의: 최초에 카트에 담기 버튼을 누르면 클릭되고 무조건 최소값1개로 만 인설트한다.
const insertFirstAddCartTransactionKey = {
  // 모든 장바구니 담기 버튼 클릭시 공통으로
  //  결제가 되지 않은 이력이 있는지 참조
  T0: `select
	COUNT (*) as count
from
	cart as c
right join (
	select
		p.product_num,
		puc.uc_product_num
	from
		product_update_recode as puc
	inner join product as p on
		puc.product_num = p.product_num
	where
		p.product_num = ?

) as sub on
	 c.uc_product_num = sub.uc_product_num
	 
where c.cart_isPayment='N' and c.user_id=?`,
  // T0 의 카운트가 0 이라면 담았던 적이 없거나, 삭제했거나, 결재를 완료했다는 뜻으로
  // 새로담는 개념으로 봐야한다.
  // 따라서 최신 데이터를 가르키는 고유번호를 가져온다.
  T1: `select
	max(puc.uc_product_num) as uc_product_num
from
	product_update_recode as puc
inner join product as p on
	puc.product_num = p.product_num
where
	p.product_num = ?
`,

  T2: `select  max(packing_cart_num) as packing_cart_num , max(cart_num) as cart_num from cart where user_id=? group by cart_num `,
};

const insertFirstAddCartTransaction = {
  alreadyExist: insertFirstAddCartTransactionKey.T0,
  selectOneRecentProductInfo: insertFirstAddCartTransactionKey.T1,
  selectOneCurrentCartNumAndPackingMax: insertFirstAddCartTransactionKey.T2,
};

const insertFirstAddCartSubTransactionKey = {
  // 카트 자체에 담았던적이 있는지 확인
  T0: `select count(*) as count from cart where user_id=?`,
  // 애초에 처음인경우 현재 방바구니의 고유번호중 가장 큰것을 발급
  T1: `SELECT 
    CASE 
        WHEN MAX(cart_num) IS NULL THEN 0
        ELSE MAX(cart_num)
    END AS cart_num
FROM cart;
`,

  T3: `insert into cart (cart_num, packing_cart_num, uc_product_num,  user_id, quantity,  cart_isPayment, cart_target_price)  values(?,?,?,?,?,?,?)`,
};

const insertFirstAddCartSubTransaction = {
  isFirstAdd: insertFirstAddCartSubTransactionKey.T0,
  selectOneCurrentCartNumMax: insertFirstAddCartSubTransactionKey.T1,
  insertFirstAdd: insertFirstAddCartSubTransactionKey.T3,
};

// 이는 카트에 담긴 데이터가 틀릴수도 있어 보정하는 조회 트랜잭션이다.
const selectMyCartListTransactionKye = {
  T1: `select * from cart as c where c.user_id=?  and c.cart_isPayment='N' `,
  T2: `select
puc.uc_product_name,
puc.uc_product_price,
puc.uc_product_mainImage
From
	product_update_recode as puc
right join (
	select
		c.uc_product_num
	from
		cart as c
	where
		c.user_id = ? and c.cart_isPayment='N') as sub on
	sub.uc_product_num = puc.uc_product_num
  ORDER BY 
   puc.product_num asc
  `,

  T3: `SELECT 
    puc.*
FROM 
    product_update_recode AS puc
INNER JOIN (
    SELECT 
        product_num,
        MAX(uc_product_updateAt) AS max_update_time
    FROM 
        product_update_recode
    GROUP BY 
        product_num
) AS latest
ON puc.product_num = latest.product_num 
AND puc.uc_product_updateAt = latest.max_update_time
WHERE 
    puc.product_num IN (
        SELECT DISTINCT puc.product_num
        FROM product_update_recode puc
        LEFT JOIN cart c ON puc.uc_product_num = c.uc_product_num
        WHERE c.user_id = ? and c.cart_isPayment='N'
    )
        ORDER BY 
    puc.product_num asc
`,

  //   T3: `SELECT
  //     sub1.uc_product_num,
  //     sub1.uc_product_price,
  //     sub1.uc_product_name,
  //     sub2.cart_isPayment
  // FROM
  // (
  //     SELECT
  //     puc.*
  // FROM
  //     product_update_recode AS puc
  // INNER JOIN (
  //     SELECT
  //         product_num,
  //         MAX(uc_product_updateAt) AS max_update_time
  //     FROM
  //         product_update_recode
  //     GROUP BY
  //         product_num
  // ) AS latest
  // ON puc.product_num = latest.product_num
  // AND puc.uc_product_updateAt = latest.max_update_time
  // WHERE
  //     puc.product_num IN (
  //         SELECT DISTINCT puc.product_num
  //         FROM product_update_recode puc
  //         LEFT JOIN cart c ON puc.uc_product_num = c.uc_product_num
  //         WHERE c.user_id = ?
  //     )

  // ) AS sub1

  // INNER JOIN (
  //     SELECT
  //         puc.product_num,
  //         MAX(puc.uc_product_num) AS uc_product_num,
  //         MAX(puc.uc_product_price) AS uc_product_price,
  //         MAX(puc.uc_product_name) AS uc_product_name,
  //         MAX(c.cart_isPayment) AS cart_isPayment
  //     FROM
  //         product_update_recode AS puc
  //     LEFT JOIN cart AS c
  //         ON puc.uc_product_num = c.uc_product_num

  //     WHERE
  //         c.cart_isPayment = 'N' AND c.user_id = ?
  //     GROUP BY puc.product_num, c.cart_isPayment
  // ) AS sub2
  //     ON sub1.product_num = sub2.product_num
  // `,
};

const deleteEachCart = `delete from cart where user_id=? and  cart_num=? and  packing_cart_num=?`;

const deleteAllCart = `delete from cart where user_id=?`;

const selectMyCartListTransaction = {
  selectListMyCart: selectMyCartListTransactionKye.T1,
  oldProductInfo: selectMyCartListTransactionKye.T2,
  productUpdateCheck: selectMyCartListTransactionKye.T3,
};

module.exports = {
  selectMyCartListTransaction,
  insertFirstAddCartTransaction,
  insertFirstAddCartSubTransaction,
  deleteEachCart,
  deleteAllCart
};
