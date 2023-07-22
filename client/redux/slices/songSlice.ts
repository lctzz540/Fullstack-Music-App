import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "@react-native-community/audio-toolkit";
import {
  getDurationService,
  getSongFile,
  SongResponse,
} from "../../services/songService";
import { RootState } from "../store";

interface SongState {
  songs: SongResponse[];
  player: Player | null;
  isPlaying: boolean;
  duration: number;
  songPlaying?: SongResponse | null;
  progress: number;
}

const initialState: SongState = {
  songs: [],
  player: null,
  isPlaying: false,
  duration: 0,
  progress: 0,
};

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
      const audioBlob = await getSongFile(song.id);
      dispatch(setSongPlaying(song));
      dispatch(setDuration(await getDurationService(song.id)));

      const reader = new FileReader();
      reader.onload = () => {
        const audioUrl = reader.result as string;

        const newPlayer = new Player(audioUrl, { autoDestroy: false });
        newPlayer.play();
        dispatch(setIsPlaying(true));

        if (player) {
          player.destroy();
        }

        dispatch(setPlayer(newPlayer));
      };

      reader.readAsDataURL(audioBlob);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(playSong.pending, () => { })
      .addCase(playSong.fulfilled, () => { })
      .addCase(playSong.rejected, () => { })
      .addCase(pauseSong.pending, () => { })
      .addCase(pauseSong.fulfilled, () => { })
      .addCase(pauseSong.rejected, () => { });
  },
});

export const {
  setSongs,
  setPlayer,
  setIsPlaying,
  setDuration,
  setSongPlaying,
  setProgress,
} = songSlice.actions;

export default songSlice.reducer;
