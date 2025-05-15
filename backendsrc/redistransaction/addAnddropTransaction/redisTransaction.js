// 장바구니 큐 + 프록시 설정
let eventArr = [];

let handler = {
  set(target, prop, value) {
    if (!isNaN(prop)) {
      scheduleEventExecution(value);
    }
    return Reflect.set(target, prop, value);
  },
};

let proxiedArray = new Proxy(eventArr, handler);

// 📦 장바구니 담기
module.exports.addEventProductCart = async (req, res, client) => {
  const userid = req.session.userid;
  const { proCode } = req.body;

  const eventKey = `${userid}_ADD_${proCode}_${Date.now()}`;

  proxiedArray.push({
    eventKey,
    eventAction: () => tryAddProduct(client, proCode, userid),
  });

  res.json({ addStatus: "queued" });
};

// ❌ 장바구니 삭제
module.exports.deleteEventProductCart = async (req, res, client) => {
  const userid = req.session.userid;
  const { proCode } = req.body;

  const eventKey = `${userid}_DEL_${proCode}_${Date.now()}`;

  proxiedArray.push({
    eventKey,
    eventAction: () => tryDeleteProduct(client, proCode, userid),
  });

  res.json({ deleteStatus: "queued" });
};

// 트랜잭션 처리 - 담기
const tryAddProduct = async (client, proCode, userid) => {
  await client.watch(`pro${proCode}`);

  const existing = await client.hGet(`${userid}`, `pro${proCode}`);
  if (existing !== null) {
    await client.unwatch();
    return "already-added";
  }

  const qty = await client.hGet(`pro${proCode}`, "proQuantity");
  if (qty === null || parseInt(qty) <= 0) {
    await client.unwatch();
    return "no-stock";
  }

  const tx = client.multi();
  tx.hSet(`${userid}`, `pro${proCode}`, JSON.stringify({ addedAt: Date.now() }));
  tx.hIncrBy(`pro${proCode}`, "proQuantity", -1);

  const execResult = await tx.exec();
  return execResult === null ? null : "success";
};

// 트랜잭션 처리 - 삭제
const tryDeleteProduct = async (client, proCode, userid) => {
  await client.watch(`pro${proCode}`);

  const tx = client.multi();
  tx.hDel(`${userid}`, `pro${proCode}`);
  tx.hIncrBy(`pro${proCode}`, "proQuantity", 1);

  const execResult = await tx.exec();
  return execResult === null ? null : "success";
};

// 큐 실행 + 재시도 로직
async function scheduleEventExecution(eventItem, retry = 0) {
  const { eventKey, eventAction } = eventItem;

  try {
    const result = await eventAction();

    if (["success", "already-added", "no-stock"].includes(result)) {
      const index = eventArr.findIndex((e) => e.eventKey === eventKey);
      if (index !== -1) eventArr.splice(index, 1);
    } else {
      if (retry < 3) {
        setTimeout(() => {
          scheduleEventExecution(eventItem, retry + 1);
        }, 100);
      } else {
        console.error(`재시도 초과: ${eventKey}`);
      }
    }
  } catch (error) {
    console.error(`실행 중 에러: ${error.message}`);
    if (retry < 3) {
      setTimeout(() => {
        scheduleEventExecution(eventItem, retry + 1);
      }, 100);
    }
  }
}

