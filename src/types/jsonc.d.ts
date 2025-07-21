// 声明JSONC文件的模块类型
declare module "*.jsonc" {
  const value: Record<string, string | Record<string, string>>;
  export default value;
}
