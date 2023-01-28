//List of playlists of the logged-in user
export type PlaylistOverview = {
  items: Array<PlaylistOverviewItem>
}

//Overview over a playlists containing collaborator information but no tracks
export type PlaylistOverviewItem = {
  id: string
  name: string
  owner: {
    display_name: string
  }
  images: Array<Image>
  tracks: {
    total: number
  }
}

// Individual Playlist containing tracks
export type Playlist = {
  items: Array<PlaylistItem>
}

// Playlist item metadata
export type PlaylistItem = {
  // User who added this song
  added_by: {
    id: string
    href: string
    type: string
  }
  // Track information
  track: Track
}

// The spotify track object containing all required details
type Track = {
  id: string
  name: string
  owner: {
    display_name: string
  }
  preview_url: string
  tracks: {
    total: number
  }
  artists: Array<Artist>
  album: {
    name: string
    images: Array<Image>
  }
}

type Image = {
  height: number
  width: number
  url: string
}

type Artist = {
  name: string
}
