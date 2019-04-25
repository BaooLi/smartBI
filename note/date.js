let util = require('./reg')
class MyDate extends Date{
    constructor(){
        super();
    }
    getDateAddOrMinus(addDayCount){
        return util.getDateAddOrMinus(addDayCount)
    }
    getDaysBetweenArr(startDateStr, endDateStr){
        return util.getDaysBetweenArr(startDateStr, endDateStr)
    }
}
export default MyDate
// let f=new MyDate();
// console.log(f.getFullYear());
// let res1=f.getDaysBetweenArr('20190401','20190415')
// let res2=f.getDateAddOrMinus(-1);
// console.log(res1);
// console.log(res2);

