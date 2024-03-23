
const express = require("express");
const router = express.Router();


const mongoose = require("mongoose");
const moment=require("moment");
const Booking = require("../models/Booking");


const textflow = require('textflow.js');
textflow.useKey("9XOZJ6wUO4o5lzALIqAno91g92lKAIqsCSXgrIHoMmNr4k3J2GSq9C8gRysRuHCI");

const bookingControllers=require("../controllers/bookingControllers")
const serviceControllers=require("../controllers/serviceControllers")
const adminControllers=require("../controllers/adminControllers")



function findConsecutiveGroups(nums, groupSize) {
    nums.sort((a, b) => a - b);
    const result = [];
    
    for (let i = 0; i < nums.length - groupSize + 1; i++) {
        let isConsecutive = true;
        for (let j = 1; j < groupSize; j++) {
            if (nums[i + j] !== nums[i + j - 1] + 1) {
                isConsecutive = false;
                break;
            }
        }      
        if (isConsecutive) {
            result.push(nums.slice(i, i + groupSize));
        }
    }
    
    return result;
}

// function removeWithoutCopy(arr, item) {
//     for (var i = 0; i< arr.length;i++){
//       if(arr[i] === item){
//        arr.splice(i,1);
//         i--;
//      }
//     }
//     return arr;
// }

const removePeriod=(period,time,totaltime)=>{
    let idx=0
    period.map((item,index)=>{
        if(item==time){
           idx= index
        }
      
    })
    console.log(idx)
    period.splice(idx,totaltime+1)
    return period

}

