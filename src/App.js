import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  FeatureGroup,
  Polyline,
  Popup,
} from 'react-leaflet';
import './App.css';

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
        setSamples(null); // Clear sample highlight if day changes
      });
  }

  function compareDate(a, b) {
    const aTime = Date.parse(a.time);
    const bTime = Date.parse(b.time);

    if (aTime < bTime) return -1;

    if (aTime > bTime) return 1;

    return 0;
  }

  function getSample(day, session) {
    fetch(`${API}/days/${day}/sessions/${session}/sample`)
      .then((response) => response.json())
      .then((data) => {
        data.sort(compareDate);
        let result = [];

        for (let i = 0; i < data.length; i += 1) {
          result.push([data[i].lat, data[i].lon]);
        }

        setSamples(result);
      });
  }

  function cleanSessionName(session) {
    const split = session.split('_');
    return `${split[2]} ${split[0].split('T')[1].split('.')[0]}`;
  }

  return (
    <div className='App'>
      <main>
        <MapContainer center={[64.9631, -19.0208]} zoom={6}>
          {anomalies &&
            anomalies.map((entry) =>
              entry.measurements.map((values) => (
                <CircleMarker
                  key={`${entry.session}_${values.time}`}
                  center={[values.lat, values.lon]}
                  radius={8}
                  color={
                    values.edr > 0.8
                      ? '#E15759'
                      : values.edr > 0.5
                      ? '#F28E2B'
                      : '#EDC948'
                  }
                >
                  <Popup>{`EDR of ${values.edr.toFixed(
                    3
                  )} at approximately ${values.alt.toFixed(
                    1
                  )} meters of altitude going ${values.ms.toFixed(
                    1
                  )} m/s`}</Popup>
                </CircleMarker>
              ))
            )}
          {samples &&
            (samples.length > 1 ? (
              <FeatureGroup>
                <Polyline positions={samples} />
              </FeatureGroup>
            ) : (
              <CircleMarker center={samples[0]}> </CircleMarker>
            ))}
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
              onClick={() => getSample(day, entry.session)}
            >
              {cleanSessionName(entry.session)}
            </button>
          ))}
      </main>
    </div>
  );
}

export default App;
