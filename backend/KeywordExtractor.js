const natural = require("natural");
const sw = require("stopword");

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

function cleanText(text) {
  if (!text || typeof text !== "string") return [];

  text = text.toLowerCase();
  text = text.replace(/[^\w\s]/gi, "");
  text = text.replace(/\d+/g, "");

  let tokens = tokenizer.tokenize(text);

  tokens = sw.removeStopwords(tokens);

  tokens = tokens
    .filter(word => word.length > 2)
    .map(word => stemmer.stem(word));

  return tokens;
}

function extractKeywords(documents) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return [];
  }

  const tfidf = new natural.TfIdf();
  let validDocs = 0;

  documents.forEach(doc => {
    const tokens = cleanText(doc);

    if (tokens.length > 0) {
      tfidf.addDocument(tokens.join(" "));
      validDocs++;
    }
  });

  if (validDocs === 0) return [];

  const globalScores = {};

  for (let i = 0; i < validDocs; i++) {
    tfidf.listTerms(i).forEach(term => {
      if (!globalScores[term.term]) {
        globalScores[term.term] = 0;
      }
      globalScores[term.term] += term.tfidf;
    });
  }

  const topKeywords = Object.entries(globalScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(item => item[0]);

  return topKeywords;
}

module.exports = extractKeywords;