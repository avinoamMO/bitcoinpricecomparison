/*
This algorithm calculates the expected return on investment when executing a market order in a fiat-to-crypto trading pair
on a peer-to-peer exchange platform.
Input: 
(1) Orderbook
(2) Desired sum for purchase
Output: 
(1) The aggregated expected return in Bitcoins (or fractions of Bitcoins)
(2) The total many that would have been spent in fiat currency
(3) An object with an array of the orders executed fully
(4) An object with an array of the orders executed partially with the percent of the order that has been executed

*/
let Bit2CBook = {
  asks: [
    [10000, 0.1, 1550166113],
    [10000, 0.1, 1550165250],
    [10000, 0.1, 1550165309],
    [10000, 0.1, 1550168263],
    [10000, 0.1, 1550168260],
    [10000, 0.1, 1550166113],
    [10000, 0.1, 1550165250],
    [10000, 0.1, 1550165309],
    [10000, 0.1, 1550168263],
    [10000, 0.1, 1550168260]
  ],
  bids: [
    [10000, 0.1, 1550166113],
    [10000, 0.1, 1550165250],
    [10000, 0.1, 1550165309],
    [10000, 0.1, 1550168263],
    [10000, 0.1, 1550168260],
    [10000, 0.1, 1550166113],
    [10000, 0.1, 1550165250],
    [10000, 0.1, 1550165309],
    [10000, 0.1, 1550168263],
    [10000, 0.1, 1550168260]
  ]
};

getROIfromMarketBuyOrder = (orderBook, sumForPurchaseInNis) => {
  let sumLeftInNis = sumForPurchaseInNis;
  let aggregatedReturnInBtc = 0;
  let ordersExecutedFully = { orders: [], num: 0 };
  let ordersExecutedPartially = { orders: [], num: 0 };

  for (order of orderBook.asks) {
    // TODO make sure array is sorted
    let orderRate = order[0];
    let orderQuantityInBtc = order[1];
    OrderValueInNis = orderRate * orderQuantityInBtc;

    if (sumLeftInNis >= OrderValueInNis) {
      sumLeftInNis -= OrderValueInNis;
      aggregatedReturnInBtc += orderQuantityInBtc;
      ordersExecutedFully.orders.push(order[0], order[1], order[2], 100);
      ordersExecutedFully.num++;
    }
    if (sumLeftInNis < OrderValueInNis && sumLeftInNis > 0) {
      percentsOfOrderUserCanAfford = (sumLeftInNis * 100) / orderRate;
      aggregatedReturnInBtc +=
        (percentsOfOrderUserCanAfford / 100) * orderQuantityInBtc;
      sumLeftInNis -= (percentsOfOrderUserCanAfford / 100) * OrderValueInNis;
      ordersExecutedPartially.orders.push(
        order[0],
        order[1],
        order[2],
        percentsOfOrderUserCanAfford
      );
      ordersExecutedPartially.num++;
    }
    if (sumLeftInNis === 0 || orderBook.asks.length === 0) {
      console.log("finishing up here");
      return {
        aggregatedReturnInBtc,
        sumForPurchaseInNis,
        ordersExecutedFully,
        ordersExecutedPartially
      };
    }
  }
};
let temp = getROIfromMarketBuyOrder(Bit2CBook, 10000);
console.log(temp);
