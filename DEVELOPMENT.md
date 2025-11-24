# 开发指南

## 项目设置

### 前置条件
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MySQL/TiDB 数据库

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/3397023886/-
cd emotion-music-generator
```

2. **安装依赖**
```bash
pnpm install
```

3. **配置环境变量**
创建 `.env.local` 文件：
```
DATABASE_URL=mysql://user:password@localhost:3306/emotion_music_db
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
```

4. **初始化数据库**
```bash
pnpm db:push
```

5. **启动开发服务器**
```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动

## 项目结构

```
emotion_music_generator/
├── client/                    # 前端应用 (React + Vite)
│   ├── src/
│   │   ├── components/       # React组件
│   │   │   ├── EmotionSelector.tsx    # 情绪选择器
│   │   │   ├── ColorCanvas.tsx        # 颜色绘制画布
│   │   │   ├── MusicPlayer.tsx        # 音乐播放器
│   │   │   └── EmotionHistory.tsx     # 情绪日记列表
│   │   ├── pages/            # 页面组件
│   │   │   └── Home.tsx      # 主页面
│   │   ├── lib/
│   │   │   └── trpc.ts       # tRPC客户端配置
│   │   ├── App.tsx           # 应用主组件
│   │   ├── main.tsx          # 入口文件
│   │   └── index.css         # 全局样式
│   ├── index.html            # HTML模板
│   └── vite.config.ts        # Vite配置
├── server/                    # 后端应用 (Express + tRPC)
│   ├── routers.ts            # tRPC路由定义
│   ├── db.ts                 # 数据库操作函数
│   ├── emotion.generate.test.ts   # 生成API测试
│   ├── emotion.history.test.ts    # 历史API测试
│   ├── integration.test.ts        # 集成测试
│   ├── auth.logout.test.ts        # 认证测试
│   └── _core/                # 核心基础设施
│       ├── index.ts          # 服务器入口
│       ├── context.ts        # tRPC上下文
│       ├── trpc.ts           # tRPC配置
│       ├── cookies.ts        # Cookie处理
│       ├── env.ts            # 环境变量
│       └── ...
├── drizzle/                   # 数据库
│   ├── schema.ts             # 数据库schema定义
│   └── migrations/           # 数据库迁移文件
├── shared/                    # 共享代码
│   └── const.ts              # 常量定义
├── public/                    # 静态资源
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript配置
├── vite.config.ts            # Vite配置
└── README.md                 # 项目说明
```

## 开发工作流

### 1. 添加新功能

**步骤：**
1. 在 `drizzle/schema.ts` 中定义数据库schema
2. 运行 `pnpm db:push` 生成迁移
3. 在 `server/db.ts` 中添加数据库操作函数
4. 在 `server/routers.ts` 中定义tRPC procedure
5. 在 `client/src/components/` 中创建UI组件
6. 在 `client/src/pages/Home.tsx` 中集成组件
7. 编写测试文件 `server/feature.test.ts`
8. 运行 `pnpm test` 验证

### 2. 数据库迁移

```bash
# 修改 schema.ts 后
pnpm db:push

# 查看数据库
pnpm db:studio
```

### 3. 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test emotion.generate.test.ts

# 监视模式
pnpm test:watch

# 生成覆盖率报告
pnpm test -- --coverage
```

### 4. 类型检查

```bash
pnpm type-check
```

### 5. 构建生产版本

```bash
pnpm build
```

## 代码风格

### TypeScript
- 使用严格模式 (`strict: true`)
- 为所有函数参数和返回值添加类型注解
- 避免使用 `any` 类型

### React
- 使用函数组件和Hooks
- 使用 `const` 声明组件
- 使用描述性的组件名称

### 命名规范
- 组件文件：PascalCase (e.g., `EmotionSelector.tsx`)
- 工具函数：camelCase (e.g., `generateMusicParams`)
- 常量：UPPER_SNAKE_CASE (e.g., `COOKIE_NAME`)
- 数据库表：camelCase (e.g., `emotionRecords`)

## 常见任务

### 添加新的情绪类型

1. 在 `generateMusicParams` 函数中添加情绪到音阶的映射
2. 在 `EmotionSelector` 组件中添加新按钮
3. 更新相关测试

### 修改音乐生成算法

编辑 `server/routers.ts` 中的 `generateMusicParams` 函数

### 添加新的API端点

1. 在 `server/routers.ts` 中定义新的procedure
2. 在 `server/db.ts` 中添加数据库操作（如需）
3. 在 `client/src/pages/Home.tsx` 中使用 `trpc` 调用
4. 编写测试验证

## 调试

### 浏览器调试
1. 打开浏览器开发者工具 (F12)
2. 在 Console 标签查看日志
3. 在 Network 标签查看API请求

### 服务器调试
```bash
# 使用 tsx 的调试模式
node --inspect-brk ./node_modules/.bin/tsx server/_core/index.ts
```

### 数据库调试
```bash
pnpm db:studio
```

## 性能优化

### 前端
- 使用React DevTools Profiler分析组件性能
- 避免不必要的重新渲染
- 使用 `useMemo` 和 `useCallback` 优化

### 后端
- 使用数据库查询优化
- 实现缓存策略
- 监控API响应时间

### 数据库
- 添加适当的索引
- 优化查询语句
- 使用连接池

## 部署

### 开发环境
```bash
pnpm dev
```

### 生产构建
```bash
pnpm build
```

### 部署到Manus平台
1. 创建检查点
2. 点击Management UI中的"Publish"按钮

## 故障排除

### 数据库连接错误
- 检查 `DATABASE_URL` 环境变量
- 确保数据库服务运行
- 验证数据库凭证

### 构建失败
- 清除 `node_modules` 和 `dist`
- 运行 `pnpm install`
- 检查TypeScript错误：`pnpm type-check`

### 测试失败
- 检查数据库连接
- 查看测试输出中的错误信息
- 运行单个测试调试：`pnpm test emotion.generate.test.ts`

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT

## 联系方式

- 项目主页: [GitHub](https://github.com/3397023886/-)
- 问题反馈: [Issues](https://github.com/3397023886/-/issues)
