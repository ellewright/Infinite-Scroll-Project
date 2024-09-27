import { useState, useEffect } from "react"
import axios from "axios"

export default function PhotoGrid() {
    const [photos, setPhotos] = useState([])

    const PHOTOS_URL = `${import.meta.env.VITE_API_URL}/photos-short-list`

    useEffect(() => {
        axios.get(PHOTOS_URL)
            .then(res => {
                setPhotos(res.data)
            }).catch(err => {
                console.error(err)
            })
    }, [])

    return (
        <>
            <div className="grid">
                {photos.length > 0 ? photos.map(photo => (
                    <img key={photo.id} src={photo.url} alt={photo.title} />
                )) : (<></>)
                }
            </div>
        </>
    )
}