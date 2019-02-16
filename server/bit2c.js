/*
This algorithm calculates the expected return on investment when executing a market order in a fiat-to-crypto trading pair
on a peer-to-peer exchange platform.
Input: 
(1) Orderbook
(2) Desired sum for purchase

Output: 
(1) The aggregated expected return in Bitcoins (or fractions of Bitcoins)
(2) The total sum that would have been spent in fiat currency


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
    let ordersExecutedFully = { orders: [], num: 0 };
    let ordersExecutedPartially = { orders: [], num: 0 };
    
    let sumLeftInNis = sumForPurchaseInNis;
    let aggregatedReturnInCrypto = 0;
  
    while(orderBook.asks.length>0 && sumLeftInNis>0){
  for (order of orderBook.asks) {
    // TODO make sure array is sorted
    let orderRate = order[0];
    let orderQuantityInCrypto = order[1];
    OrderValueInNis = orderRate * orderQuantityInCrypto;

    if (sumLeftInNis >= OrderValueInNis) {
      sumLeftInNis -= OrderValueInNis;
      aggregatedReturnInCrypto += orderQuantityInCrypto;
      ordersExecutedFully.orders.push(order[0], order[1], order[2], 100);
      ordersExecutedFully.num++;
    }
    if (sumLeftInNis < OrderValueInNis && sumLeftInNis > 0) {
      percentsOfOrderUserCanAfford = (sumLeftInNis * 100) / orderRate;
      aggregatedReturnInCrypto +=
        (percentsOfOrderUserCanAfford / 100) * orderQuantityInCrypto;
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
        aggregatedReturnInCrypto,
        sumForPurchaseInNis,
        ordersExecutedFully,
        ordersExecutedPartially
      };
    }
  }
};
}
let temp = getROIfromMarketBuyOrder(Bit2CBook, 500);
console.log(temp);
console.log(temp.ordersExecutedFully.orders)
console.log(temp.ordersExecutedPartially.orders)
