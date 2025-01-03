export interface Song {
    id: number
    year: number
    title: string
    artist: string
    src: string
    genre_id: number
}

export interface Genre {
    id: number
    genre: string
    start_year: number
    y_axis: number
}

export function get_Songs(): Promise<Song[]> {
    return fetch('http://localhost:3000/songs')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .catch((error) => {
            console.error('Error:', error)
            throw error
        })
}

export function get_Genres(): Promise<Genre[]> {
    return fetch('http://localhost:3000/genres')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .catch((error) => {
            console.error('Error:', error)
            throw error
        })
}

export function get_Genre_Songs(genreid: number): Promise<Song[]> {
    return fetch(`http://localhost:3000/songs`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .then((songs: Song[]) => {
          return songs.filter(song => song.genre_id === genreid)
        })
        .catch((error) => {
            console.error('Error:', error)
            throw error
        })
}

export function get_Genre_from_id(id: number): Promise<Song[]> {
    return fetch(`http://localhost:3000/genres?genre_id=${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => data.genre)
        .catch((error) => {
            console.error('Error:', error)
            throw error
        })
}
