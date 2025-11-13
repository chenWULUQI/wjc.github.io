Transformer到vision Transformer到Swin Transformer到clip到bert到gpt3
https://zhuanlan.zhihu.com/p/448852278
https://zhuanlan.zhihu.com/p/1970541158544441590

一、前馈层FFN
代码实现：
```
import torch
import torch.nn as nn
class FeedForward (nn.modules):
    def __init__(self,input_dim,output_dim):
        super(FeedForward,self).__init__()
        self.linear1=nn.Linear(input_dim,output_dim);
        self.relu=nn.ReLU();
        self.linear2=nn.Linear(output_dim,input_dim);
    
    def forward (self,x):
        x=self.linear1(x);
        x=self.relu(x);
        x=self.linear2(x);
        return x
```
常问问题：
1. Transformer模型中前馈层的作用是什么？
解答： 前馈层（FFN）在Transformer模型中的作用是对每个位置的词向量进行独立的非线性变换。尽管注意力机制能够捕捉序列中的全局依赖，但前馈层通过增加模型的深度和复杂度，为模型引入必要的非线性，从而增强模型的表达能力。每个编码器和解码器层都包含一个FFN，它对所有位置的表示进行相同的操作，但并不共享参数。
2. Transformer的前馈层通常包含哪些组件？
解答： Transformer的前馈层通常由两个线性变换组成，它们之间插入一个非线性激活函数，通常是ReLU（Rectified Linear Unit）。此外，前馈层后通常会跟一个Dropout层以减少过拟合，以及Layer Normalization层以稳定训练过程。
3. 为什么Transformer模型中的前馈层使用了ReLU作为激活函数？
解答： ReLU（Rectified Linear Unit）被用作激活函数，因为它能够引入非线性，同时保持计算的简单性和效率。ReLU能够解决梯度消失问题（对于正输入，其导数为1），加快训练速度，并有助于稀疏激活，这些都是提升模型性能的重要因素。

二、多头自注意力机制
代码实现：
```
class SimpleMultiHeadAttention(nn.Module):
    def __init__(self, embed_dim, num_heads):
        super(SimpleMultiHeadAttention, self).__init__()
        assert embed_dim % num_heads == 0, "embed_dim 必须能被 num_heads 整除"
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads

        # 用线性层映射 Q, K, V
        self.q_proj = nn.Linear(embed_dim, embed_dim)
        self.k_proj = nn.Linear(embed_dim, embed_dim)
        self.v_proj = nn.Linear(embed_dim, embed_dim)

        # 输出线性层
        self.out_proj = nn.Linear(embed_dim, embed_dim)

    def forward(self, x):
        """
        x: [batch_size, seq_len, embed_dim]
        """
        batch_size, seq_len, embed_dim = x.size()

        # 生成 Q, K, V
        Q = self.q_proj(x)  # [batch, seq_len, embed_dim]
        K = self.k_proj(x)
        V = self.v_proj(x)

        # 拆分成多头
        Q = Q.view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)  # [batch, heads, seq_len, head_dim]
        K = K.view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        V = V.view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)

        # 计算注意力分数
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.head_dim ** 0.5)  # [batch, heads, seq_len, seq_len]
        attn = torch.softmax(scores, dim=-1)

        # 加权求和
        out = torch.matmul(attn, V)  # [batch, heads, seq_len, head_dim]

        # 拼接多头结果
        out = out.transpose(1, 2).contiguous().view(batch_size, seq_len, embed_dim)

        # 输出线性层
        out = self.out_proj(out)

        return out

```