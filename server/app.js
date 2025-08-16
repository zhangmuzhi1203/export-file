const express = require("express");
const mysql = require("mysql2/promise");
const XLSX = require("xlsx");
const cors = require("cors");

const app = express();
app.use(cors());

// MySQL 连接配置
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "testdb",
});

// 导出 Excel 接口（只处理 id 和 name 字段）
app.get("/export", async (req, res) => {
  try {
    // 1. 获取前端传递的字段，默认只取 id 和 name
    const { fields = "id,name" } = req.query;
    const fieldList = fields.split(",").filter(Boolean);

    // 2. 限制只能导出数据库中存在的字段（id、name、age）
    const validFields = ["id", "name", "age"]; // 数据库实际字段
    const safeFields = fieldList.filter((field) => validFields.includes(field));

    // 3. 如果前端传了无效字段，强制使用 id 和 name
    if (safeFields.length === 0) {
      safeFields.push("id", "name");
    }

    // 4. 只查询筛选后的字段（此处会得到 id 和 name）
    const [rows] = await db.query(`SELECT ${safeFields.join(", ")} FROM users`);

    // 5. 生成只包含这两个字段的 Excel
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // 6. 返回文件（文件名明确标注只含 id 和 name）
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="users_id_name.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("导出失败");
  }
});

app.get("/test", (req, res) => {
  res.send("服务器启动成功");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
