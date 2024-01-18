// Importiere benötigte React-Bibliotheken und Styled Components
import React, { useState, useEffect } from 'react';
import * as S from './styles';

// Funktion zum Abrufen von Stadtbildern von der Pixabay API
const fetchCityImage = async (cityName, apiKey) => {
  try {
    // API-Anfrage an Pixabay für das Stadtbild
    const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${cityName}&image_type=photo`);

    // Überprüfe, ob die Anfrage abgelehnt wurde (Rate Limit überschritten)
    if (response.status === 429) {
      throw new Error('Rate Limit Exceeded');
    }

    // Konvertiere die Antwort in JSON
    const data = await response.json();

    // Gib die URL des ersten gefundenen Bildes oder eine Standard-URL zurück
    return data.hits[0]?.webformatURL || 'default-background-url';
  } catch (error) {
    console.error('Fehler beim Abrufen des Stadtbildes:', error);
    return 'default-background-url';
  }
};

// Hauptkomponente für die Wetteranwendung
const App = () => {
  // Zustandsvariablen für Stadtname, Wetterdaten, Ladezustand, Fehler und Hintergrundbild-URL
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState({ conditionCode: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');

  // Funktion zum Abrufen von Wetterdaten und Stadtbild basierend auf dem Stadtnamen
  const fetchWeatherAndImage = async (cityName) => {
    // API-Schlüssel für OpenWeatherMap und Pixabay
    const weatherApiKey = '5643e9c4710b08c109913bf3ac7c8d64';
    const pixabayApiKey = '41900374-b21772694feea8499851be999';

    // API-URL für OpenWeatherMap
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${weatherApiKey}`;

    // Setze Ladezustand und Fehler zurück
    setLoading(true);
    setError(null);

    try {
      // Abruf von Wetterdaten von OpenWeatherMap
      const weatherResponse = await fetch(weatherApiUrl);

      // Überprüfe, ob die Anfrage abgelehnt wurde (Rate Limit überschritten)
      if (weatherResponse.status === 429) {
        throw new Error('Too Many Requests. API Limit Exceeded');
      }

      // Konvertiere die Antwort in JSON
      const weatherData = await weatherResponse.json();

      // Überprüfe, ob die erhaltene Datenstruktur gültig ist
      if (weatherData.main && weatherData.weather && weatherData.weather[0]) {
        // Setze die Wetterdaten
        setWeatherData(weatherData);

        // Lade das Stadtbild von Pixabay
        const imageUrl = await fetchCityImage(cityName, pixabayApiKey);
        setBackgroundImageUrl(imageUrl);
      } else {
        setError('Ungültiges Datenformat in der API-Antwort');
      }
    } catch (error) {
      // Behandlung von verschiedenen Fehlerfällen
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setError('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
      } else if (error instanceof Error && error.message.includes('Rate Limit Exceeded')) {
        setError('Zu viele Anfragen. Bitte versuchen Sie es später erneut.');
      } else {
        console.error('Fehler beim Abrufen von Daten:', error);
        setError(`Fehler beim Abrufen von Daten: ${error.message}`);
      }
    } finally {
      // Setze den Ladezustand zurück, unabhängig vom Ergebnis
      setLoading(false);
    }
  };

  // Effekt-Hook: Bei Änderungen des Stadt- oder Wetterdaten wird die Funktion aufgerufen
  useEffect(() => {
    if (city.trim() !== '' && weatherData.main) {
      fetchWeatherAndImage(city);
    }
  }, [city, weatherData.main]);

  // Funktion zur Rückgabe der Hintergrundfarbe basierend auf dem Wetterzustand
  const getBackgroundColor = (conditionCode) => {
    switch (conditionCode) {
      case 'Rain':
        return 'grey';
      case 'Clear':
        return 'lightblue';
      default:
        return 'white';
    }
  };

  // Rendering der Hauptkomponente
  return (
    <S.AppContainer style={{ height: '500px', backgroundColor: getBackgroundColor(weatherData?.conditionCode), backgroundImage: `url(${backgroundImageUrl})` }}>
      <S.AppHeader>Wetter App</S.AppHeader>
      <S.SearchContainer>
        {/* Eingabefeld für den Stadtnamen */}
        <S.SearchInput
          type="text"
          placeholder="Geben Sie den Stadtnamen ein"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        {/* Schaltfläche zum Auslösen der Suche */}
        <S.SearchButton onClick={() => fetchWeatherAndImage(city)}>
          Suche
        </S.SearchButton>
      </S.SearchContainer>
      {/* Ladeanzeige */}
      {loading && <p style={{ color: 'white' }}>Laden...</p>}
      {/* Fehlermeldung */}
      {error && <p style={{ color: 'white' }}>{error}</p>}
      {/* Anzeige von Wetterdaten, wenn vorhanden */}
      {weatherData.main && weatherData.weather && weatherData.weather[0] && (
        <S.WeatherDataContainer>
          {/* Wettericon */}
          <S.WeatherIconWrapper>
            <S.WeatherIcon conditionCode={weatherData.weather[0].main} />
          </S.WeatherIconWrapper>
          {/* Stadtname */}
          <h2 style={{ fontSize: '28px', margin: '10px 0', color: 'white' }}>{weatherData.name}</h2>
          {/* Temperatur */}
          <S.Temperature>{`Temperatur: ${weatherData.main.temp}°C`}</S.Temperature>
          {/* Wetterbeschreibung */}
          <S.WeatherDescription>{`Wetter: ${weatherData.weather[0].description}`}</S.WeatherDescription>
        </S.WeatherDataContainer>
      )}
    </S.AppContainer>
  );
};

// Exportiere die App-Komponente als Standardexport
export default App;
