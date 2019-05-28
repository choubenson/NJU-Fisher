//此云函数用于确认商品交易成功，event.commodityId传入商品id
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    return await db.collection('shangpin').where({
      _id: event.commodityId
    })
      .update({
        data: {
          state: 1
        },
      })
  } catch (e) {
    console.error(e)
  }
}