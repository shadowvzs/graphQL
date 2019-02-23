import React, { Component } from 'react';

import AuthContext from '../context/auth-context';

import FetchApi from '../service/service';

import EventList from '../components/Events/EventList/EventList';
import Backdrop from '../components/Backdrop/Backdrop';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';

import './Events.css';

class EventsPage extends Component {

    static contextType = AuthContext;

    state = {
        creating: false,
        isLoading: false,
        selectedEvent: null,
        events: []
    };

    isActive = true;

    componentDidMount() {
        this.fetchEvents();
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    startCreateEventHandler = () => {
        this.setState( { creating: true } );
    }

    modalConfirmHandler = () => {
        const { title = "", description = "", price = 0, date = "" } = this.state;
        if (
            !title.trim().length ||
            !description.trim().length ||
            !date.trim().length
        ) {
            return alert('empty fields');
        }

       const requestBody = {
            query: `
              mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!) {
                  createEvent(myEventInput: {title: $title, description: $description, price: $price, date: $date}) {
                      _id
                      title
                      description
                      price
                      date
                  }
              }
            `,
            variables: {
              title: title,
              description: description,
              price: +price,
              date: date
            }
        };

        FetchApi(
            requestBody, 
            this.context.token, 
            res => {
                // add new event to list and rerender
                this.isActive && this.setState( prevState => {
                    const newEvent = { ...res.data.createEvent, creator: {_id: this.context.userId} };
                    const updatedEvents = [...prevState.events, newEvent];
                    return { events: updatedEvents, creating: false };
                });
            }
        );
    };

    bookEventHandler = () => {

        const token = this.context.token;
        if (!token) { return this.modalCancelHandler(); }

        const requestBody = {
            query: `
              mutation BookEvent($id: ID!) {
                  bookEvent(eventId: $id) {
                      _id
                      createdAt
                      updatedAt
                  }
              }
            `,
            variables: {
              id: this.state.selectedEvent._id
            }
        };

        FetchApi(
            requestBody, 
            token, 
            res => {
                this.isActive && this.setState({
                    creating: false,
                    isLoading: false
                });
            },
            () => { this.isActive && this.setState( { isLoading: false } ); }
        );
    };

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null});
    }

    onChange = (ev) => {
        const target = ev.target;
        this.setState({...this.state, [target.name]: target.value});
    }

    fetchEvents() {

        this.setState( { isLoading: true } );

        const requestBody = {
            query: `
              query {
                  events {
                      _id
                      title
                      description
                      price
                      date
                      creator {
                          _id
                          email
                      }
                  }
              }
            `
        };

        FetchApi(
            requestBody, 
            null, 
            res => {
                this.isActive && this.setState({
                    ...this.state,
                    events: res.data.events,
                    creating: false,
                    isLoading: false
                });
            },
            () => { this.isActive && this.setState( { isLoading: false } ); }
        );
    }

    showDetailHandler = (eventId) => {
        this.setState( prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return { selectedEvent: selectedEvent }
        });
    }

    render() {
        const selectedEvent = this.state.selectedEvent;
        return (
            <>
                
                {(this.state.creating || selectedEvent) && (<Backdrop />)}
                {this.state.creating && (
                    <Modal
                        title="Add Event"
                        confirmText="Save"
                        cancelText="Cancel"
                        onCancel={this.modalCancelHandler}
                        onConfirm={this.modalConfirmHandler}
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title"> Title </label>
                                <input type="text" name="title" value={this.state.title || ""} onChange={this.onChange} />
                            </div>
                             <div className="form-control">
                                <label htmlFor="description"> Description </label>
                                <textarea name="description" rows="4" value={this.state.description || ""} onChange={this.onChange} ></textarea>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price"> Price </label>
                                <input type="text" name="price" value={this.state.price || 0} onChange={this.onChange}  />
                            </div>
                             <div className="form-control">
                                <label htmlFor="date"> Date </label>
                                <input type="datetime-local" name="date" value={this.state.date || ""} onChange={this.onChange}  />
                            </div>
                        </form>
                    </Modal>
                )}

                {selectedEvent && (
                  <Modal
                      title={selectedEvent.title}
                      confirmText={this.context.token ? "Book" : null}
                      cancelText="Close"
                      onCancel={this.modalCancelHandler}
                      onConfirm={this.bookEventHandler}
                  >
                    <h1>{selectedEvent.title}</h1>
                    <h2>${ selectedEvent.price } - {new Date(selectedEvent.date).toLocaleDateString()}</h2>
                    <p>{ selectedEvent.description }</p>
                  </Modal>
                )}

                {this.context.token && (
                  <div className="events-control">
                      <p> Share your own events!</p>
                      <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                  </div>
                )}

                {this.state.isLoading
                      ? <Spinner />
                      : (
                        <EventList
                            events={this.state.events}
                            userId={this.context.userId}
                            onDetail={this.showDetailHandler}
                        />)
                }
            </>
        );
    }
}

export default EventsPage;
