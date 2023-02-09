import artistList from './artistList';

test('get single artist', () => {

  const artists = [{ name: "expected" }];
  let result = artistList(artists);
  expect(result).toEqual('expected');
});

test('get no artist', () => {

  const artists = [{}];
  let result = artistList(artists);
  expect(result).toEqual('Undefined');
});

test('get multiple artists', () => {

  const artists = [{name: "An artist"}, {name: "Another artist"}];
  let result = artistList(artists);
  expect(result).toEqual('An artist, Another artist');
});
