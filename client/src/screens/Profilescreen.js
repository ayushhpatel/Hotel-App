import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import axios from 'axios'
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
const { TabPane } = Tabs;

function Profilescreen() {

    const user = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(() => {
        if (!user) {
            window.location.href = '/login'
        }
    }, [])

    return (
        <div className="ml-3 mt-3">
            <Tabs defaultActivekey="1">
                <TabPane tab="Profile" key="1">
                    <h1>My Profile</h1>
                    <br />
                    <h1>Name: {user.name}</h1>
                    <h1>Email: {user.email}</h1>
                    <h1>isAdmin: {user.isAdmin ? 'Yes' : 'No'}</h1>

                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <MyBookings />
                </TabPane>
            </Tabs>
        </div >
    );
}
export default Profilescreen;

export function MyBookings() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const[bookings,setBookings]=useState([])
    useEffect(() => {
        async function getResults2(){
            try {
                setLoading(true)
                const rooms = (await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id })).data
                console.log(rooms)
                setBookings(rooms)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setError(error)
            }
        }
        getResults2()
    }, []);

    async function cancelBooking(bookingid,roomid){
        try {
            setLoading(true)
            const result=await (await axios.post("/api/bookings/cancelbooking",{bookingid,roomid})).data
            console.log(result)
            setLoading(false)
            Swal.fire('Congrats','Your booking has been cancelled','success').then(result=>{
                window.location.reload()
            })
        } catch (error) {
            setLoading(false)
            console.log(error)
            Swal.fire('Oops','Something went wrong','error')
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    {loading && <Loader/>}
                    {bookings && (bookings.map(booking=>{
                 return (<div className="bs">
                            <h1>{booking.room}</h1>
                            <p><b>Booking ID</b> : {booking._id}</p>
                            <p><b>CheckIn</b> : {booking.from}</p>
                            <p><b>CheckOut</b> : {booking.to}</p>
                            <p><b>Amount</b> : {booking.tamt}</p>
                            <p><b>Status</b> : {booking.status == 'booked' ? 'CONFIRMED':'CANCELLED'}</p>
                            {booking.status!=='cancelled' && (
                                <div className="text-right">
                                <button className="btn btn-primary" onClick={()=>{cancelBooking(booking._id,booking.roomid)}}>CANCEL BOOKING</button>
                            </div>
                            )}
                        </div>)
                    }))}
                </div>
            </div>
        </div>
    )
}