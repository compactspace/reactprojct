const getActivePromotions = `
SELECT
	*
FROM
	onedayclass AS oc
RIGHT JOIN (
	SELECT
		sub.application_paid_at,
		pc.promotion_income_num,
		pc.promotion_confirm_status,
		sub.onedayclass_num,
		sub.max_paid,
		sub.income_price,
		sub.promotion_start_date,
		sub.promotion_end_date
	FROM (
		SELECT
			max(income_price) as income_price,
			application_paid_at,
			max(promotion_income_num) as promotion_income_num,
			onedayclass_num,
			MAX(application_paid_at) AS max_paid,
			max(promotion_start_date) as promotion_start_date,
			max(promotion_end_date) as promotion_end_date
		FROM
			promotion_income as pi
		GROUP BY
			onedayclass_num
	) AS sub  -- promotion_income 테이블을 기준으로 지불 날짜의 최신이력을 가져온다.
	
	RIGHT JOIN promotion_confirm AS pc   -- 그리고 그 서브쿼리와 롸이트조인을 붙인다.
	ON sub.promotion_income_num = pc.promotion_income_num
	
	
) AS promo_snapshot  -- 위 연산이 끝난뒤 promotion_income 의 지불 최신 이력과 컨펌이력을 가져온다.
ON oc.onedayclass_num = promo_snapshot.onedayclass_num
`;

const PromotionsSearchKeyWord = {
  default:
    "WHERE promo_snapshot.promotion_confirm_status = ?  AND oc.onedayclass_num IS NOT NULL  and promo_snapshot.max_paid  LIKE ? ",
};

module.exports = {
  getActivePromotions,
  PromotionsSearchKeyWord,
};
