---
title: "Attention 与 KV Cache：一个简单的理解"
description: "从注意力公式出发，理解 KV Cache 为什么能减少大模型自回归生成时的重复计算。"
publishDate: "2025-11-19"
updatedDate: "2025-11-19"
category: "tech"
tags: ["Transformer", "KV Cache", "推理优化"]
draft: false
featured: true
---

大语言模型一次只生成一个新 token。看起来每一步都很小，但如果把已经生成的全部内容重新计算一遍，历史会被反复处理。KV Cache 的作用，就是保存其中可以复用的部分。

## 从注意力公式开始

缩放点积注意力写作：

$$
\operatorname{Attention}(Q,K,V)
=
\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

这里的 $Q$、$K$、$V$ 都由隐藏状态经过线性变换得到。生成第 $t$ 个 token 时，新 token 需要查询此前所有 token；但此前 token 对应的 Key 和 Value 并没有发生变化。

## 重复计算在哪里

假设当前上下文已经有四个 token。生成第五个 token 时，我们只需要为新位置计算一组 Query、Key 和 Value。历史位置的 Key、Value 可以直接读取：

| 内容 | 是否需要重新计算 |
| --- | --- |
| 新 token 的 Q / K / V | 是 |
| 历史 token 的 K / V | 否 |
| 新 Query 与全部 Key 的注意力 | 是 |

这就是缓存的基本边界。它没有跳过注意力计算，而是省去了历史 K、V 的重复投影。

## 一个极简伪代码

```python
def decode_step(hidden, key_cache, value_cache):
    query = q_proj(hidden)
    new_key = k_proj(hidden)
    new_value = v_proj(hidden)

    keys = concat(key_cache, new_key)
    values = concat(value_cache, new_value)
    output = attention(query, keys, values)

    return output, keys, values
```

缓存以空间换时间。上下文越长、层数越多，节省的计算越明显，同时显存占用也会持续增长。实际系统还会使用分页、量化或滑动窗口等办法控制这部分成本[^paging]。

## 应该记住什么

KV Cache 优化的是**自回归解码阶段的重复计算**。它不改变模型参数，也不改变注意力的基本语义。理解这一点，比记住某个框架的接口更重要。

[^paging]: Paged Attention 一类方法会以更灵活的方式管理缓存块，减少显存碎片并提高批处理效率。
