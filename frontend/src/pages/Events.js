import React, { Component } from 'react';

import AuthContext from '../context/auth-context';
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

    componentDidMount() {
        this.fetchEvents();
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
              mutation {
                  createEvent(myEventInput: {title: "${title}", description: "${description}", price: ${+price}, date:"${date}"}) {
                      _id
                      title
                      description
                      price
                      date
                  }
              }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => {
              if (res.status !== 200 && res.status !== 201 ) {
                  throw new Error('Failed!');
              }
              return res.json();
        })
        .then(res => {
            if (res.errors) {
                throw new Error(res.errors[0].message);
            }

            // add new event to list and rerender
            this.setState( prevState => {
                const newEvent = { ...res.data.createEvent, creator: {_id: this.context.userId} };
                const updatedEvents = [...prevState.events, newEvent];
                return { events: updatedEvents, creating: false };
            });

        })
        .catch(err => console.error(err));
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

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
              if (res.status !== 200 && res.status !== 201 ) {
                  throw new Error('Failed!');
              }
              return res.json();
        })
        .then(res => {
            if (res.errors) {
                throw new Error(res.errors[0].message);
            }

            this.setState({
                ...this.state,
                events: res.data.events,
                creating: false,
                isLoading: false
            });
        })
        .catch(err => {
            this.setState( { isLoading: false } );
            console.error(err);
        });
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
                {this.state.creating && (
                    <>
                        <Backdrop />
                        <Modal
                            title="Add Event"
                            canConfirm
                            canCancel
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}
                        >
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title"> Title </label>
                                    <input type="text" name="title" value={this.state.title || ""} onChange={this.onChange} />
                                </div>
                            </form>
                            <form>
                                <div className="form-control">
                                    <label htmlFor="description"> Description </label>
                                    <textarea name="description" rows="4" value={this.state.description || ""} onChange={this.onChange} ></textarea>
                                </div>
                            </form>
                            <form>
                                <div className="form-control">
                                    <label htmlFor="price"> Price </label>
                                    <input type="text" name="price" value={this.state.price || 0} onChange={this.onChange}  />
                                </div>
                            </form>
                            <form>
                                <div className="form-control">
                                    <label htmlFor="date"> Date </label>
                                    <input type="datetime-local" name="date" value={this.state.date || ""} onChange={this.onChange}  />
                                </div>
                            </form>
                        </Modal>
                    </>
                )}

                {selectedEvent && (
                  <Modal
                      title={selectedEvent.title}
                      canConfirm
                      canCancel
                      onCancel={this.modalCancelHandler}
                      onConfirm={this.modalConfirmHandler}
                  >
                  asdasd
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
