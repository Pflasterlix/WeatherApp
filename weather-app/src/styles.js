import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faSun, faCloud } from '@fortawesome/free-solid-svg-icons';

export const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const AppHeader = styled.h1`
  color: white;
  font-size: 36px;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
`;

export const SearchInput = styled.input`
  padding: 10px;
  margin-right: 5px;  // Geringerer Abstand zwischen Input und Button
  font-size: 16px;
`;

export const SearchButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;  // Beispielhafte Hintergrundfarbe, kannst du nach Bedarf anpassen
  color: white;
  border: none;
  cursor: pointer;
`;

export const WeatherDataContainer = styled.div`
  margin: 20px;
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 20px;
`;

export const WeatherIconWrapper = styled.div`
  font-size: 50px;
  margin-bottom: 10px;
`;

export const Temperature = styled.p`
  font-size: 24px;
  margin-bottom: 5px;
`;

export const WeatherDescription = styled.p`
  font-size: 18px;
`;

export const WeatherIcon = ({ conditionCode }) => {
  switch (conditionCode) {
    case 'Rain':
      return <FontAwesomeIcon icon={faCloudRain} />;
    case 'Clear':
      return <FontAwesomeIcon icon={faSun} />;
    default:
      return <FontAwesomeIcon icon={faCloud} />;
  }
};