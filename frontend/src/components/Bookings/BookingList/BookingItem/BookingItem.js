import React from 'react';

import './BookingItem.css';

const bookingItem = props => {
    const booking = props.booking;

    return (
        <li className="booking__list-item">
            <div className="bookings__item-data">
                { booking.event.title } - 
                { new Date(booking.createdAt).toLocaleDateString() }
            </div>
            <div className="bookings__item-actions">
                <button className="btn" onClick={props.onCancel.bind(null, booking._id)}>
                    Cancel
                </button>
         
            </div>
        </li>
    );
}

export default bookingItem;
