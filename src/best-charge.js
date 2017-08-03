//转换清单格式并计算小计
function toTags(inputs) {
  var allItems=loadAllItems();
  var tagsInfo=[];
  for (let item of inputs){
    tagsInfo.push({id:item.split(' x ')[0],count:item.split(' x ')[1]});
  }
  for (let tag of tagsInfo)
    for (let item of allItems)
      if (tag.id==item.id){
        tag.name=item.name;
        tag.price=item.price;
        tag.sum=tag.price*tag.count;
      }
  return tagsInfo;
}

//计算第一种优惠方式(满30减6元）
function do30_6(tagsInfo) {
  var summary={sum:0,save:0};
  for (let tag of tagsInfo){
    summary.sum+=tag.sum;
  }
  if (summary.sum>=30){
    summary.save=6;
    summary.sum-=6;
  }
  return summary;
}

//计算第二种优惠方式(指定商品半价)
function doHalf(tagsInfo) {
  var summary={sum:0,save:0,name:[]};
  var promotions=loadPromotions()[1].items;
  for(let tag of tagsInfo){
    summary.sum+=tag.sum;
    if(promotions.includes(tag.id)){
      summary.save+=tag.sum/2;
      summary.name.push(tag.name);
    }
  }
  summary.sum-=summary.save;
  return summary;
}

//打印清单
function printReceipt(summary_1,summary_2,tagsInfo) {
  var sum=0;
  var receipt='============= 订餐明细 =============\n';
  for (let tag of tagsInfo){
    receipt+=`${tag.name} x ${tag.count} = ${tag.sum}元\n`;
  }
  if(summary_1.save!=0||summary_2.save!=0){
    receipt+='-----------------------------------\n使用优惠:\n';
    if(summary_2.sum>summary_1.sum){
      receipt+=`满30减6元，省6元\n`;
      sum=summary_1.sum;
    }else{
      receipt+=`指定菜品半价(${summary_2.name[0]}`;
      for (let i=1;i<summary_2.name.length;i++)
        receipt+=`，${summary_2.name[i]}`;
      receipt+=`)，省${summary_2.save}元\n`;
      sum=summary_2.sum;
    }
  }else{
    sum=summary_1.sum;
  }
  receipt+=`-----------------------------------\n总计：${sum}元\n===================================`;
  return receipt;
}

function bestCharge(selectedItems) {
    var tagsInfo=toTags(selectedItems);
    var summary_1=do30_6(tagsInfo);
    var summary_2=doHalf(tagsInfo);
    var receipt=printReceipt(summary_1,summary_2,tagsInfo);
    return receipt;
}
