import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 设置与 CSS 相关的内容
  css: {
    // CSS 预处理器的配置入口
    preprocessorOptions: {
      // 表示对 SCSS（Sass 的语法之一）进行配置
      scss: {
        // 这是核心部分。作用是：在每个 SCSS 文件开头自动加上一段代码，等同于你手动在每个 .scss 文件最顶部写：
        // 写这串代码 @import "@/styles/variables.scss";
        // 这样可以全局使用这个文件中的变量（如颜色、字体大小等），不用每个文件重复导入
        // as *	不使用命名空间，直接把里面的变量公开到当前作用域
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
  },
});
