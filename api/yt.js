import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "URL tidak valid" });
  }

  try {
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
          Accept: "*/*",
        },
      },
    });

    const formats = ytdl.filterFormats(info.formats, "videoandaudio");

    res.status(200).json({
      title: info.videoDetails.title,
      formats: formats.slice(0, 5).map((f) => ({
        quality: f.qualityLabel,
        mimeType: f.mimeType,
        url: f.url,
      })),
    });
  } catch (err) {
    res.status(500).json({
      error: "Gagal ambil data",
      detail: err.message,
    });
  }
}
