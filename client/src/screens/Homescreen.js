import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment'
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css'; 
const { RangePicker } = DatePicker;

function Homescreen() {

    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState()
    const [error, setError] = useState()    
    const[fromdate,setFromdate]=useState()
    const[todate,setTodate]=useState()
    const[duplicaterooms,setDuplicaterooms]=useState([])
    const[searchkey,setSearchkey]=useState('')
    const[type,setType]=useState('all')

    useEffect(() => {
        async function getResults() {
            try {
                setLoading(true)
                const data = (await axios.get('/api/rooms/getallrooms')).data;
                setRooms(data)
                setDuplicaterooms(data)
                setLoading(false)
            } catch (error) {
                setError(true)
                console.log(error);
                setLoading(false)
            }
        }
        getResults();
    }, []);

    function filterByDate(dates){
        setFromdate(moment(dates[0]).format('DD-MM-YYYY'))
        setTodate(moment(dates[1]).format('DD-MM-YYYY'))
        var temprooms=[]
        var avail=false
        for(const room of duplicaterooms){
            if(room.currentbookings.length >0){
                for(const booking of room.currentbookings){
                    if(!moment(moment(dates[0]).format('DD-MM-YYYY')).isBetween(booking.fromdate,booking.todate)
                    && !moment(moment(dates[1]).format('DD-MM-YYYY')).isBetween(booking.fromdate,booking.todate)){
                       if( 
                        moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
                        moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
                        moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
                        moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
                        ){
                            avail=true;
                        }
                    }
                }
            }
            if(avail==true || room.currentbookings.length==0){
                temprooms.push(room)
            }
            setRooms(temprooms)
        }
    }

    function filterBySearch(){
        const temprooms=duplicaterooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()))
        setRooms(temprooms)
    }
    function filterByType(e){
        setType(e)
        if(e!=='all'){
            const temprooms=duplicaterooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
            setRooms(temprooms)
        }
        else{
            setRooms(duplicaterooms)
        }
    }

    return (
        <div className='container'>

            <div className="row mt-5 bs">
                <div className="col-md-3">
                    <RangePicker format='DD-MM-YYYY' onChange={filterByDate}/>
                </div>
                <div className="col-md-5">
                    <input type="text" className='form-control' placeholder='Search Rooms' value={searchkey}
                     onChange={(e)=>{setSearchkey(e.target.value)}} onKeyUp={filterBySearch}/>
                </div>
                <div className="col-md-3">
                <select className='form-control' value={type} onChange={e=>{filterByType(e.target.value)}}>
                    <option value="all">All</option>
                    <option value="delux">Delux</option>
                    <option value="non-delux">Non-Delux</option>
                    <option value="suite">Suite</option>
                    <option value="presidential suite">Presidential Suite</option>
                </select>
                </div>
            </div>
            <div className="row justify-content-center mt-5">
                {loading ? <Loader/> : (rooms.map(room => {
                    return <div className="col-md-9 mt-2">
                        <Room room={room} fromdate={fromdate} todate={todate}/>
                    </div>
                }))}
            </div>
        </div>
    )
}

export default Homescreen