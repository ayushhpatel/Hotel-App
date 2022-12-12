import React,{useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from "axios"
import Swal from 'sweetalert2';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';

function Bookingscreen() {
    let {roomid}=useParams();
    let {fromdate}=useParams();
    let {todate}=useParams();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const[room,setRoom]=useState({});
    const from=moment(fromdate,'DD-MM-YYYY')
    const to=moment(todate,'DD-MM-YYYY')
    const totaldays=moment.duration(to.diff(from)).asDays()+1;
    var tamt=totaldays*room.rentperday
    useEffect(()=>{
        if(!localStorage.getItem('currentUser')){
            window.location.href='/login'
        }
        async function getResults() {
            try {
                setLoading(true)
                const data = (await axios.post('/api/rooms/getroombyid',{roomid:roomid})).data;
                setRoom(data)
                setLoading(false)
            } catch (error) {
                setError(true)
                console.log(error);
                setLoading(false)
            }
        }
        getResults();
    },[])

    async function bookRoom(){ 
        const bookingDetails={
            room,
            userid:JSON.parse(localStorage.getItem('currentUser'))._id,
            from,
            to,
            tamt,
            totaldays
        }
        try {
            const result=await axios.post('/api/bookings/bookroom',bookingDetails)
            Swal.fire('Congrats','Your booking is confirmed','success').then(result=>{
                window.location.href='/profile'
            })
        } catch (error) {
            
        }
    }

  return (
    <div className='m-5'>
        {loading ? <Loader/>  : room ? (<div>
            <div className="row mt-5 bs">
                <div className="col-md-6">
                    <h1>{room.name}</h1>
                    <img src={room.imageurls[0]} className="bigimg"/>
                </div>
                <div className="col-md-5">
                    <div>
                    <h1>Booking Details</h1>
                    <hr />
                    <b>
                    <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                    <p>From : {fromdate}</p>
                    <p>To : {todate}</p>
                    <p>Max Capacity : {room.maxcount}</p>
                    </b>
                    </div>
                    <div>
                        <b>
                        <h1>Amount</h1>
                        <hr/>
                        <p>Total days : {totaldays}</p>
                        <p>Rent per day : {room.rentperday}</p>
                        <p>Total amount : {tamt}</p>
                        </b>
                    </div>
                    <div style={{ float: 'right' }} >
                        <button className='btn btn-primary' onClick={bookRoom}>Pay now</button>
                    </div>
                </div>
            </div>
            </div>): error ?<Error/>:''}
    </div>
  )
}

export default Bookingscreen