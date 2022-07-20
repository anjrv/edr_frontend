import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  FeatureGroup,
  Polyline,
  Popup,
} from 'react-leaflet';
import { Calendar } from 'react-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass,
  faDownload,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';

import { cleanSessionName, compareDate, compareEdr } from './utils.js';

import 'react-calendar/dist/Calendar.css';
import './App.css';

const API = 'http://192.168.1.13:3456';

function App() {
  const [years, setYears] = useState(null);
  const [day, setDay] = useState('');
  const [days, setDays] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [anomalies, setAnomalies] = useState(null);
  const [samples, setSamples] = useState(null);

  useEffect(() => {
    fetch(`${API}/days`)
      .then((response) => response.json())
      .then((data) => {
        data.sort(compareDate);

        const result = {};

        for (let i = 0; i < data.length; i += 1) {
          const s = data[i].split('-');

          if (!(s[0] in result)) {
            result[s[0]] = [];
          }

          if (!result[s[0]].includes(s[1])) {
            result[s[0]].push(s[1]);
          }
        }

        setYears(result);
        setDays(data);
      });
  }, []);

  function largestAnomalyForSession(s) {
    let res = 0;

    for (let i = 0; i < anomalies.length; i += 1) {
      if (anomalies[i].session === s) {
        res = anomalies[i].measurements[0].edr;
        break;
      }
    }

    return res;
  }

  function getDay(day) {
    fetch(`${API}/days/${day}`)
      .then((response) => response.json())
      .then((data) => {
        setDay(day);
        setSessions(data.sessions);
        data.anomalies.forEach((anomaly) => {
          anomaly.measurements = anomaly.measurements
            .sort(compareEdr)
            .reverse();
        }); // Sort so we can add color markers to session buttons
        setAnomalies(data.anomalies);
        setSamples(null); // Clear sample highlight if day changes
      });
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
                  <Popup>
                    {`EDR of ${values.edr.toFixed(
                      3
                    )} at approximately ${values.alt.toFixed(
                      1
                    )} meters of altitude going ${values.ms.toFixed(1)} m/s`}
                  </Popup>
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
        <div className='calendar-container'>
          {days && (
            <Calendar
              tileClassName={({ date, view }) => {
                if (view === 'month') {
                  if (days.includes(date.toISOString().split('T')[0])) {
                    return 'highlight';
                  } else {
                    return 'disabled';
                  }
                } else if (view === 'year') {
                  const s = date.toISOString().split('-');
                  if (s[0] in years && years[s[0]].includes(s[1])) {
                    return 'highlight';
                  } else {
                    return 'disabled';
                  }
                } else if (view === 'decade') {
                  const s = date.toISOString().split('-');
                  if (s[0] in years) {
                    return 'highlight';
                  } else {
                    return 'disabled';
                  }
                }
              }}
              onClickDay={(d) => getDay(d.toISOString().split('T')[0])}
              onViewChange={(view) => {
                if (view === 'decade') return;
              }}
            />
          )}
          <div className='session-container'>
            {sessions && (
              <h3 className='session-title'>Measurement sessions for: {day}</h3>
            )}

            {sessions &&
              sessions.map((entry, i) => (
                <div className='session-tile' key={`${entry.session}_${i}`}>
                  <font
                    color={
                      largestAnomalyForSession(entry.session) > 0.8
                        ? '#E15759'
                        : largestAnomalyForSession(entry.session) > 0.5
                        ? '#F28E2B'
                        : '#EDC948'
                    }
                  >
                    {largestAnomalyForSession(entry.session) > 0.2 && (
                      <FontAwesomeIcon
                        className='session-edr'
                        icon={faWarning}
                      />
                    )}
                  </font>
                  {cleanSessionName(entry.session)}
                  <div className='session-buttons'>
                    <button
                      className='session-route'
                      title='Show route'
                      onClick={() => getSample(day, entry.session)}
                    >
                      <FontAwesomeIcon icon={faCompass} />
                    </button>
                    <a
                      className='session-download'
                      href={`${API}/days/${day}/sessions/${entry.session}/csv`}
                      title='Download CSV'
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
