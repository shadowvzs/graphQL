import React from 'react';

import BookingItem from './BookingItem/BookingItem';

import './BookingList.css';

const bookingList = props => {
    const bookings = props.bookings.map( booking => (
        <BookingItem
            userId={props.userId}
            key={booking._id}
            booking={booking}
            onCancel={props.onCancel}
        />
    ));
    return (<ul className="booking__list"> {bookings} </ul>);
};

export default bookingList;
