const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

export type LastFMRecentTrack = {
  name: string;
  artist: string;
  album?: string;
  url?: string;
  imageUrl?: string;
  nowPlaying: boolean;
};

type LastFMImage = { size: string; "#text": string };

type LastFMTrackResponse = {
  name?: string;
  url?: string;
  artist?: { "#text"?: string };
  album?: { "#text"?: string };
  image?: LastFMImage[];
  "@attr"?: { nowplaying?: string };
};

type RecentTrack = { track?: LastFMTrackResponse | LastFMTrackResponse[] };

type LastFMRecentTracksResponse = { recenttracks?: RecentTrack; error?: number; message?: string };

const getApiKey = () => import.meta.env.LASTFM_API_KEY;

function normalizeTrack(track: LastFMTrackResponse): LastFMRecentTrack | undefined {
  if (!track.name || !track.artist?.["#text"]) return undefined;

  return {
    name: track.name,
    artist: track.artist["#text"],
    album: track.album?.["#text"] || undefined,
    url: track.url,
    imageUrl: track.image
      ?.slice()
      .reverse()
      .find((image) => image["#text"])?.["#text"],
    nowPlaying: track["@attr"]?.nowplaying === "true",
  };
}

export async function getLastPlayedTrack(user: string): Promise<LastFMRecentTrack | undefined> {
  const apiKey = getApiKey();
  if (!apiKey) return undefined;

  const opts = { method: "user.getRecentTracks", user, api_key: apiKey, format: "json", limit: "1" };
  const params = new URLSearchParams(opts);

  try {
    const response = await fetch(`${BASE_URL}?${params}`);
    if (!response.ok) return undefined;

    const data = (await response.json()) as LastFMRecentTracksResponse;
    if (data.error) return undefined;

    const track = Array.isArray(data.recenttracks?.track) ? data.recenttracks.track[0] : data.recenttracks?.track;
    return track ? normalizeTrack(track) : undefined;
  } catch {
    return undefined;
  }
}
