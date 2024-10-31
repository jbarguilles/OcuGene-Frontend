import {React, useState, useEffect} from 'react';
import './supportActCurrent.css';
import SupportActEdit from './supportActEdit';

const supportActCurrent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Symposium on Genetic Disorders',
      type: 'Symposium',
      date: '2023-10-15',
      time: '10:00AM - 02:00PM',
      location: 'Community Hall, City Center'
    },
    {
      id: 2,
      title: 'Charity Concert for Rare Diseases',
      type: 'Concert',
      date: '2023-11-05',
      time: '06:00PM - 09:00PM',
      location: 'Grand Auditorium, Downtown'
    },
    {
      id: 3,
      title: 'Monthly Support Group Meeting',
      type: 'Support Group',
      date: '2023-12-01',
      time: '04:00PM - 06:00PM',
      location: 'Health Center, Westside'
    }
  ]);

  const [editingEvent, setEditingEvent] = useState(null);

  const transformEventData = (serverData) => {
    return serverData.map((event) => {
      // Parse the date to 'YYYY-MM-DD'
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().slice(0, 10);
  
      // Convert start and end times to 12-hour format
      const formatTime = (time) => {
        let [hour, minute] = time.split(':');
        const isPM = hour >= 12;
        hour = hour % 12 || 12;
        const suffix = isPM ? 'PM' : 'AM';
        return `${String(hour).padStart(2, '0')}:${minute}${suffix}`;
      };
  
      const startTime = formatTime(event.startTime);
      const endTime = formatTime(event.endTime);
  
      return {
        id: event.activityID,
        title: event.title,
        type: event.activityType,
        date: formattedDate,
        time: `${startTime} - ${endTime}`,
        location: event.location,
      };
    });
  };

  const handleEdit = (eventID) => {
    console.log(`Event to be edited has id ${eventID}`);
    const eventToEdit = events.find(event => event.id === eventID);
    setEditingEvent(eventToEdit);
  };

  const handleDelete = (eventID) => {
    console.log(`Event to be deleted has id ${eventID}`);
  }

  const handleSave = (updatedEvent) => {
    setEvents(events.map(event => (event.id === updatedEvent.id ? updatedEvent : event)));
    setEditingEvent(null);
  };

  const handleClose = () => {
    setEditingEvent(null);
  };

  useEffect(() => {

    fetch('http://localhost:8080/activity/get-all', {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setEvents(transformEventData(data));
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors here
    });

  }, [])

  return (
    <div>
      {events.map((event, index) => (
        <div key={index} className="event-card">
          <div className="event-card-header">
            <h2 className="event-title">{event.title}</h2>
            <div className="event-card-buttons">
              <button className="edit-button" onClick={() => handleEdit(event.id)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
          <ul className="event-details">
            <li>{event.type}</li>
            <li>{event.date}</li>
            <li>{event.time}</li>
            <li>{event.location}</li>
          </ul>
        </div>
      ))}
      {editingEvent && (
        <SupportActEdit event={editingEvent} onSave={handleSave} onClose={handleClose} />
      )}
    </div>
  );
};

export default supportActCurrent;