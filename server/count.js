/**
 * Classifier Sift Sift. DAG's 'Count' node implementation
 */
'use strict';

// Entry point for DAG node
module.exports = function (got) {
  const inData = got.in;
  let emailStats = [];

  try{
    emailStats = inData.data.map(d => JSON.parse(d.value));
  }catch(e){
    console.error('classifier-sift: count.js: something went wrong with input:', e);
  }

  console.log('classifier-sift: count.js: running...');
  let words = emailStats
    .map(d => d.words)
    .reduce((p, c) => p + c, 0);

  return [
    { name: 'count', key: 'MESSAGES', value: emailStats.length },
    { name: 'count', key: 'WORDS', value: words }
  ];
};
