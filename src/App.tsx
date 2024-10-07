import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Feature, FeatureCollection } from 'geojson'
import CountryPopup from './components/CountryPopup'
import { db } from './firebase'
import { ref, onValue, set } from 'firebase/database'

interface CountryData {
  photos: string[];
  comment: string;
}

function App() {
  const [countries, setCountries] = useState<FeatureCollection | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Feature | null>(null)
  const [countryData, setCountryData] = useState<Record<string, CountryData>>({})

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => setCountries(data))

    const countryDataRef = ref(db, 'countryData');
    onValue(countryDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCountryData(data);
      }
    });
  }, [])

  const onEachCountry = (country: Feature, layer: L.Layer) => {
    layer.on({
      click: () => setSelectedCountry(country),
    })
    const countryName = country.properties.ADMIN
    const hasPhotos = countryData[countryName]?.photos.length > 0
    layer.setStyle({
      fillColor: hasPhotos ? 'red' : 'white',
      fillOpacity: 0.7,
      weight: 1,
      color: '#666',
    })
  }

  const handlePhotoUpload = (countryName: string, photos: string[], comment: string) => {
    const newCountryData = {
      ...countryData,
      [countryName]: { photos, comment }
    };
    setCountryData(newCountryData);
    set(ref(db, 'countryData'), newCountryData);
    setSelectedCountry(null);
  }

  return (
    <div className="h-screen w-full relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />
        {countries && (
          <GeoJSON 
            data={countries} 
            onEachFeature={onEachCountry}
            key={JSON.stringify(countryData)}
          />
        )}
      </MapContainer>
      {selectedCountry && (
        <CountryPopup
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onUpload={handlePhotoUpload}
          existingData={countryData[selectedCountry.properties.ADMIN]}
        />
      )}
    </div>
  )
}

export default App