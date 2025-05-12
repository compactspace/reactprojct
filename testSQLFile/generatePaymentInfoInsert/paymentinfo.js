const fs = require("fs");

const sparseMonths = [2, 4, 7, 9, 11];
const years = [2023, 2024, 2025];
let output = "";

for (let i = 0; i < 1000; i++) {
  const year = years[Math.floor(Math.random() * years.length)];
  const month = String(sparseMonths[Math.floor(Math.random() * sparseMonths.length)]).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const hour = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minute = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  const second = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  const ms = String(Math.floor(Math.random() * 1000)).padStart(3, "0");

  const payment_complete_num = Math.floor(Math.random() * 100) + 1;
  const user_id = `user${Math.floor(Math.random() * 1000)}`;
  const merchant_num = `merchant${Math.floor(Math.random() * 10000)}`;
  const row_total_quantity = Math.floor(Math.random() * 10) + 1;
  const row_total_price = row_total_quantity * (Math.floor(Math.random() * 10000) + 1000);
  const uc_product_num = Math.floor(Math.random() * 500) + 1;

  const dateStr = `${year}-${month}-${day} ${hour}:${minute}:${second}.${ms}`;

  output += `INSERT INTO paymentinfo (payment_complete_num, user_id, merchant_num, row_total_quantity, row_total_price, uc_product_num, payment_createAt) VALUES (${payment_complete_num}, '${user_id}', '${merchant_num}', ${row_total_quantity}, ${row_total_price}, ${uc_product_num}, '${dateStr}');\n`;
}

fs.writeFileSync("insert_paymentinfo.sql", output);
