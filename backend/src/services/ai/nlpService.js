const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

exports.analyzeText = (text) => {
  const tokens = tokenizer.tokenize(text);
  const sentimentScore = sentiment.getSentiment(tokens);
  
  return {
    tokens,
    sentimentScore,
    wordCount: tokens.length
  };
};

exports.extractKeywords = (text, topN = 5) => {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);
  
  return tfidf.listTerms(0 /* document index */)
    .slice(0, topN)
    .map(item => item.term);
};

exports.categorizeText = (text, categories) => {
  const classifier = new natural.BayesClassifier();
  
  categories.forEach(category => {
    category.examples.forEach(example => {
      classifier.addDocument(example, category.name);
    });
  });
  
  classifier.train();
  return classifier.classify(text);
};