import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';

class BookingsPage extends Component {

	static contextType = AuthContext;

	state = {
		isLoading: false,
		bookings: []
	}

	isActive = true; 

	componentDidMount() {
		this.fetchBookings();
	}

   componentWillUnmount() {
        this.isActive = false;
    }

    onCancelBookingHandler = (id) => {
        const token = this.context.token;
        this.setState( { isLoading: true } );

        const requestBody = {
            query: `
              mutation {
                  cancelBooking(bookingId: "${id}") {
                      _id
                      title
                  }
              }
            `
        };

        fetch('http://172.18.0.3:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
            if ( [200, 201].indexOf(res.status) === -1 ) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(res => {
            if (res.errors) {
                throw new Error(res.errors[0].message);
            }

            this.isActive && this.setState(prevState => {
                const updatedBookings = prevState.bookings.filter(item => item._id !== id);
                return {
                    bookings: [...updatedBookings],
                    isLoading: false
                }
            });

        })
        .catch(err => {
            this.isActive && this.setState( { isLoading: false } );
            console.error(err);
        });        
    }

    fetchBookings = () => {

    	const token = this.context.token;
        this.setState( { isLoading: true } );

        const requestBody = {
            query: `
              query {
                  bookings {
                      _id
                      createdAt
                      updatedAt
                      event {
                          _id
                          title
                          description
                          price
                          date
                      }
                  }
              }
            `
        };

        fetch('http://172.18.0.3:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
              if ([200, 201].indexOf(res.status) === -1 ) {
                  throw new Error('Failed!');
              }
              return res.json();
        })
        .then(res => {
            if (res.errors) {
                throw new Error(res.errors[0].message);
            }

            this.isActive && this.setState({
                ...this.state,
                bookings: res.data.bookings,
                isLoading: false
            });
        })
        .catch(err => {
            this.isActive && this.setState( { isLoading: false } );
            console.error(err);
        });
    }


    render () {
        return (
        	<>  { this.state.isLoading 
                    ? <Spinner /> 
                    : <BookingList 
                        bookings={this.state.bookings} 
                        onCancel={this.onCancelBookingHandler}
                        userId={this.context.userId}
                      />

                }
            </>
        );
    }
}

export default BookingsPage;
