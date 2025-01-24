const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

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

function createGetEndpoint(path, name) {
  app.get(path, (req, res) => {
    const query = `SELECT * FROM ${name}`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('数据库查询失败:', err.stack);
        return res.status(500).json({ error: '数据库查询失败' });
      }
      console.log(`已查询到${name}`);
      res.json(results);
    });
  });
}

createGetEndpoint('/api/student', 'student');
createGetEndpoint('/api/notice', 'notice');
createGetEndpoint('/api/plan', 'plan');
createGetEndpoint('/api/subplan', 'subplan');

app.post('/api/addSubplan', (req, res) => {
  const { content, completion = false, planID } = req.body; // 从前端接收数据

  const sql = 'INSERT INTO subplan (content, completion, planID) VALUES (?, ?, ?)';
  connection.query(sql, [content, completion, planID], (err, result) => {
    if (err) {
      console.error('插入数据失败:', err);
      return res.status(500).send({ error: '插入数据失败', details: err });
    }
    res.status(200).send({ message: '数据插入成功', result });
  });
});

app.listen(port, () => {
  console.log(`服务器正在运行，监听端口 ${port}`);
});
