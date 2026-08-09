const fs = require('fs');
const path = require('path');

class RAGService {
  async getContext(query) {
    try {
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) return '';

      const files = fs.readdirSync(uploadsDir);
      let contextBlocks = [];

      for (const file of files) {
        if (file.endsWith('.txt')) {
          const filePath = path.join(uploadsDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          // Simple keyword/proximity check
          if (content.toLowerCase().includes(query.toLowerCase())) {
            contextBlocks.push(content.substring(0, 1000));
          }
        }
      }

      return contextBlocks.join('\n\n');
    } catch (e) {
      console.error('RAG service query failed:', e);
      return '';
    }
  }
}

module.exports = new RAGService();
