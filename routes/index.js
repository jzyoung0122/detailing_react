const sgMail=require('@sendgrid/mail')

require('dotenv').config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const express = require("express");
const router = express.Router();


const mongoose = require("mongoose");
const moment=require("moment");
const Booking = require("../models/Booking");
const Service = require("../models/Services");
const Admin=require("../models/Admin")
const textflow = require('textflow.js');
textflow.useKey("9XOZJ6wUO4o5lzALIqAno91g92lKAIqsCSXgrIHoMmNr4k3J2GSq9C8gRysRuHCI");



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

    app.get('/getServices',async(req,res)=>{
        const services= await Service.find()
        console
        res.send(services)
    })
   
    app.post('/getAvailableTime',async(req,res)=>{
        var chosenDate=new Date(req.body.date);
        const {totalTime}=req.body;   
        let available=true
        let availableTime=[] 
        
        const date=await ChosenDate.findOne({"date":chosenDate})
        if(!date){
            const newDate= await ChosenDate.create({
                date: chosenDate,
                ifAvailable: true,
                period:[0,1,2,3,4,5,6,7,8,9,10,11]
            })
            let availablePeriods=findConsecutiveGroups([0,1,2,3,4,5,6,7,8,9,10,11],Math.ceil(totalTime+1))
            if(availablePeriods.length>0){
                for(let period of availablePeriods){
                    availableTime.push(period[0])
                }
            }else{
                available=false
            }
       
        }else{
            let availablePeriods=findConsecutiveGroups(date.period,Math.ceil(totalTime+1))
            if(availablePeriods.length>0){
                for(let period of availablePeriods){
                    availableTime.push(period[0])
                }
            }else{
                available=false
            }        
        }
        const data={
            message:"success",
            flag:true,
            available:available,
            availableTime:availableTime
        }
        res.send(data)
    })

    app.post('/getTimeByAdmin',async(req,res)=>{
        var chosenDate=new Date(req.body.date);
        // console.log("拿到数据了",chosenDate,totalTime)
       
        let available=true
        let availableTime=[] 
        
        const date=await ChosenDate.findOne({"date":chosenDate})
        if(!date){
            const newDate= await ChosenDate.create({
                date: chosenDate,
                ifAvailable: true,
                period:[0,1,2,3,4,5,6,7,8,9,10,11]
            })
         availableTime=[0,1,2,3,4,5,6,7,8,9,10,11]
       
        }else{
            let availablePeriods=date.period
            if(availablePeriods.length>0){
                for(let period of availablePeriods){
                    availableTime.push(period)
                }
            }else{
                available=false
            }        
        }
        const data={
            message:"success",
            flag:true,
            available:available,
            availableTime:availableTime
        }
        res.send(data)
    })


    app.post("/submitBooking",async(req,res)=>{
        // let form= req.body.form
        // let chosenTime=req.body.chosenTime
        // let chosenDate=new Date(req.body.chosenDate)
        // let totalTime=req.body.totalTime
        // let checkboxGroup1=req.body.checkboxGroup1
        // let checkboxGroup2=req.body.checkboxGroup2
        // let checkboxGroup3=req.body.checkboxGroup3

        // let {form,chosenTime,chosenDate,totalTime,checkboxGroup1,checkboxGroup2,checkboxGroup3}=req.body
        // chosenDate=new Date(chosenDate)
        // console.log(chosenDate)

        let{date,time,timeForMailContent,serviceList,firstName,lastName,phoneNumber,email,address,totalTime,totalCost}=req.body
        let chosenDate =new Date(date)
        const availableTime=await ChosenDate.findOne({date:date})
        console.log(date)
        if(availableTime.period.includes(time)){
            const booking= await Booking.create({         
                time:time,
                date:chosenDate,
                serviceList:serviceList,
                firstName:firstName,
                lastName:lastName,
                phoneNumber:phoneNumber,
                email:email,
                address:{
                 address1:address.address1,
                 address2:address.address2,
                 suburb:address.suburb,
                 state:address.state,
                 postCode:address.postCode
                },
                totalTime:totalTime,
                delete:false
             })
     
             //update available time
             const date= await ChosenDate.findOne({date:chosenDate})
             let period=date.period
            removePeriod(period,time,totalTime)
             await ChosenDate.updateOne({date:chosenDate},{period:period})
            
             let serviceContent='';
             for(let item of serviceList){
                let tmpContent='';
               
                for(let i=0;i<item.selected.length;i++){
                    if(i==item.selected.length-1){
                        tmpContent +=item.selected[i].name 
                    }else{
                        tmpContent=tmpContent+item.selected[i].name+','
                    }                        
                }
                 serviceContent=serviceContent+' '+tmpContent+` for ${item.type.toLowerCase()}.`
             }

             const msg = {
                to: email,
                from: 'jzyoung0122@gmail.com', // Use the email address or domain you verified above
                templateId: process.env.TEMPLATE_ID,
                dynamicTemplateData:{
                    time:timeForMailContent,
                    services:serviceContent,
                    totalcost:totalCost 
                }
              };
              
              const sendMail=async () => {                 
                  try {
                    await sgMail.send(msg);
                  } catch (error) {
                    console.error(error);
                
                    if (error.response) {
                      console.error(error.response.body)
                    }
                  }
              }

             sendMail()
             res.send({message:"success",flag:true})

        }else{
            console.log("unavailable")
            res.send({message:"sorry,seems like the time has been chosen by someone else before you submit",
            flag:false})
            
        }
   
    })

    app.post('/getAllBookings',async(req,res)=>{
        let bookings=await Booking.find({})
        console.log(bookings)
        if(bookings.length!=0){
            console.log("send")
            res.send({
                message:"success",
                flag:true,
                bookings:bookings
            })
        }else{
            res.send({
                message:"no booking",
                flag:false
            })
        }
    })

    app.post('/setTimeUnavailable',async(req,res)=>{
       let chosenTime=req.body.chosenTime
       let chosenDate=req.body.date
       const date=await ChosenDate.findOne({date:chosenDate})
       const remainingTime=date.period.filter(item=>!chosenTime.includes(item))
       await ChosenDate.updateOne({date:chosenDate},{period:remainingTime})

       res.send({
        message:'success',
        flag:true
       })

    })

    app.post('/getBookingsByMonths',async(req,res)=>{
        let month=req.body.month+1
        let year=req.body.year
        const bookings=await Booking.find({
            $expr: {
                $and: [
                  { $eq: [{ $year: { $toDate: '$date' } }, year] },
                  { $eq: [{ $month: { $toDate: '$date' } }, month] },
                  { $eq: ['$delete',false] }
                ],
              },
        }).sort({date:-1,time:1})
        
        if(bookings.length!=0){
            // console.log(bookings)
            res.send({
                message:"success",
                flag:true,
                bookings:bookings
            })
        }else{
            // console.log(bookings)
            res.send({
                message:"no bookings",
                flag:false
            })
        }
    })

    app.post('/getBookingsByDates',async(req,res)=>{
        let date=new Date(req.body.date)
       
        const bookings=await Booking.find({
           date:date,
           delete:false
        }).sort({date:-1,time:1})
        if(bookings.length!=0){
   
            res.send({
                message:"success",
                flag:true,
                bookings:bookings
            })
        }else{
            // console.log(bookings)
            res.send({
                message:"no bookings",
                flag:false
            })
        }
    })

    app.post('/getBookingsByEmail',async(req,res)=>{
        let email=req.body.email
       
        const bookings=await Booking.find({
           email:email
        })
        if(bookings.length!=0){
    
            res.send({
                message:"success",
                flag:true,
                bookings:bookings
            })
        }else{
            // console.log(bookings)
            res.send({
                message:"no bookings",
                flag:false
            })
        }
    })

    app.post('/getBookingsByPhone',async(req,res)=>{
        let phone=req.body.phone
        console.log(phone)
       
        const bookings=await Booking.find({
           phoneNumber:phone
        })
        if(bookings.length!=0){
   
            res.send({
                message:"success",
                flag:true,
                bookings:bookings
            })
        }else{
            // console.log(bookings)
            res.send({
                message:"no bookings",
                flag:false
            })
        }
    })


    app.post('/deleteBooking',async(req,res)=>{
        const id=req.body.id
        const booking=await Booking.findOneAndUpdate({_id:id},{delete:true})
        let time=booking.time

        const findeOneDate=await ChosenDate.findOne({date:new Date(booking.date)})
        let period=findeOneDate.period
        // console.log(findeOneDate.totalTime,period,time)      
        for(let i=0;i<Math.ceil(booking.totalTime+1);i++){
            period.push(time)
            time++   
        }
        period.sort(function(a, b){return a - b});
       
        await ChosenDate.updateOne({date:new Date(booking.date)},{period:period})
      
        res.send({
            flag:true
        })
    })

    app.post('/getDescription',async(req,res)=>{
        // const title=req.body.title
        const list=await Description.find()

        if(list){
            res.send({
                flag:true,
                description:list
            })
        }else{
            res.send({
                flag:false,
                message:"sorry, we cannot show description right now"
            })
        }
    })

    app.post('/login',async(req,res)=>{
        const {userName,password}=req.body
        const user=await Admin.findOne({userName})
        
        if(user){
            if(password==user.password){
                res.send(
                    {flag:true,phone:user.phone}
                )
            }else{
                res.send({
                    flag:false,
                    message:`Sorry,the password doesn't match`
                })
            }        
        }else{
            res.send({
                flag:false,
                message:`This user doesn't exist `
            })
        }
    })

    app.post('/sendCode',async(req,res)=>{       
        const {phone}=req.body
        console.log(phone)
        const verificationOptions={
            service_name:`Haos garage`,
            seconds:600
        }
        await textflow.sendVerificationSMS(phone, verificationOptions);
        res.send()
    })

    app.post('/verifyCode',async(req,res)=>{
        const {phone,code}=req.body
        console.log(code)
        let result = await textflow.verifyCode(phone,code); 
        res.send(result.valid)

    })

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
    //     service:[
    //         {name:"Regular Detailing",price:100,time:1},
    //         {name:"Interior Detailing",price:200,time:2},
    //         {name:"Exterior Detailing",price:200,time:2},
    //         {name:"Full Detailing",price:270,time:3.5},
    //         {name:"Pre-sale Detailing or usedcar buyer's option",price:350,time:4}
            
    //     ]
    // })

    // Service.create({
    //     type:"SUV",
    //     service:[
    //         {name:"Regular Detailing",price:110,time:1},
    //         {name:"Interior Detailing",price:220,time:2},
    //         {name:"Exterior Detailing",price:220,time:2},
    //         {name:"Full Detailing",price:310,time:3.5},
    //         {name:"Pre-sale Detailing or usedcar buyer's option",price:"400",time:4.5},
    //     ]
    // })
    // Service.create({
    //     type:"VAN",
    //     service:[
    //         {name:"Regular Detailing",price:123,time:1.5},
    //         {name:"Interior Detailing",price:240,time:2.5},
    //         {name:"Exterior Detailing",price:240,time:2.5},
    //         {name:"Full Detailing",price:350,time:4},
    //         {name:"Pre-sale Detailing or usedcar buyer's option",price:450,time:5}
            
    //     ]
    // })

    // Admin.create({
    //     userName:'jzyoung0122',
    //     password:'448918LUCKy&',
    //     phone:'61404537609'
    // })
}