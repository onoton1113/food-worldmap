import React, { useState, useRef, useEffect } from 'react'
import { Feature } from 'geojson'

interface CountryPopupProps {
  country: Feature
  onClose: () => void
  onUpload: (countryName: string, photos: string[], comment: string) => void
  existingData?: { photos: string[], comment: string }
}

const CountryPopup: React.FC<CountryPopupProps> = ({ country, onClose, onUpload, existingData }) => {
  const [photos, setPhotos] = useState<string[]>(existingData?.photos || [])
  const [comment, setComment] = useState(existingData?.comment || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (existingData) {
      setPhotos(existingData.photos)
      setComment(existingData.comment)
    }
  }, [existingData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpload(country.properties.ADMIN, photos, comment)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      setPhotos(prev => [...prev, ...newPhotos])
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-y-auto">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full m-4">
        <h2 className="text-2xl font-bold mb-4">{country.properties.ADMIN}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              Add Photos
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              multiple
            />
          </div>
          <div className="mb-4 grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CountryPopup