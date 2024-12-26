const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'student'
});

connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('成功连接到数据库');
});

app.get('/api/student', (req, res) => {
  const query = 'SELECT * FROM student';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('数据库查询失败:', err.stack);
      return res.status(500).json({ error: '数据库查询失败' });
    }
    res.json(results);
  });
});

app.get('/api/notice', (req, res) => {
  const query = 'SELECT * FROM notice';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('数据库查询失败:', err.stack);
      return res.status(500).json({ error: '数据库查询失败' });
    }
    res.json(results);
  });
});

app.get('/api/plan', (req, res) => {
  const query = 'SELECT * FROM plan';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('数据库查询失败:', err.stack);
      return res.status(500).json({ error: '数据库查询失败' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`服务器正在运行，监听端口 ${port}`);
});
