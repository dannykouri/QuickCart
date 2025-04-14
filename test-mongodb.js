require('dotenv').config(); // Load biến môi trường từ file .env
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function testConnection() {
  const client = new MongoClient(uri);
  try {
    console.log('🔄 Đang kết nối đến MongoDB...');
    await client.connect();
    console.log('✅ Kết nối thành công!');
    
    // Kiểm tra xem database có hoạt động không
    const databases = await client.db().admin().listDatabases();
    console.log('📦 Danh sách databases:', databases.databases.map(db => db.name));
    
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Đã đóng kết nối');
  }
}

testConnection();