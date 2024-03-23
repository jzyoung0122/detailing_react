
const express = require("express");
const router = express.Router();

const bookingControllers=require("../controllers/bookingControllers")
const serviceControllers=require("../controllers/serviceControllers")
const adminControllers=require("../controllers/adminControllers")



module.exports=(app)=>{
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

    app.post('/deleteBooking',bookingControllers.deleteBooking)

    app.post('/login',adminControllers.login)

    app.post('/sendCode',adminControllers.sendCode)

    app.post('/verifyCode',adminControllers.verifyCode)

}
