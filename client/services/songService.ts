import axios from "axios";
import { API_URL } from "@env";

const API_BASE_URL = `${API_URL}/api/songs`;

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  image: string;
  location: string;
}

export async function getAllSongs(): Promise<Song[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/songs`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch songs");
  }
}

export async function getSongFile(id: string): Promise<Blob> {
  try {
    const response = await axios.get(`${API_BASE_URL}/playsong?id=${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch song");
  }
}

export async function getAllArtists(): Promise<Artist[]> {
  try {
    const response = await axios.get<Artist[]>(`${API_BASE_URL}/getallartist`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch artists");
  }
}

export interface Artist {
  id: string;
  name: string;
}

export async function getArtistAvatarById(id: string): Promise<string> {
  try {
    const response = await axios.get<string>(
      `${API_BASE_URL}/artists/avatar/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch artist avatar");
  }
}

export interface SongResponse {
  id: string;
  title: string;
  genre: string;
}

export const getSongByArtist = async (
  artistId: string
): Promise<SongResponse[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getsongbyartist?artist_id=${artistId}`
    );
    return response.data as SongResponse[];
  } catch (error) {
    throw new Error("Failed to fetch songs by artist");
  }
};

export const getDurationService = async (songId: string): Promise<number> => {
  try {
    const response = await axios.get<any>(
      `${API_BASE_URL}/getduration?id=${songId}`
    );
    return response.data.duration;
  } catch (error) {
    console.error("Failed to get duration of song:", error);
    throw new Error("Failed to get duration of song");
  }
};
export const getSongByGenre = async (
  genre: string
): Promise<SongResponse[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getsongbygenre?genre=${genre}`
    );
    return response.data as SongResponse[];
  } catch (error) {
    throw new Error("Failed to fetch songs by artist");
  }
};

export const getSongsInLibraryService = async (
  userID: string
): Promise<SongResponse[]> => {
  try {
    const response = await axios.get<SongResponse[]>(
      `${API_BASE_URL}/getsongsinlibrary?userID=${userID}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch songs in library:", error);
    throw error;
  }
};

export const findArtistByName = async (name: string): Promise<Artist[]> => {
  try {
    const response = await axios.get<Artist[]>(`${API_BASE_URL}/findartist`, {
      params: {
        name: name,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to find artists by name:", error);
    throw error;
  }
};
