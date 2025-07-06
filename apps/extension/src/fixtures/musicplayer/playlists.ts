import { convertSpotifyPlaylist } from "@/transforms/spotify";
import { playlists as spotifyPlaylists } from "../spotify/playlists";

export const playlists = spotifyPlaylists.map(convertSpotifyPlaylist);
