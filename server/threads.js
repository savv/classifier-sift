'use strict';

// Entry point for DAG node
module.exports = function (got) {
  // inData contains the key/value pairs that match the given query
  const inData = got.in;
  const query = got.query;
  const threadId = query[0];

  console.log('sift-measure: threads.js: running...', threadId);

  let threadTotal = inData.data.reduce((previous, datum) => {
    const countInfo = JSON.parse(datum.value);
    return previous + countInfo.words;
  }, 0);

  let value = { words: threadTotal, messages: inData.data.length };
  return { name: 'threads', key: threadId, value: { list: value, detail: value } };
}
