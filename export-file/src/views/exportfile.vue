<template>
  <el-button type="primary" @click="exportExcel"
    >导出 Excel（只含ID和姓名）</el-button
  >
</template>

<script setup>
import axios from "axios";
// 只导入基础的 ElMessage（无需 loading 方法）
import { ElMessage } from "element-plus";

const exportFields = ["id", "name"]; // 固定导出字段

const exportExcel = async () => {
  try {
    // 1. 直接发送请求（删除 loading 相关代码）
    const response = await axios.get("http://localhost:3000/export", {
      params: { fields: exportFields.join(",") },
      responseType: "blob",
    });

    // 2. 处理下载逻辑
    const fileName = response.headers["content-disposition"]
      ? decodeURIComponent(
          response.headers["content-disposition"]
            .split("filename=")[1]
            .replace(/"/g, "")
        )
      : "users_id_name.xlsx";

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    // 3. 导出成功提示
    ElMessage.success("导出成功");
  } catch (err) {
    console.error("导出失败", err);
    ElMessage.error("导出失败");
  }
};
</script>
