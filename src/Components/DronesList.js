// src/DroneList.js
import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const drones = [
  { id: 1, name: 'Drone 1', status: 'Active', longitude: 84.23, latitude: 55.45 },
  { id: 2, name: 'Drone 2', status: 'Inactive', longitude: 30.6, latitude: 50.6 },
  // Добавьте больше дронов с их координатами, если нужно
];

const DroneList = ({ onSelectDrone }) => {
  const [videoSrc, setVideoSrc] = useState(null); // Состояние для хранения URL видео
  const [isVideoOpen, setIsVideoOpen] = useState(false); // Состояние для управления открытием видео

  const handleVideoOpen = (drone) => {
    setVideoSrc(`rtp://example.com/${drone.id}`); // Замените на реальный адрес RTP
    setIsVideoOpen(true);
  };

  const handleVideoClose = () => {
    setIsVideoOpen(false);
    setVideoSrc(null); // Сбросить URL видео
  };

  return (
    <div className="drone-list">
      {drones.map(drone => (
        <div key={drone.id} className="drone-item">
          <h3>{drone.name}</h3>
          <p>Status: {drone.status}</p>
          <button onClick={() => handleVideoOpen(drone)}>Видео</button>
          <button onClick={() => onSelectDrone(drone)}>Отслеживать</button>
        </div>
      ))}
      {isVideoOpen && <VideoPlayer src={videoSrc} onClose={handleVideoClose} />}
    </div>
  );
};

export default DroneList;
