import React,{useState, useEffect} from 'react'
import { Tabs } from "antd";
import axios from 'axios'
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
const { TabPane } = Tabs;
function Adminscreen() {

    const user = JSON.parse(localStorage.getItem('currentUser'))

    useEffect(()=>{
        if (!user) {
            window.location.href = '/login'
        }
        if(!user.isAdmin){
            window.location.href='/home'
        }

    },[])
    
  return (
    <div className='mt-3 ml-3 mr-3 bs'>
        <h1 className='text-center'><b>Admin Panel</b></h1>
        <Tabs defaultActivekey="1">
                <TabPane tab="Bookings" key="1">
                    <Bookings/>
                </TabPane>
                <TabPane tab="Rooms" key="2">
                    <Rooms/> 
                </TabPane>
                <TabPane tab="Add Room" key="3">
                    <Addroom/>
                </TabPane>
                <TabPane tab="Users" key="4">
                    <Users/>
                </TabPane>
            </Tabs>
    </div>
  )
}

export default Adminscreen;

export function Bookings(){

    const[bookings,setBookings]=useState([])
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState()
    useEffect(() => {
        async function getResults3(){
            try {
                const data = await (await axios.get('/api/bookings/getallbookings')).data
                setBookings(data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setError(error)
            }
        }
        getResults3()
    }, []);

    return(
        <div className='row'>
            <div className="col-md-12">

                <h1>Bookings</h1>
                {loading && <Loader/>}
                <table className='table table-bordered table-dark'>
                    <thead className='bs thead-dark'>
                        <tr>
                            <th>Booking Id</th>
                            <th>User Id</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length && (bookings.map(booking=>{
                            return <tr>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.from}</td>
                                <td>{booking.to}</td>
                                <td>{booking.status}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export function Rooms(){

    const[rooms,setRooms]=useState([])
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState()
    useEffect(() => {
        async function getResults4(){
            try {
                const data = await (await axios.get('/api/rooms/getallrooms')).data
                setRooms(data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setError(error)
            }
        }
        getResults4()
    }, []);

    return(
        <div className='row'>
            <div className="col-md-12">

                <h1>Rooms</h1>
                {loading && <Loader/>}
                <table className='table table-bordered table-dark'>
                    <thead className='bs thead-dark'>
                        <tr>
                            <th>Room Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent per day</th>
                            <th>Max Capacity</th>
                            <th>Phone number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.length && (rooms.map(room=>{
                            return <tr>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentperday}</td>
                                <td>{room.maxcount}</td>
                                <td>{room.phonenumber}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export function Users(){

    const[users,setUsers]=useState([])
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState()
    useEffect(() => {
        async function getResults5(){
            try {
                const data = await (await axios.get('/api/users/getallusers')).data
                setUsers(data)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                setError(error)
            }
        }
        getResults5()
    }, []);

    return(
        <div className='row'>
            <div className="col-md-12">
                <h1>Users</h1>
                {loading && <Loader/>}
                <table className='table table-bordered table-dark'>
                    <thead className='bs thead-dark'>
                        <tr>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && (users.map(user=>{
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'Yes':'No'}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export function Addroom(){

    const[name,setName]=useState('')
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState()
    const[rentperday,setRentperday]=useState()
    const[description,setDescription]=useState()
    const[maxcount,setMaxcount]=useState()
    const[phonenumber,setPhonenumber]=useState()
    const[type,setType]=useState()
    const[imageurl1,setImageurl1]=useState()
    const[imageurl2,setImageurl2]=useState()
    const[imageurl3,setImageurl3]=useState()

    async function addRoom(){
        const newroom={
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls:[imageurl1,imageurl2,imageurl3]
        }
        try {
            setLoading(true)
            const result=await (await axios.post('/api/rooms/addroom',newroom)).data
            console.log(result)
            setLoading(false)
            Swal.fire('Congrats','Room added successfully','success').then(result=>{
                window.location.href='/admin'
            })
        } catch (error) {
            console.log(error)
            setError(error)
            setLoading(false)
            Swal.fire('Oops','Something went wrong','error')
        }
    }

    return(
        <div className='row'>
            <div className="col-md-5">
            {loading && <Loader/>}
                <input type='text' className='form-control' value={name} onChange={(e)=>{setName(e.target.value)}}  placeholder='room name'></input>
                <input type='text' className='form-control' value={rentperday} onChange={(e)=>{setRentperday(e.target.value)}} placeholder='rent per day'></input>
                <input type='text' className='form-control' value={maxcount} onChange={(e)=>{setMaxcount(e.target.value)}} placeholder='max capacity'></input>
                <input type='text' className='form-control' value={description} onChange={(e)=>{setDescription(e.target.value)}} placeholder='description'></input>
                <input type='text' className='form-control' value={phonenumber} onChange={(e)=>{setPhonenumber(e.target.value)}} placeholder='phone number'></input>
            </div>
            <div className="col-md-5">
                <input type='text' className='form-control' value={type} onChange={(e)=>{setType(e.target.value)}} placeholder='type'></input>
                <input type='text' className='form-control' value={imageurl1} onChange={(e)=>{setImageurl1(e.target.value)}} placeholder='image url-1'></input>
                <input type='text' className='form-control' value={imageurl2} onChange={(e)=>{setImageurl2(e.target.value)}} placeholder='image url-2'></input>
                <input type='text' className='form-control' value={imageurl3} onChange={(e)=>{setImageurl3(e.target.value)}} placeholder='image-url-3'></input>
                <div className='text-right mt-2'>
                    <button className='btn btn-primary' onClick={addRoom}>Add Room</button>
                </div>
            </div>
        </div>
    )
}