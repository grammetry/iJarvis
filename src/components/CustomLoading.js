import React from 'react';
const CustomLoading = () => {
    return (
        <>

            <style>
                {`
                    .loading-animation {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width:220px;
                        height:220px;
                        
                    }

                    .loading-circle {
                        border: 12px solid #1e293b;
                        border-top: 12px solid #16C187;
                        border-radius: 50%;
                        width: 194px;
                        height: 194px;
                        animation: spin 2s linear infinite;
                    }

                    .loading-text {
                        top:98px;
                        left:57px;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>

            <div className='position-relative'>
                <div className="loading-animation position-absolute top-0 start-0">
                    <div className="loading-circle"></div>
                
                </div>
                <span className="position-absolute loading-text" style={{fontWeight:'bold',fontSize:20}}>Processing</span>
            </div> 

            
            
        </>
    );
}

export default CustomLoading;