import React,{useState} from 'react'
import SyncLoader from "react-spinners/SyncLoader";

function Loader() {
    let [loading, setLoading] = useState(true);
    return (
        <div style={{marginTop:'80px'}}>
            <div className="sweet-loading text-center">
                <SyncLoader
                    color='#000'
                    loading={loading}
                    cssOverride=''
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
        </div>
    )
}

export default Loader