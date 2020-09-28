export default function artistList(artists) {
  if (artists.length === 0 ||artists[0].name === undefined) {
    return "Undefined";
  }

  let result = "";
  artists.forEach(function(artist, idx, array){
    if (idx === array.length - 1){
      result += artist.name;
    } else {
      result += artist.name + ", ";
    }
  });
  return result;
}
