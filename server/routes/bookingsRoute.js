const express = require('express')

const router = express.Router();
const Booking = require('../models/booking')
const moment = require('moment')
const Room = require('../models/room')

router.post('/bookroom', async (req, res) => {

    const { room,
        userid,
        from,
        to,
        tamt,
        totaldays } = req.body;
    try {
        const newbooking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            from: moment(from).format('DD-MM-YYYY'),
            to: moment(to).format('DD-MM-YYYY'),
            tamt,
            totaldays,
            transactionid: '1234'
        })
        const booking = await newbooking.save()
        const roomtemp = await Room.findOne({ _id: room._id })
        roomtemp.currentbookings.push({ bookingid: booking._id, from: moment(from).format('DD-MM-YYYY'), to: moment(to).format('DD-MM-YYYY'), userid: userid, status: booking.status });
        await roomtemp.save()


        res.send('Room booked successfully')

    } catch (error) {
        return res.status(400).json({ message: error })
    }

});

router.post('/getbookingsbyuserid', async (req, res) => {

    const userid = req.body.userid;
    try {
        const bookings =await Booking.find({ userid: userid })
        res.send(bookings)

    } catch (error) {
        return res.status(400).json({ error })
    }

});

router.post('/cancelbooking', async (req, res) => {

    const {bookingid,roomid} = req.body;
    try {
        const bookingitem =await Booking.findOne({ _id:bookingid})
        bookingitem.status='cancelled'
        await bookingitem.save()
        const room=await Room.findOne({_id:roomid})
        const bookings=room.currentbookings
        const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)
        room.currentbookings=temp
        await room.save()
        res.send('Booking cancelled successfully')
    } catch (error) {
        return res.status(400).json({ error })
    }

});

router.get('/getallbookings',async (req,res)=>{
    try {
        const bookings=await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({error})
    }
});

module.exports = router;