const selectOneUnitProductInfo = `select
	min(product_num) as product_num
	,
	product_name,
	product_price,
	product_mainImage,
	onedayclass_num,
	show_status
	
from
	product as p
left join product_policy as pp on
	p.product_policy_num = pp.product_policy_num
where
	pp.onedayclass_num = ?`;

const selectListProductImage = `select * from   productImage  where product_num=?`;

module.exports = {
  selectOneUnitProductInfo,
  selectListProductImage,
};
