const checkoutNewProduct = `select p.onedayclass_num as  onedayclass_num from product_policy  as p where p.onedayclass_num =?`;

const selectListMyProduct = `select * From product as p  where p.product_policy_num=?`;

const selectListMyImage = `select Image_file,image_name from productImage where product_num=?`;

const insertNewProductTransactionKey = {
  T1: `insert into	product( product_name, product_price, product_mainImage,	product_policy_num,	show_status,product_intro) values(?,?,?,?,?,?) `,
  T2: `select  max(product_num) as product_num from  product  where product_policy_num=? `,
  T3: `insert into	productImage( product_num, Image_file, image_name) values(?,?,?)`,
  T4: `insert into product_update_recode (product_num,uc_product_name,uc_product_price,uc_product_mainImage,uc_show_status,uc_product_intro) values(?,?,?,?,?,?)`,
};
const insertNewProductTransaction = {
  insertProductInfo: insertNewProductTransactionKey.T1,
  selectOneProductNum: insertNewProductTransactionKey.T2,
  insertImageInfo: insertNewProductTransactionKey.T3,
  insertUpdateRecordProductInfo: insertNewProductTransactionKey.T4,
};

const updateProductTransactionKey = {
  T0: `select min(productImage_num) as productImage_num from productImage where product_num=? `,
  T1: `update	product set  product_name=?, product_price=? , product_mainImage=? ,	 update_At=current_timestamp ,	show_status=?   where product_num=?   `,
  T2: `update productImage set Image_file=? ,  image_name=?    , update_At=current_timestamp    where product_num=? and productImage_num=?`,
  T3: `insert into product_update_recode (product_num,uc_product_name,uc_product_price,uc_product_mainImage,uc_show_status) values(?,?,?,?,?)`,
};
const updateProductTransaction = {
  selectOneProductImage_num: updateProductTransactionKey.T0,
  upDateProductInfo: updateProductTransactionKey.T1,
  updateImageInfo: updateProductTransactionKey.T2,
  insertUpdateRecordProductInfo: updateProductTransactionKey.T3,
};

module.exports = {
  checkoutNewProduct,
  insertNewProductTransaction,
  selectListMyProduct,
  selectListMyImage,
  updateProductTransaction,
};
