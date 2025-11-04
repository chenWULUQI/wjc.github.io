Transformer到vision Transformer到Swin Transformer到clip到bert到gpt3
一、前馈层FFN
代码实现：
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
常问问题：
1. Transformer模型中前馈层的作用是什么？
解答： 前馈层（FFN）在Transformer模型中的作用是对每个位置的词向量进行独立的非线性变换。尽管注意力机制能够捕捉序列中的全局依赖，但前馈层通过增加模型的深度和复杂度，为模型引入必要的非线性，从而增强模型的表达能力。每个编码器和解码器层都包含一个FFN，它对所有位置的表示进行相同的操作，但并不共享参数。
2. Transformer的前馈层通常包含哪些组件？
解答： Transformer的前馈层通常由两个线性变换组成，它们之间插入一个非线性激活函数，通常是ReLU（Rectified Linear Unit）。此外，前馈层后通常会跟一个Dropout层以减少过拟合，以及Layer Normalization层以稳定训练过程。
3. 为什么Transformer模型中的前馈层使用了ReLU作为激活函数？
解答： ReLU（Rectified Linear Unit）被用作激活函数，因为它能够引入非线性，同时保持计算的简单性和效率。ReLU能够解决梯度消失问题（对于正输入，其导数为1），加快训练速度，并有助于稀疏激活，这些都是提升模型性能的重要因素。
