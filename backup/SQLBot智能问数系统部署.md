# SQLBot 基于大模型和 RAG 的智能问数系统部署
## 一.SQLBot介绍
### SQLBot 是一款基于大模型和 RAG 的智能问数系统。优势包括：
1.开箱即用: 只需配置大模型和数据源即可开启问数之旅，通过大模型和 RAG 的结合来实现高质量的 text2sql；
2.易于集成: 支持快速嵌入到第三方业务系统，也支持被 n8n、MaxKB、Dify、Coze 等 AI 应用开发平台集成调用，让各类应用快速拥有智能问数能力；
3.安全可控: 提供基于工作空间的资源隔离机制，能够实现细粒度的数据权限控制。
### 主要功能：
1.提问分析：用户聊天对话方式提问，大模型解析问题意图，结合所选数据源生成图表与分析。
2.深度探索：在获得基础图表结果后，进一步进行分析、解释、验证和预测，支持更强的业务决策支持。
3.数据管理：支持用户配置、管理多种类型的数据源和数据表，支持按需配置和管理。
4.看板搭建：将多个问数对话生成的图表统一布局，构建成适用于汇报、监控或展示的仪表板。
### 相关GitHub链接：https://github.com/dataease/SQLBot/
## 二.在服务器上部署
### 1.GitHub上克隆仓库到服务器上（可直接git clone，如果服务器上无法连接外网，也可先在本机上去外网下载后上传到服务器）
```
cd ~                           
mkdir SQLBot
cd SQLBot
git clone https://github.com/dataease/SQLBot/
```
### 2.下载docker
```
sudo mv /etc/yum.repos.d/docker-ce.repo /etc/yum.repos.d/docker-ce.repo.bak
sudo yum clean all
sudo yum makecache
sudo yum install -y docker-ce docker-ce-cli containerd.io
```
成功安装：
<img width="672" height="71" alt="Image" src="https://github.com/user-attachments/assets/9bb193ee-5226-4370-b2ae-ff2a05a06121" />

启动docker
```
sudo systemctl start docker
sudo systemctl enable docker
```
### 3.从阿里云拉取sqlbot镜像并打开该docker
```
docker run -d   --name sqlbot   --restart unless-stopped   -p 18000:8000   -p 18001:8001  
 -v ./data/sqlbot/excel:/opt/sqlbot/data/excel   
 -v ./data/sqlbot/file:/opt/sqlbot/data/file  
 -v ./data/sqlbot/images:/opt/sqlbot/images  
 -v ./data/sqlbot/logs:/opt/sqlbot/app/logs  
 -v ./data/postgresql:/var/lib/postgresql/data 
  --privileged=true   registry.cn-qingdao.aliyuncs.com/dataease/sqlbot
```
(这里将服务器的18000和18001端口映射到容器的8000和8001上，我们可以通过服务器上的18000及18001端口访问该容器内运行的服务)

查看当前运行的容器
`docker ps -a`
``
<img width="1724" height="35" alt="Image" src="https://github.com/user-attachments/assets/6b6092d9-5223-42a4-91cb-e5c84f3bb23d" />

查看容器运行日志
`docker logs sqlbot `

### 4.从浏览器上访问SQLBot
在浏览器中打开:http://129.211.171.127:18000/
（格式为http://<你的服务器IP>:端口号/）
用户名: admin
密码: SQLBot@123456
再配置好数据库和模型即可使用

<img width="1672" height="911" alt="Image" src="https://github.com/user-attachments/assets/7d20510d-8481-407d-b0d0-4c4796363009" />
