const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type:String,
    service:[{
        name:String,
        price:Number,
        time:Number
    }]
    
});

// 实例化模型
const Service = mongoose.model('Service', schema);

// 导出模型
module.exports = Service;