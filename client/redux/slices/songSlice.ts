import {
  createAction,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Player } from "@react-native-community/audio-toolkit";
import { RootState } from "../store";
import { getDurationService, SongResponse } from "../../services/songService";
import { API_URL } from "@env";

interface SongState {
  songs: SongResponse[];
  player: Player | null;
  isPlaying: boolean;
  duration: number;
  songPlaying?: SongResponse | null;
  progress: number;
  playlist: string[];
  autoplayEnabled: boolean;
}

const initialState: SongState = {
  songs: [],
  player: null,
  isPlaying: false,
  duration: 0,
  progress: 0,
  playlist: [],
  autoplayEnabled: false,
};

export const addSongToPlaylist = createAsyncThunk<
  void,
  string,
  { state: RootState }
>("song/addSongToPlaylist", async (songId: string, { getState }) => {
  const state = getState();
  const { playlist } = state.song;

  if (!playlist.some((id) => id === songId)) {
    return songId;
  }
});

export const playSong = createAsyncThunk<
  void,
  SongResponse,
  { state: RootState }
>("song/playSong", async (song: SongResponse, { getState, dispatch }) => {
  const state = getState();
  const { player, isPlaying, songPlaying } = state.song;

  if (song.id !== songPlaying?.id) {
    if (player && isPlaying) {
      player.pause();
    }

    try {
      dispatch(setSongPlaying(song));
      dispatch(setDuration(await getDurationService(song.id)));

      const audioUrl = `${API_URL}/api/songs/playsong?id=${song.id}`;

      const newPlayer = new Player(audioUrl);
      newPlayer.play();
      dispatch(setIsPlaying(true));

      if (player) {
        player.destroy();
      }

      dispatch(setPlayer(newPlayer));
    } catch (error) {
      console.error("Failed to play the song:", error);
    }
  } else {
    if (player && !isPlaying) {
      player.play();
      dispatch(setIsPlaying(true));
    }
  }
});

export const pauseSong = createAsyncThunk<void, void, { state: RootState }>(
  "song/pauseSong",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { player } = state.song;

    if (player) {
      player.pause();
      dispatch(setIsPlaying(false));
    }
  }
);

export const shufflePlaylist = createAction("song/shufflePlaylist");

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<SongResponse[]>) => {
      state.songs = action.payload;
    },
    setPlayer: (state, action: PayloadAction<Player | null>) => {
      state.player = action.payload;
      state.progress = 0;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setSongPlaying: (
      state,
      action: PayloadAction<SongResponse | undefined>
    ) => {
      state.songPlaying = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setAutoplayEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoplayEnabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addSongToPlaylist.pending, () => { })
      .addCase(addSongToPlaylist.fulfilled, (state, action) => {
        if (action.payload) {
          state.playlist.push(action.payload);
        }
      })
      .addCase(addSongToPlaylist.rejected, () => { })
      .addCase(playSong.pending, () => { })
      .addCase(playSong.fulfilled, () => { })
      .addCase(playSong.rejected, () => { })
      .addCase(pauseSong.pending, () => { })
      .addCase(pauseSong.fulfilled, () => { })
      .addCase(pauseSong.rejected, () => { })
      .addCase(shufflePlaylist, (state) => {
        if (state.songPlaying) {
          const shuffledPlaylist = [...state.playlist];
          const currentIndex = shuffledPlaylist.indexOf(state.songPlaying.id);
          if (currentIndex !== -1) {
            const [removedSongId] = shuffledPlaylist.splice(currentIndex, 1);
            shuffledPlaylist.sort(() => Math.random() - 0.5);
            shuffledPlaylist.unshift(removedSongId);
            state.playlist = shuffledPlaylist;
          }
        }
      });
  },
});

export const {
  setSongs,
  setPlayer,
  setIsPlaying,
  setDuration,
  setSongPlaying,
  setProgress,
  setAutoplayEnabled,
} = songSlice.actions;

export default songSlice.reducer;
