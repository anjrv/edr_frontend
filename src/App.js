import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './App.css';
import { Icon } from 'leaflet';

const API = 'http://192.168.1.13:3456';

function App() {
  const [day, setDay] = useState('');
  const [days, setDays] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [samples, setSamples] = useState(null);

  useEffect(() => {
    fetch(`${API}/days`)
      .then((response) => response.json())
      .then((data) => setDays(data));
  }, []);

  function getDay(day) {
    fetch(`${API}/days/${day}`)
      .then((response) => response.json())
      .then((data) => {
        setDay(day);
        setSessions(data.sessions);
        setAnomalies(data.anomalies);
      });
  }

  // function getSample(day, session) {
  //   fetch(`${API}/days/${day}/${session}/sample`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSamples(data);
  //     });
  // }

  // function renderSessionSelection() {
  //   return dayValues.sessions.map(({ session, i }) => {
  //     <button
  //       key={`${dayValues.day}_${session}_${i}`}
  //       onClick={() => console.log(session)}
  //     >
  //       {session}
  //     </button>;
  //   });
  // }

  return (
    <div className='App'>
      <main>
        <MapContainer center={[64.9631, -19.0208]} zoom={6}>
          {anomalies &&
            anomalies.map(
              (entry) =>
                entry.measurements.map((values) => (
                  <Marker
                    key={`${entry.session}_${values.time}`}
                    position={[values.lat, values.lon]}
                    // onClick={() => {
                    //   console.log(values.edr);
                    // }}
                    // icon={Icon}
                  />
                ))
            )}
          <TileLayer
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>

        {days &&
          days.map((day, i) => (
            <button key={`${day}_${i}`} onClick={() => getDay(day)}>
              {day}
            </button>
          ))}

        {sessions &&
          sessions.map((entry, i) => (
            <button
              key={`${entry.session}_${i}`}
              onClick={() => console.log(entry.session)}
            >
              {entry.session}
            </button>
          ))}
      </main>
    </div>
  );
}

export default App;
