const csv = require('csv-parser');
const stream = require('stream');

const fileProcessor = {
  processCSV: (buffer) => {
    return new Promise((resolve, reject) => {
      const results = [];
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);
      
      bufferStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  },

  processJSON: (buffer) => {
    try {
      const jsonString = buffer.toString('utf8');
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }
};

module.exports = fileProcessor;