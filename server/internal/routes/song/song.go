package song

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lctzz540/musicapp/internal/handler/song"
)

func SetupSongRoutes(router fiber.Router) {
	songs := router.Group("/songs")
	songs.Get("", song.FindSongByTitleHandler)
	songs.Get("/playsong", song.StreamSong)
	songs.Get("/getallartist", song.GetAllArtistsHandler)
	songs.Get("/getallsongs", song.GetAllSong)
	songs.Get("/getavartar", song.GetAvatarByIDHandler)
	songs.Get("/getsongimage", song.GetSongImage)
	songs.Get("/getsongbyartist", song.GetSongByArtist)
	songs.Get("/getduration", song.GetDurationHandler)
	songs.Get("/getsongbygenre", song.GetSongsByGenre)
	songs.Get("/getsongsinlibrary", song.GetSongsInLibrary)
	songs.Get("/findartist", song.FindArtistHandler)
	songs.Get("/getsongbyid", song.GetSongById)
}
