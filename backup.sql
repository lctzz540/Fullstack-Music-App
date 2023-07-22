--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: album_songs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.album_songs (
    album_id uuid NOT NULL,
    song_id uuid NOT NULL
);


ALTER TABLE public.album_songs OWNER TO postgres;

--
-- Name: albums; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.albums (
    id uuid NOT NULL,
    name character varying(50),
    image character varying(255),
    release_date timestamp without time zone
);


ALTER TABLE public.albums OWNER TO postgres;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artists (
    id character(36) NOT NULL,
    name character varying(20),
    avatar text
);


ALTER TABLE public.artists OWNER TO postgres;

--
-- Name: songs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.songs (
    id uuid NOT NULL,
    title character varying(50),
    album text,
    genre character varying(10),
    location text,
    image text,
    artist text,
    artist_id character(36)
);


ALTER TABLE public.songs OWNER TO postgres;

--
-- Name: user_songs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_songs (
    user_id uuid NOT NULL,
    song_id uuid NOT NULL
);


ALTER TABLE public.user_songs OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    first_name character varying(20),
    last_name character varying(20),
    email text,
    password text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: album_songs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.album_songs (album_id, song_id) FROM stdin;
\.


--
-- Data for Name: albums; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.albums (id, name, image, release_date) FROM stdin;
e566a694-b92a-4404-847d-7709a2c8e0bd	Cái đầu tiên	./albumimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	2023-04-30 00:00:00
\.


--
-- Data for Name: artists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artists (id, name, avatar) FROM stdin;
ef2f25c6-6a30-4445-b5a4-8e9f75cb06b7	Thái Đinh	./artist_avatar/thaidinh.jpeg
0f310430-3ad6-4193-986d-9577c0780b06	Vũ	./artist_avatar/vu.jpeg
159e186e-0638-4a52-8b92-aa2033cbaeed	Thùy Chi	./artist_avatar/thuychi.jpeg
a614fc53-9f18-44f9-96c9-f9bfe22f2f13	Grey D & Orange	./artist_avatar/greyd.jpeg
620e9129-eb6c-4443-a732-c4306b252220	Emcee (DALAB)	./artist_avatar/emcee.jpeg
87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8	Thắng	./artist_avatar/thang.jpeg
\.


--
-- Data for Name: songs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.songs (id, title, album, genre, location, image, artist, artist_id) FROM stdin;
8c99ab5e-f389-4dca-bc24-31640ca7c196	Sober Song	Cái đầu tiên	VPOP	./music/SoberSong.mp3	./songimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	Thắng	87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8
85e11da7-dc3b-4ec7-a321-f209573ceeab	Trước khi em tồn tại	Cái đầu tiên	VPOP	./music/TruocKhiEmTonTai.mp3	./songimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	Thắng	87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8
80923009-1824-4d9c-aeee-5c0b1e5ef021	Limo	Cái đầu tiên	VPOP	./music/Limo.mp3	./songimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	Thắng	87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8
2cba2d05-2114-40c4-a97b-cbce1cbb6f3d	Tinkerbell	Cái đầu tiên	VPOP	./music/Tinkerbell.mp3	./songimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	Thắng	87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8
f653f29f-a83a-475b-a491-bc9869363345	Mất thời gian	Cái đầu tiên	VPOP	./music/MatThoiGian.mp3	./songimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	Thắng	87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8
d4c739a4-b212-4ee1-9247-80e628c16edf	Save it for your boyfriends	Cái đầu tiên	VPOP	./music/SaveItForYourBoyfriends.mp3	./songimage/ab6761610000e5ebc196ed35d9425d0abe9d2f63.jpeg	Thắng	87e371d8-fb0d-4e1b-95d8-1902b3f1a5c8
bef983bd-c75a-4b3b-ab38-0c5c2032a3c5	Lời Tạm Biệt Chưa Nói	Huong Mua Ha	VPOP	./music/LoiTamBietChuaNoi.mp3	./songimage/1658391970153_300.jpg	Grey D & Orange	a614fc53-9f18-44f9-96c9-f9bfe22f2f13
b37f1ebe-6874-427b-8131-57e81043ae09	Đi Qua Mùa Hạ	Di Qua Mua Ha (single)	VPOP	./music/DiQuaMuaHa.mp3	./songimage/1563500239222_640.jpg	Thái Đinh	ef2f25c6-6a30-4445-b5a4-8e9f75cb06b7
9c79f02d-d2ed-4ed0-b245-477132b54489	Hơn Em Chỗ Nào	Hon Em Cho Nao (single)	VPOP	./music/HonEmChoNao.mp3	./songimage/026c7dba683d29f57931ab7dbbe321ba.jpg	Thùy Chi	159e186e-0638-4a52-8b92-aa2033cbaeed
85f5540a-bd82-4c93-98a1-6ecee6794587	Chuyện Đôi Ta	Chuyen Doi Ta (single)	VPOP	./music/ChuyenDoiTa.mp3	./songimage/ab67616d0000b273a400211178f6d590d875f2da.jpeg	Emcee L (DALAB)	620e9129-eb6c-4443-a732-c4306b252220
0af6b780-c7d7-494f-8ae4-efaf8819ee7f	Anh Nhớ Ra	Mot Van Nam	ROCK	./music/AnhNhoRa.mp3	./songimage/2284248698322291325_mq.jpg	Vũ	0f310430-3ad6-4193-986d-9577c0780b06
\.


--
-- Data for Name: user_songs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_songs (user_id, song_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, created_at) FROM stdin;
8f9eccc1-d5b3-4ce9-bbe4-c2802b00fb61	Test	User	test@email.com	daylataikhoantest	2023-07-22 16:05:03.979201+00
\.


--
-- Name: album_songs album_songs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album_songs
    ADD CONSTRAINT album_songs_pkey PRIMARY KEY (album_id, song_id);


--
-- Name: albums albums_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_name_key UNIQUE (name);


--
-- Name: albums albums_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.albums
    ADD CONSTRAINT albums_pkey PRIMARY KEY (id);


--
-- Name: artists artists_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_name_key UNIQUE (name);


--
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_pkey PRIMARY KEY (id);


--
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_pkey PRIMARY KEY (id);


--
-- Name: user_songs user_songs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_songs
    ADD CONSTRAINT user_songs_pkey PRIMARY KEY (user_id, song_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: album_songs album_songs_album_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album_songs
    ADD CONSTRAINT album_songs_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id);


--
-- Name: album_songs album_songs_song_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.album_songs
    ADD CONSTRAINT album_songs_song_id_fkey FOREIGN KEY (song_id) REFERENCES public.songs(id);


--
-- Name: songs fk_songs_artist; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT fk_songs_artist FOREIGN KEY (artist_id) REFERENCES public.artists(id);


--
-- Name: user_songs fk_user_songs_song; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_songs
    ADD CONSTRAINT fk_user_songs_song FOREIGN KEY (song_id) REFERENCES public.songs(id);


--
-- Name: user_songs fk_user_songs_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_songs
    ADD CONSTRAINT fk_user_songs_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

