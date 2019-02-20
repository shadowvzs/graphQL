import React, { Component } from 'react';

import Backdrop from '../components/Backdrop/Backdrop';
import Modal from '../components/Modal/Modal';

import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false
    };

    startCreateEventHandler = () => {
        this.setState({creating: true});
    }

    modalConfirmHandler = () => {
        alert('Confirmed');
    };

    modalCancelHandler = () => {
        this.setState({creating: false});
    }

    render () {
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
                          <p>Modal content</p>
                      </Modal>
                  </>
              )}
                <div className="events-control">
                    <p> Share your own events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>Create Event</button>
                </div>
            </>
        );
    }
}

export default EventsPage;
