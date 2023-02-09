/**
 * Helper to convert a map to a object to send via socket.io
 * @param aMap the imput Map
 * @return the keys and values of the map as object
 */
export default function mapToObject(aMap) {
  return Array.from(
    aMap.entries()
  ).reduce((o, [key, value]) => {
    o[key] = value;

    return o;
  }, {})
}
