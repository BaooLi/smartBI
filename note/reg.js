let util = {
    // 返回值：增减后的日期，格式：20171103
    // addDayCount: 增减的日期，可以是：0（今日），-1（昨日），30（30日后）
    getDateAddOrMinus: (addDayCount) => {
        let dd = new Date()
        dd.setDate(dd.getDate() + addDayCount)
        let y = dd.getFullYear()
        let m = dd.getMonth() + 1
        let d = dd.getDate()
        let mStr = ''
        let dStr = ''
        if (m < 10) {
            mStr = '0' + m
        } else {
            mStr = m.toString()
        }
        if (d < 10) {
            dStr = '0' + d
        } else {
            dStr = d.toString()
        }
        return y.toString() + mStr + dStr
    },
    // 返回值：一个数组，包含2个日期之间所有的天
    // startDateStr 和 endDateStr 格式：20171011
    getDaysBetweenArr: (startDateStr, endDateStr) => {
        var t1 = startDateStr.substr(0, 4) + '-' + (startDateStr.substr(4, 2)) + '-' + startDateStr.substr(6, 2) + ' 00:00:00'
        var t2 = endDateStr.substr(0, 4) + '-' + (endDateStr.substr(4, 2)) + '-' + endDateStr.substr(6, 2) + ' 23:00:00'
        var bd = new Date(t1.replace(/-/g, '/'))
        var be = new Date(t2.replace(/-/g, '/'))
        var bdTime = bd.getTime()
        var betime = be.getTime()
        var timediff = betime - bdTime
        var rangeDate = []
        for (var i = 0; i <= timediff; i += 86400000) {
            var ds = new Date(bdTime + i)
            var y = ds.getFullYear()
            var m = ds.getMonth() + 1 >= 10 ? ds.getMonth() + 1 : ('0' + (ds.getMonth() + 1))
            var d = ds.getDate() >= 10 ? ds.getDate() : ('0' + ds.getDate())
            rangeDate.push(y + '' + m + '' + d)
        }
        return rangeDate
    },
    // 返回值：根据日期格式：20171103，返回日期对象
    // dateStr格式：20171011
    getDateObj: (dateStr) => {
        let dateObj = new Date(dateStr.substr(0, 4), dateStr.substr(4, 2) - 1, dateStr.substr(6, 2))
        return dateObj
    },
    // 返回当前日期的年月日，格式：20170907
    getCuryyyyMMdd: () => {
        let dateObj = new Date()
        let yearStr = dateObj.getFullYear()
        let monthStr = dateObj.getMonth() + 1 >= 10 ? dateObj.getMonth() + 1 : '0' + (dateObj.getMonth() + 1)
        let dayStr = dateObj.getDate() >= 10 ? dateObj.getDate() : '0' + dateObj.getDate()
        return yearStr.toString() + monthStr + dayStr
    },
    // 返回日期字符串，格式：20170908
    // 参数：日期对象
    getDateStr: (dateObj) => {
        let y = dateObj.getFullYear()
        let m = dateObj.getMonth() + 1
        let d = dateObj.getDate()
        let mStr = ''
        let dStr = ''
        if (m < 10) {
            mStr = '0' + m
        } else {
            mStr = m.toString()
        }
        if (d < 10) {
            dStr = '0' + d
        } else {
            dStr = d.toString()
        }
        return y.toString() + mStr + dStr
    },
    // 返回日期字符串，格式：20170908
    // 参数：日期对象
    getyyyyMMdd: (dateObj) => {
        let y = dateObj.getFullYear()
        let m = dateObj.getMonth() + 1
        let d = dateObj.getDate()
        let mStr = ''
        let dStr = ''
        if (m < 10) {
            mStr = '0' + m
        } else {
            mStr = m.toString()
        }
        if (d < 10) {
            dStr = '0' + d
        } else {
            dStr = d.toString()
        }
        return y.toString() + mStr + dStr
    },
    // 获取指定日期前一天
    getYesterday: (d) => {
        d = new Date(d)
        d = +d - 1000 * 60 * 60 * 24
        d = new Date(d)
        var year = d.getFullYear()
        var mon = d.getMonth() + 1
        var day = d.getDate()
        let s = year.toString() + (mon < 10 ? ('0' + mon) : mon) + (day < 10 ? ('0' + day) : day)
        return s
    },
    getLastNdays: (d, n) => {
        d = new Date(d)
        d = +d - 1000 * 60 * 60 * 24 * n
        d = new Date(d)
        var year = d.getFullYear()
        var mon = d.getMonth() + 1
        var day = d.getDate()
        let s = year.toString() + (mon < 10 ? ('0' + mon) : mon) + (day < 10 ? ('0' + day) : day)
        return s
    }
}
module.exports= util
