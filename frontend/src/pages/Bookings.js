import React, { Component } from 'react';

import FetchApi from '../service/service';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';

class BookingsPage extends Component {

	static contextType = AuthContext;

	state = {
		isLoading: false,
		bookings: [],
        tab: 'list'
	}

	isActive = true; 

	componentDidMount() {
		this.fetchBookings();
	}

   componentWillUnmount() {
        this.isActive = false;
    }

    onCancelBookingHandler = (id) => {
        this.setState( { isLoading: true } );

        // better solution for inject the data if we give name for this mutation
        // replace the direct value (blabla="${something.id}")
        // and where we declared name then there we add same variable name 
        // and we can add type here
        // so at end we can send multiple data if we use name and separate it with comma
        // or we can send variables aswell
        const requestBody = {
            query: `
              mutation cancelBooking($id: ID!) {
                  cancelBooking(bookingId: $id) {
                      _id
                      title
                  }
              }
            `,
            variables: {
                id: id
            }
        };

        FetchApi(
            requestBody, 
            this.context.token, 
            res => {
                this.isActive && this.setState(prevState => {
                    const updatedBookings = prevState.bookings.filter(item => item._id !== id);
                    return {
                        bookings: [...updatedBookings],
                        isLoading: false
                    }
                });
            },
            () => { this.isActive && this.setState( { isLoading: false } ); }
        );
    }

    fetchBookings = () => {

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

        FetchApi(
            requestBody, 
            this.context.token, 
            res => {
                this.isActive && this.setState({
                    ...this.state,
                    bookings: res.data.bookings,
                    isLoading: false
                });
            },
            () => { this.isActive && this.setState( { isLoading: false } ); }
        );
    }

    changeTabHandler = tab => {
        if (tab === 'list') {
            this.setState({tab: tab});
        } else {
            this.setState({tab: 'chart'});
        }
    }

    render () {
        let content = <Spinner />;
        if (!this.state.isLoading) {
            content = (
                <>
                    <BookingsControls 
                        changeTab={this.changeTabHandler} 
                        activeTab={this.state.tab}
                    />
                    <div>
                        {this.state.tab === 'list' 
                            ? ( <BookingList 
                                    bookings={this.state.bookings} 
                                    onCancel={this.onCancelBookingHandler}
                                    userId={this.context.userId}
                                />)
                            : ( <BookingsChart 
                                    bookings={this.state.bookings}
                                />
                            )
                        }
                    </div>
                </>
            ) 
        }
        return (
        	<>  { content }
            </>
        );
    }
}

export default BookingsPage;
