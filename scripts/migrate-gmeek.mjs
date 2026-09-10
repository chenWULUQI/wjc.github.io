import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const posts = [
  { source: 'AI 面试常见问题总结.md', slug: 'ai-interview-questions', title: 'AI 面试常见问题总结', description: 'Python、机器学习与深度学习相关的面试知识梳理。', publishDate: '2025-09-22', category: 'notes', tags: ['AI', '面试', '学习笔记'] },
  { source: 'SQLBot智能问数系统部署.md', slug: 'sqlbot-deployment', title: 'SQLBot 智能问数系统部署', description: 'SQLBot 智能问数系统的部署过程与实践记录。', publishDate: '2025-09-29', category: 'tech', tags: ['SQLBot', '部署', 'RAG'] },
  { source: 'AI 面试常见问题总结2.md', slug: 'ai-interview-questions-2', title: 'AI 面试常见问题总结（二）', description: 'Linux、工程实践与 AI 基础知识的补充整理。', publishDate: '2025-09-29', category: 'notes', tags: ['AI', '面试', 'Linux'] },
  { source: 'FUNasr语音识别工具包部署.md', slug: 'funasr-deployment', title: 'FunASR 语音识别工具包部署', description: 'FunASR 语音识别工具包的环境配置与部署记录。', publishDate: '2025-10-09', category: 'tech', tags: ['FunASR', '语音识别', '部署'] },
  { source: '羽山数智融合技术介绍.md', slug: 'digital-intelligence-integration', title: '羽山数智融合技术介绍', description: '数智融合业务的技术背景、能力与实践介绍。', publishDate: '2025-10-10', category: 'tech', tags: ['数智融合', '技术实践'] },
  { source: '羽山数据 × SQLBot：让每一个业务人员都能“开口问数”.md', slug: 'sqlbot-data-dialogue', title: '羽山数据 × SQLBot：让每一个业务人员都能“开口问数”', description: '面向业务人员的自然语言问数方案与落地思考。', publishDate: '2025-10-15', category: 'tech', tags: ['SQLBot', '自然语言', '数据分析'] },
  { source: 'Docker核心概念与实战指南.md', slug: 'docker-core-guide', title: 'Docker 核心概念与实战指南', description: '从镜像、容器到网络与编排的 Docker 系统笔记。', publishDate: '2025-10-20', category: 'tech', tags: ['Docker', '容器', '工程实践'], featured: true },
  { source: '常用命令及网址备忘.md', slug: 'command-reference', title: '常用命令及网址备忘', description: '开发环境中常用命令、镜像源与资料入口的备忘。', publishDate: '2025-10-21', category: 'notes', tags: ['命令行', '工具', '备忘'] },
  { source: 'Transformer架构学习总结.md', slug: 'transformer-notes', title: 'Transformer 架构学习总结', description: '从注意力机制到 Transformer 各模块的系统学习记录。', publishDate: '2025-10-28', category: 'tech', tags: ['Transformer', '深度学习', '注意力机制'], featured: true },
  { source: '深度学习概念总结.md', slug: 'deep-learning-concepts', title: '深度学习概念总结', description: '机器学习与深度学习核心概念的持续整理。', publishDate: '2025-11-03', category: 'notes', tags: ['深度学习', '机器学习', '学习笔记'] },
  { source: '错题集.md', slug: 'mistake-notebook', title: '错题集', description: '图像分类、机器学习与工程知识的错题整理。', publishDate: '2025-11-04', category: 'notes', tags: ['错题', '机器学习', '复习'] },
  { source: '模型量化与加速.md', slug: 'model-quantization-acceleration', title: '模型量化与加速', description: '模型量化、推理优化与加速方法的学习笔记。', publishDate: '2025-11-11', category: 'tech', tags: ['模型量化', '推理优化', 'AI'], featured: true },
  { source: '项目实战.md', slug: 'bert-sentiment-project', title: '项目实战：基于 BERT 的中文情感分析', description: '基于 BERT 的中文情感分析项目实践与资料整理。', publishDate: '2025-11-18', category: 'tech', tags: ['BERT', 'NLP', '项目实践'] },
];

const sourceDir = new URL('../backup/', import.meta.url);
const outputDir = new URL('../src/content/posts/', import.meta.url);
await mkdir(outputDir, { recursive: true });

for (const post of posts) {
  const source = await readFile(new URL(post.source, sourceDir), 'utf8');
  const frontmatter = {
    title: post.title,
    description: post.description,
    publishDate: post.publishDate,
    updatedDate: post.publishDate,
    category: post.category,
    tags: post.tags,
    draft: false,
    featured: post.featured ?? false,
  };
  const yaml = Object.entries(frontmatter)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  await writeFile(
    join(fileURLToPath(outputDir), `${post.slug}.md`),
    `---\n${yaml}\n---\n\n${source.replace(/^\uFEFF/, '')}`,
    'utf8',
  );
}

console.log(`Migrated ${posts.length} Gmeek backup posts.`);
