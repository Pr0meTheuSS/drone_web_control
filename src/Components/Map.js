// MapComponent.js
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css'; // Добавляем стили карты

const MapComponent = ({ selectedDrone, drones }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]); // Для хранения маркеров дронов

  useEffect(() => {
    // Инициализация карты
    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [0, 0], // Начальное положение карты
      zoom: 2, // Начальный зум
    });

    // Получение текущего положения пользователя
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          // Центрируем карту на текущем положении пользователя
          mapRef.current.setCenter([longitude, latitude]);
          mapRef.current.setZoom(13);
        },
        (error) => {
          console.error("Ошибка получения местоположения: ", error);
        }
      );
    } else {
      console.error("Геолокация не поддерживается вашим браузером.");
    }

    // Создание маркеров для всех дронов
    if (drones) {
      drones.forEach(drone => {
        const { longitude, latitude } = drone;
        const marker = new maplibregl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current)
          .getElement(); // Получаем элемент маркера

        // Добавляем обработчик события клика на маркер
        marker.addEventListener('click', () => {
          alert(`Дрон: ${drone.name}\nСтатус: ${drone.status}`); // Показываем алерт с информацией о дроне
        });

        // Сохраняем маркер в массив
        markerRefs.current.push(marker);
      });
    }

    // Очистка карты при демонтировании
    return () => {
      // Проверяем наличие маркеров перед удалением
      markerRefs.current.forEach(marker => {
        if (marker) {
          // Удаляем маркер, если он существует
          marker.remove(); 
        }
      });
      if (mapRef.current) {
        mapRef.current.remove(); // Удаляем карту, если она существует
      }
    };
  }, [drones]);

  useEffect(() => {
    // Обновление маркера и центра карты при изменении положения дрона
    if (selectedDrone && mapRef.current) {
      const { longitude, latitude } = selectedDrone;
      const marker = new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);
      
      markerRefs.current.push(marker); // Сохраняем маркер для выбранного дрона
      mapRef.current.setCenter([longitude, latitude]);

      // Удаляем предыдущий маркер, если он существует
      return () => {
        marker.remove();
      };
    }
  }, [selectedDrone]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapContainerRef}
        style={{ width: '100%', height: '100%', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default MapComponent;
