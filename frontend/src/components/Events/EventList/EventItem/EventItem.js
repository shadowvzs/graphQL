import React from 'react';

import './EventItem.css';

const eventItem = props => {
    const event = props.event;

    return (
        <li className="event__list-item">
            <div>
                <h1> { event.title } </h1>
                <h2> ${ event.price } - {new Date(event.date).toLocaleDateString()}</h2>

            </div>
            <div>
                { props.userId === event.creator._id
                        ? (<p> Your event owner </p>)
                        : (
                            <button className="btn" onClick={props.onDetail.bind(null, event._id)}>
                                View Details
                            </button>)
                }
            </div>
        </li>
    );
}

export default eventItem;
