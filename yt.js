import ytdl from "ytdl-core";

export default async function handler(req, res) {
  try {
    const url = req.query.url;

    if (!url || !ytdl.validateURL(url)) {
      return res.status(400).json({ error: "URL tidak valid" });
    }

    const info = await ytdl.getInfo(url);
    const video = ytdl.chooseFormat(info.formats, { quality: "18" });
    const audio = info.formats.find(f =>
      f.mimeType?.includes("audio") && !f.mimeType.includes("video")
    );

    res.json({
      title: info.videoDetails.title,
      video: video?.url,
      audio: audio?.url,
      thumbnail: info.videoDetails.thumbnails.at(-1).url
    });
  } catch (e) {
    res.status(500).json({ error: "Gagal ambil data" });
  }
}