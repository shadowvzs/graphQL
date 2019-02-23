import React from 'react';

import './BookingsControls.css';

const bookingsControls = props => {
    return (
        <div className="bookings-controls">
            <button 
                onClick={props.changeTab.bind(null, 'list')}
                className={props.activeTab === 'list' ? 'active' : ''}
            > 
                List 
            </button>

            <button 
                onClick={props.changeTab.bind(null, 'chart')}
                className={props.activeTab === 'chart' ? 'active' : ''}
            > 
                Chart 
            </button>
        </div>
   )
};


export default bookingsControls;