const EmbedVideo = ({ videoId }: any) => {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&amp;feature=player_detailpage&rel=0&rel=nofollow`}
      width="100%"
      height="100%"
    />
  );
};

export default EmbedVideo;
