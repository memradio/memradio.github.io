export function getYoutubeEmbed(link) {
    const match = link.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}