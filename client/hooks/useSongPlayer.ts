import { Player } from "@react-native-community/audio-toolkit";
import { useSelector, useDispatch } from "react-redux";
import {
  setDuration,
  setIsPlaying,
  setPlayer,
  setSongPlaying,
} from "../redux/slices/songSlice";
import { RootState } from "../redux/store";
import {
  getDurationService,
  getSongFile,
  SongResponse,
} from "../services/songService";

const useSongPlayer = () => {
  const dispatch = useDispatch();

  const isPlaying = useSelector((state: RootState) => state.song.isPlaying);
  const player = useSelector((state: RootState) => state.song.player);
  const songPlaying = useSelector((state: RootState) => state.song.songPlaying);

  const playSong = async (song: SongResponse) => {
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
  };

  return playSong;
};

export default useSongPlayer;
