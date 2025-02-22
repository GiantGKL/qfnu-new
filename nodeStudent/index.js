const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// 数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'student',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 中间件：JWT验证
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供令牌' });
  }

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效' });
    }
    req.user = decoded;
    req.teacherId = decoded.teacherId;
    next();
  });
};

app.use(cors({
  origin: 'http://localhost:5173', // 确保这里的 origin 是前端的地址
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 通用的数据库查询函数
async function queryDatabase(query, res) {
  try {
    const [results] = await pool.execute(query);
    res.json(results);
  } catch (err) {
    console.error('数据库查询失败:', err.stack);
    res.status(500).json({ error: '数据库查询失败' });
  }
}

// 获取所有作业
app.get('/api/task', (req, res) => {
  queryDatabase('SELECT * FROM task', res);
});

// 获取单个作业详情
app.get('/api/task/:id', async (req, res) => {
  const query = `SELECT * FROM task WHERE task_id = ?`;
  try {
    const [results] = await pool.execute(query, [req.params.id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    console.error('Failed to fetch task detail:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 其他API
app.get('/api/student', (req, res) => {
  queryDatabase('SELECT * FROM student', res);
});

app.get('/api/notice', (req, res) => {
  queryDatabase('SELECT * FROM notice', res);
});

// 更新任务完成状态
app.put('/api/task/:id/complete', async (req, res) => {
  const query = `UPDATE task SET is_completed = 1 WHERE task_id = ${req.params.id}`;
  try {
    await pool.execute(query);
    res.json({ message: 'Task marked as completed' });
  } catch (err) {
    console.error('Failed to update task completion:', err.stack);
    res.status(500).json({ error: 'Failed to update task completion' });
  }
});

// 登录路由
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [results] = await pool.execute(
      'SELECT * FROM students WHERE StudentID = ?',
      [username]
    );

    if (results.length === 0) {
      return res.status(404).send({ message: "未找到用户" });
    }

    const validPassword = await bcrypt.compare(password, results[0].password);
    if (!validPassword) {
      return res.status(401).send({ message: "密码错误" });
    }

    const token = jwt.sign({ id: results[0].StudentID, role: results[0].role }, 'your_secret_key');
    res.status(200).send({
      message: "登录成功",
      user: {
        id: results[0].StudentID,
        username: results[0].StudentID,
        role: results[0].role
      },
      token: token
    });
  } catch (error) {
    res.status(500).send({ message: "服务器错误" });
  }
});

// 注册路由
app.post('/api/register', async (req, res) => {
  const { name, username, password, role } = req.body;

  try {
    const [existingUser] = await pool.execute('SELECT * FROM students WHERE StudentID = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: '用户已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO students (Name, StudentID, password, role) VALUES (?, ?, ?, ?)',
      [name, username, hashedPassword, role]
    );
    res.status(201).json({ message: '注册成功' });
  } catch (err) {
    console.error('注册失败:', err.stack);
    res.status(500).json({ error: '注册失败' });
  }
});

// 获取学生列表
app.get('/api/students', async (req, res) => {
  const query = 'SELECT StudentID, Name FROM students';
  try {
    const [results] = await pool.execute(query);
    console.log('查询结果:', results);
    res.json(results);
  } catch (err) {
    console.error('Failed to fetch students:', err.stack);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// 获取组员列表
app.get('/api/group_members', async (req, res) => {
  const teacherId = req.query.teacherId;
  const query = 'SELECT s.StudentID, s.Name FROM group_members gm JOIN students s ON gm.StudentID = s.StudentID WHERE gm.TeacherID = ?';
  try {
    const [results] = await pool.execute(query, [teacherId]);
    res.json(results);
  } catch (err) {
    console.error('Failed to fetch group members:', err.stack);
    res.status(500).json({ error: 'Failed to fetch group members' });
  }
});

// 添加组员
app.post('/api/group_members', async (req, res) => {
  const { teacherId, studentId } = req.body;
  const query = 'INSERT INTO group_members (TeacherID, StudentID) VALUES (?, ?)';
  try {
    await pool.execute(query, [teacherId, studentId]);
    res.json({ success: true, message: 'Student added to group' });
  } catch (err) {
    console.error('Failed to add student to group:', err.stack);
    res.status(500).json({ error: 'Failed to add student to group' });
  }
});

// 创建分组接口
app.post('/api/groups', authMiddleware, async (req, res) => {
  const { group_name, student_ids } = req.body;
  const teacherId = req.teacherId;

  if (!group_name || !teacherId) {
    return res.status(400).json({ error: 'Group name or teacher ID is missing' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const [groupResult] = await connection.execute(
      'INSERT INTO groups (group_name, teacher_id) VALUES (?, ?)',
      [group_name, teacherId]
    );
    
    if (student_ids && student_ids.length > 0) {
      const memberValues = student_ids.map(id => [groupResult.insertId, id]);
      await connection.query(
        'INSERT INTO group_members (group_id, student_id) VALUES ?',
        [memberValues]
      );
    }
    
    await connection.commit();
    res.json({ 
      group_id: groupResult.insertId,
      group_name: group_name,
      teacher_id: teacherId,
      create_time: new Date()
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error('Error creating group:', err);
    res.status(500).send(err.message);
  } finally {
    if (connection) connection.release();
  }
});

// 获取教师所属分组
app.get('/api/groups', authMiddleware, async (req, res) => {
  const teacherId = req.user.UserID;
  if (!teacherId) {
    return res.status(400).send('Teacher ID is undefined');
  }
  try {
    console.log('Teacher ID:', teacherId);
    const [groups] = await pool.execute(`
      SELECT g.*, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'StudentID', s.StudentID,
            'Name', s.Name
          )
        ) AS members
      FROM groups g
      LEFT JOIN group_members gm ON g.group_id = gm.group_id
      LEFT JOIN students s ON gm.student_id = s.StudentID
      WHERE g.teacher_id = ?
      GROUP BY g.group_id
    `, [teacherId]);
    
    res.json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).send(err.message);
  }
});

// 创建任务接口
app.post('/api/tasks', authMiddleware, async (req, res) => {
  const { taskName, taskContent, groupId, publishTime, deadline } = req.body;
  const teacherId = req.user.UserID;

  try {
    const [group] = await pool.execute(
      'SELECT group_id FROM groups WHERE group_id = ? AND teacher_id = ?',
      [groupId, teacherId]
    );
    
    if (!group.length) {
      return res.status(403).json({ message: '无权操作该分组' });
    }

    const [result] = await pool.execute(
      `INSERT INTO tasks 
       (task_name, task_content, group_id, teacher_id, publish_time, deadline)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [taskName, taskContent, groupId, teacherId, publishTime, deadline]
    );

    res.json({
      task_id: result.insertId,
      task_name: taskName,
      group_id: groupId,
      publish_time: publishTime,
      deadline: deadline,
      create_time: new Date()
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).send(err.message);
  }
});

// 查看学生作答情况
app.get('/api/task/:id/answers', authMiddleware, async (req, res) => {
  const taskId = req.params.id;
  const teacherId = req.user.UserID;

  try {
    const [answers] = await pool.execute(
      `SELECT sa.*, s.Name AS student_name
       FROM student_answers sa
       JOIN students s ON sa.student_id = s.StudentID
       WHERE sa.task_id = ? AND sa.teacher_id = ?`,
      [taskId, teacherId]
    );

    res.json(answers);
  } catch (err) {
    console.error('Error fetching student answers:', err);
    res.status(500).send(err.message);
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('数据库连接失败:', err.stack);
    return;
  }
  console.log('成功连接到数据库');
  connection.release();
});
