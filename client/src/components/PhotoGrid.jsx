import { useCallback, useEffect, useRef, useState } from "react"
import { parseLinkHeader } from "../functions/parseLinkHeader"

export default function PhotoGrid() {
    const [photos, setPhotos] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const nextPhotoUrlRef = useRef()

    const BASE_URL = import.meta.env.VITE_API_URL
    const LIMIT = 10

    async function fetchPhotos(url, { overwrite = false } = {}) {
        setIsLoading(true)

        try {
            const res = await fetch(url)
            nextPhotoUrlRef.current = parseLinkHeader(res.headers.get("Link")).next
            const photos = await res.json()

            if (overwrite) {
                setPhotos(photos)
            } else {
                setPhotos(prevPhotos => {
                    return [...prevPhotos, ...photos]
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const imageRef = useCallback((image) => {
        if (image == null || nextPhotoUrlRef.current == null) return

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchPhotos(nextPhotoUrlRef.current)
                observer.unobserve(image)
            }
        })

        observer.observe(image)
    }, [])

    useEffect(() => {
        fetchPhotos(`${BASE_URL}/photos?_page=1&_limit=${LIMIT}`, { overwrite: true })
    }, [])

    return (
        <div className="grid">
            {photos.map((photo, index) => (
                <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.title}
                    ref={index === photos.length - 1 ? imageRef : undefined}
                />
            ))}
            {isLoading && (
                Array.from({ length: LIMIT }, (_, index) => index).map(n => {
                    <div key={n} className="skeleton">Loading...</div>
                })
            )}
        </div>
    )
}