import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const images = [
  { title: 'Department', url: '/images/departments.jpg', link: '/main/department' },
  { title: 'Student', url: '/images/students.jpg', link: '/main/students' },
  { title: 'Marksheet', url: '/images/marksheets.jpg', link: '/main/marksheet' },
];

const Dashboard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title d-flex flex-row justify-content-center">Dashboard</h2>

      <div className="carousel-3d">
        <button className="nav-button left" onClick={prev}>❮</button>
        <div className="carousel-wrapper">
          {images.map((img, idx) => {
            const pos = idx - currentIndex;
            return (
              <div
                key={idx}
                className={`carousel-card pos-${pos}`}
                style={{ backgroundImage: `url(${img.url})` }}
              >
                <div className="card-overlay">
                  <h3>{img.title}</h3>
                  <button className="glass-button mt-3" onClick={() => navigate(img.link)}>
                    Explore
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="nav-button right" onClick={next}>❯</button>
      </div>
    </div>
  );
};

export default Dashboard;