module.exports=(app)=>{
    const ChosenDate=require("../models/ChosenDate");
    const Booking=require("../models/Booking")
    const Description=require("../models/Description")
    app.use(router)

    app.get('/getServices',serviceControllers.getServices)

    app.post('/getDescription',serviceControllers.getDescription)
   
    app.post('/getAvailableTime',bookingControllers.getAvailableTime)

    app.post("/submitBooking",bookingControllers.submitBooking)

    app.post('/getTimeByAdmin',bookingControllers.getTimeByAdmin)

    app.post('/getAllBookings',bookingControllers.getAllBookings)

    app.post('/setTimeUnavailable',bookingControllers.setTimeUnavailable)

    app.post('/getBookingsByMonths',bookingControllers.getBookingsByMonths)

    app.post('/getBookingsByDates',bookingControllers.getBookingsByDates)

    app.post('/getBookingsByEmail',bookingControllers.getBookingsByEmails)

    // app.post('/getBookingsByPhone',async(req,res)=>{
    //     let phone=req.body.phone
    //     console.log(phone)
       
    //     const bookings=await Booking.find({
    //        phoneNumber:phone
    //     })
    //     if(bookings.length!=0){
   
    //         res.send({
    //             message:"success",
    //             flag:true,
    //             bookings:bookings
    //         })
    //     }else{
    //         res.send({
    //             message:"no bookings",
    //             flag:false
    //         })
    //     }
    // })


    app.post('/deleteBooking',bookingControllers.deleteBooking)

    app.post('/login',adminControllers.login)

    app.post('/sendCode',adminControllers.sendCode)

    app.post('/verifyCode',adminControllers.verifyCode)

    // Description.create({
    //     title:"Regular Detailing",
    //     description:[
    //         "Vacuum Interior (Carpets,  Mats, Seats & Boot )",
    //         "Interior Window Cleaned",
    //         "Dashboard Cleaned",
    //         "Door & Boot Jambs cleaned",
    //         "More Extensive Vacuum On Carpet & Mats using powerful tools",
    //         "Foam Wash Pre-Rinse (Softens excessive dirt & road grime to reduce the risk of scratching the paint)",
    //         "PH Neutral Foam Wash ( Safe For Ceramic Coating )",
    //         "Non-Acidic Wheel Clean",
    //         "Exterior Windows & Body Dried & Waxed",
    //         "Non-Greasy Tyre Shine Applied",
    //     ]
    // })

    // Description.create({
    //     title:"Interior Detailing",
    //     description:[
    //         "Vacuum Interior (Carpets,  Mats, Seats & Boot )",
    //         "Excessive Animal Hair & Sand Removed ",
    //         "Sterilizes the interior with steam to eliminate unwanted germs & bacteria",
    //         "Steam clean Doors",
    //         "Steam clean All Cup-holders, Dashboard & Console.",
    //         "Shampoo & extraction of carpet & seats",
    //         "Shampoo the mats and washed ",
    //         "Lether seats steam cleaned and conditioned",
    //         "Protection to all interior panels ( Dash | Console | Door panels | Cup-holders )",
    //         "Interior Window Cleaned",
    //     ]
    // })

    // Description.create({
    //     title:"Exterior Detailing",
    //     description:[
    //         "Foam Wash Pre-Rinse (Softens excessive dirt & road grime to reduce the risk of scratching the paint)",
    //         "PH Neutral Foam Wash ( Safe For Ceramic Coating )",
    //         "Non-Acidic Wheel Clean & Detailed",
    //         "HAO'S Signature Decontamination Treatment (iron removal with clay bar finish)",
    //         "Exterior Windows & Body Dried",
    //         "Hand or Machine polish",
    //         "Paint enhancement with Hydrophobic & SiO2 coating, which delivers EXTREME  ",
    //         "water beading & chemical resistant protection",
    //         "Plastics & rubbers glossed",
    //         "Non-Greasy Tyre Shine Applied",
    //     ]
    // })

    // Description.create({
    //     title:"Full Detailing",
    //     description:[
    //         "Vacuum Interior (Carpets, Mats, Seats & Boot )",
    //         "Excessive Animal Hair & Sand Removed ",
    //         "Shampoo & extraction of carpet & seats",
    //         "Lether seats cleaned and conditioned",
    //         "Clean all interior panels ( Dash | Console | Door panels | Cup-holders )",
    //         "Interior Window Cleaned",
    //         "Foam Wash Pre-Rinse (Softens excessive dirt & road grime to reduce the risk of scratching the paint)",
    //         "PH Neutral Foam Wash ( Safe For Ceramic Coating )",
    //         "Non-Acidic Wheel Clean & Detailed",
    //         "HAO'S Signature Decontamination Treatment (iron removal with clay bar finish)",
    //         "Exterior Windows & Body Dried",
    //         "Hand or Machine polish",
    //         "Paint enhancement with Hydrophobic & SiO2 coating, which delivers EXTREME  ",
    //         "water beading & chemical resistant protection",
    //         "Plastics & rubbers glossed",
    //         "Non-Greasy Tyre Shine Applied",
    //     ]
    // })

    // Description.create({
    //     title:"Pre-sale Detailing or Used Car Buyer's Option",
    //     description:[
    //         "Vacuum Interior (Carpets, Mats, Seats & Boot )",
    //         "Excessive Animal Hair & Sand Removed ",
    //         "Sterilizes the interior with steam to eliminate unwanted germs & bacteria",
    //         "Steam clean Doors",
    //         "Steam clean All Cup-holders, Dashboard & Console",
    //         "Shampoo & extraction of carpet & seats",
    //         "Lether seats steam cleaned and conditioned",
    //         "Protection to all interior panels ( Dash | Console | Door panels | Cup-holders )",
    //         "Interior Window Cleaned",
    //         "Foam Wash Pre-Rinse (Softens excessive dirt & road grime to reduce the risk of scratching the paint)",
    //         "PH Neutral Foam Wash ( Safe For Ceramic Coating )",
    //         "Non-Acidic Wheel Clean & Detailed",
    //         "Engine bay cleaned",
    //         "HAO’S Signature Decontamination Treatment (iron removal with clay bar finish)",
    //         "Exterior Windows & Body Dried",
    //         "Hand or Machine polish",
    //         "Paint enhancement with Hydrophobic & SiO2 coating, which delivers EXTREME ",
    //         "water beading & chemical resistant protection",
    //         "Plastics & rubbers glossed",
    //         "Non-Greasy Tyre Shine Applied"
    //     ]
    // })

    // Service.create({
    //     type:"Saden",
    //     fullTitle:'Sedan & Hatchback',
    //     service:[
    //         {name:"Regular Detailing",price:100,time:1},
    //         {name:"Interior Detailing",price:200,time:2},
    //         {name:"Exterior Detailing",price:200,time:2},
    //         {name:"Full Detailing",price:270,time:3.5},
    //         {name:"Pre-sale Detailing or Used Car Buyer's Option",price:350,time:4}
            
    //     ]
    // })

    // Service.create({
    //     type:"SUV",
    //     fullTitle:'SUV & UTE',
    //     service:[
    //         {name:"Regular Detailing",price:110,time:1},
    //         {name:"Interior Detailing",price:220,time:2},
    //         {name:"Exterior Detailing",price:220,time:2},
    //         {name:"Full Detailing",price:310,time:3.5},
    //         {name:"Pre-sale Detailing or Used Car Buyer's Option",price:"400",time:4.5},
    //     ]
    // })
    // Service.create({
    //     type:"VAN",
    //     fullTitle:'7-Seater, Van & Light Truck',
    //     service:[
    //         {name:"Regular Detailing",price:123,time:1.5},
    //         {name:"Interior Detailing",price:240,time:2.5},
    //         {name:"Exterior Detailing",price:240,time:2.5},
    //         {name:"Full Detailing",price:350,time:4},
    //         {name:"Pre-sale Detailing or Used Car Buyer's Option",price:450,time:5}
            
    //     ]
    // })

    // Admin.create({
    //     userName:'zhJia/Peter',
    //     password:'7355608zhj',
    //     phone:'61478618287'
    // })

    // Admin.create({
    //     userName:'jzyoung0122',
    //     password:'448918LUCKy&',
    //     phone:'61404537609'
    // })
}