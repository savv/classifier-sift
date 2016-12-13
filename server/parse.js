/**
 * Classifier Sift Sift. DAG's 'Parse' node implementation
 */
'use strict';

var spawnSync = require('child_process').spawnSync;

function hasSchedulingIntent(email) {
  // Convert email object into a one-line text similar to our fastText training samples.
  let text = email.textBody || email.strippedHtmlBody || '';
  text = 'SUBJECT: ' + (email.subject || '') + ' ' + text;
  text = text.replace(/\n/g, ' ');

  // Call the fastText binary and return true or false depending on its output.
  var resp = spawnSync(
    './fastText/fasttext', ['predict', 'fastText/model.bin', '-'], {input: text + '\n'})
  return resp.stdout.toString() == '__label__Scheduling_Intent\n';
}

// Javascript nodes are run in a Node.js sandbox so you can require dependencies following the node paradigm
// e.g. var moment = require('moment');

// Entry point for DAG node
module.exports = function (got) {
  // inData contains the key/value pairs that match the given query
  const inData = got['in'];

  console.log('classifier-sift: parse.js: running...');

  let results = [];
  inData.data.map(function (datum) {
    console.log('classifier-sift: parse.js: parsing: ', datum.key);
    // Parse the JMAP information for each message more info here https://docs.redsift.com/docs/server-code-jmap
    const jmapInfo = JSON.parse(datum.value);
    // Not all emails contain a textBody so we do a cascade selection
    const body = jmapInfo.textBody || jmapInfo.strippedHtmlBody || '';
    const text = 'SUBJECT: ' + (datum.subject || '') + ' ' + body;
    const wordsValue = {
        words: countWords(body),
        schedIntent: hasSchedulingIntent(jmapInfo),
        text: text
    };
    // Emit into "messages" stores so count can be calculated by the "Count" node
    results.push({ name: 'messages', key: jmapInfo.id, value: wordsValue });
    // Emit information on the thread id so we can display them in the email list and detail
    results.push({ name: 'threadMessages', key: `${jmapInfo.threadId}/${jmapInfo.id}`, value: wordsValue });
  });

  // Possible return values are: undefined, null, promises, single or an array of objects
  // return objects should have the following structure
  // {
  //   name: '<name of node output>',
  //   key: 'key1',
  //   value: '1'
  // };
  return results;
};

/**
 * Simple function to count number of words in a string
 */
function countWords(body) {
  let s = body.replace(/\n/gi, ' ');
  s = s.replace(/(^\s*)|(\s*$)/gi, '');
  s = s.replace(/[ ]{2,}/gi, '');
  return s.split(' ').length;
}
