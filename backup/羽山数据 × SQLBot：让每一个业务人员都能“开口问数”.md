# 羽山数据 × SQLBot：让每一个业务人员都能“开口问数”
## 引言
在现代数据驱动的企业中，数据已成为业务决策与技术运营的核心。但面对多源异构数据、复杂表结构和繁琐的 SQL 查询，技术团队常遇到以下难题：查询门槛高，编写复杂 SQL 耗时；报表响应慢，业务需求频繁变更；重复劳动多，缺乏智能化查询支持。为此，羽山数据在内部数据产品开发中引入了SQLBot智能问数产品。本文将从产品介绍、落地方案与实践效果三方面，分享我们在数据智能化建设中的经验与收获。

## 一、SQLBot 智能问数产品概览
​SQLBot是一个基于大语言模型（LLM）和检索增强生成（RAG）技术的智能问数系统，专门用于将自然语言转换为SQL查询。它提供了一个完整的解决方案，让用户能够通过简单的自然语言问题来查询和分析数据，无需编写复杂的SQL语句。
### 1.核心功能：
自然语言转 SQL：业务或技术人员可以直接输入“我的客户表中一共有多少个账户”这样的自然语言问题，SQLBot 会自动生成可执行SQL语句。
多数据源支持：SQLBot 可以同时连接MySQL、PostgreSQL、Oracle等多种数据库，统一查询接口。
权限与安全控制：支持多租户权限管理和SQL执行审计，保障企业数据安全。
可扩展与集成：SQLBot可通过API或SDK嵌入到不同的业务场景中。同时，它还能与n8n、MaxKB、Dify、Coze等AI应用开发平台无缝对接，使得企业能够快速拥有问数能力。
### 2.工作原理

<img width="461" height="241" alt="Image" src="https://github.com/user-attachments/assets/a6b5ad7e-cbe0-4b4c-b2a9-ed7609fbd635" />                             

用户首先以自然语言的方式输入问题，SQLBot接收这个问题后，进入语义理解与上下文构建阶段。SQLBot会综合利用Terms（术语库），SQL SampleLib（示例 SQL 库）和Prompt Settings（提示词配置）共同形成 Prompt（提示上下文）来作为 AI 模型理解用户问题的基础输入。与此同时，SQLBot 会自动读取数据库元信息（Schemas），包括表名、字段名、数据类型及外键关系，并生成Prompt作为辅助输入。然后AI模型接收构建好的Prompt（含问题、Schema、样例、术语映射等），生成一条符合语义的SQL查询语句。生成的SQL会发送至数据库（DataBases）执行，查询真实数据（Data）。SQLBot 会校验结果结构（列名、数据类型），并将结果封装为可用的数据对象。


## 二、技术落地方案
### 1.环境要求
       
<img width="436" height="107" alt="Image" src="https://github.com/user-attachments/assets/9458250c-901a-48ae-bee6-25929fd96e80" />


### 2.快速部署
（1）docker内安装
准备一台Linux服务器，安装好 Docker，执行以下一键安装脚本：

<img width="466" height="236" alt="Image" src="https://github.com/user-attachments/assets/4791e602-b58d-4bfa-9e09-3a1a1da93f7c" />

（2）访问方式
在浏览器中打开: http://<你的服务器IP>:8000/
用户名: admin
密码: SQLBot@123456

## 三、实践效果
羽山数据在本地部署的 SQLBot 平台中，集成并扩展了 DIFY 平台下的 10 张核心业务数据表，涵盖账户、租户、应用、工作区等模块。团队通过自然语言问数的方式，对单表查询、多表关联、数据绘图及数据格式规范核心功能进行了系统性测试与性能验证。在测试基础上，羽山数据进一步将SQLBot的智能问数能力应用到人力资源数据治理场景中。通过对员工账户、部门及项目信息的多表联合查询，技术团队实现了对人事数据的自动化审计与一致性检测。
       
<img width="465" height="306" alt="Image" src="https://github.com/user-attachments/assets/e89a17bf-5412-47ca-a085-994812ec9cbf" />

### 1.单表查询性能测试
功能说明：查询accounts表中id的数量及accounts表中不同用户的创建时间并排序。
业务场景应用：在羽山数据的人力资源客户数据治理项目中，SQLBot的查询功能发挥了显著作用。HR团队利用SQLBot快速审计员工账户数据，核查员工ID的总量与唯一性，识别重复、缺失及格式异常记录，确保基础人事数据的完整性与规范性。
测试结果：

<img width="554" height="159" alt="Image" src="https://github.com/user-attachments/assets/619a6e43-6eac-4497-8485-9c6b483596b3" />

<img width="554" height="380" alt="Image" src="https://github.com/user-attachments/assets/73234114-2dc8-43bd-addd-307b5efcf412" />


## 2.多表关联查询性能测试
功能说明：查询租户账号关联表（tenant_account_joins）中所有与账户（accounts）相关联的租户（tenants），并按租户创建时间升序排列。
业务场景应用：羽山数据整合HR系统多源数据，通过联合查询分析员工账户与部门（或项目）关联，识别跨系统数据不一致。按入职时间排序，监控员工增长趋势，确保数据隔离合规，优化人力资源分配与治理效率。
测试结果：

<img width="450" height="298" alt="Image" src="https://github.com/user-attachments/assets/2751b8e6-9b82-4716-a7d7-71f670b9bf63" />

## 3.绘图功能测试
功能说明：SQLBot 支持在执行SQL语句查询后，将结果数据以折线图、柱状图、条形图等形式进行可视化展示并将绘制结果保存为图片以及能将元数据导出为Excel表格保存。用户可以通过自然语言描述（如“帮我画出过去六个月各租户的数据增长趋势”），由系统自动识别数值字段与时间字段，生成对应图表。
业务场景应用：羽山数据通过可视化监控HR数据质量，绘制部门员工增长趋势图，识别异常波动，检测数据录入错误。柱状图展示各地区员工数量变化，评估数据标准化效果，导出Excel并集成仪表板，优化HR审计与合规审查，提升治理透明度。
测试结果：
可将结果数据按要求绘制成图表并选择使用不同图表类型进行展示：

<img width="489" height="308" alt="Image" src="https://github.com/user-attachments/assets/e50c8229-3f9f-497f-9c07-4589883c7b86" />

支持将绘制结果保存为图片及将元数据导出为Excel表格保存：

<img width="488" height="341" alt="Image" src="https://github.com/user-attachments/assets/73e21ed3-a37e-4237-932c-a9e70d3f854c" />

支持将结果添加到仪表板中方便展示：
  

<img width="463" height="435" alt="Image" src="https://github.com/user-attachments/assets/869073aa-49d9-41c2-aece-be37c4eec982" />

## 4.数据格式规范
功能说明：SQLBot 内置数据格式规范模块，支持对查询表结构与字段内容进行自动检测与格式校正。系统可根据企业内部数据标准或外服数据治理规范，对数据格式执行以下功能：
字段类型识别：自动识别文本、数值、日期、布尔等字段类型，并检测类型异常（如字符串型日期、数值型ID混乱等）；
格式校验：针对关键字段（如手机号、邮箱、时间戳、身份证号）进行格式合规性检测；
数据标准化：支持将日期格式、大小写、编码规范（UTF-8 / GBK 等）统一；
业务场景应用：羽山数据统一HR数据日期格式（如入职日期），确保跨系统兼容。校验员工ID或邮箱字段的非法字符与类型异常，修复数值存储问题，支持HR系统接口匹配，提升查询性能，减少格式不一致导致的错误，提高治理自动化水平。
测试结果：
             

<img width="344" height="356" alt="Image" src="https://github.com/user-attachments/assets/c9542c56-2576-4445-b101-9bc94a58d5cc" />

## 四、总结
通过对SQLBot在基础查询、多表联合查询、绘图展示及数据格式规范等功能模块的系统测试，羽山数据技术团队全面验证了该智能问数工具在数据治理、业务分析与智能决策支持方面的可行性与高效性。SQLBot的引入，不仅显著提升了团队在数据查询与接口开发环节的工作效率，也强化了数据标准化与可视化分析的能力，为脏数据清洗、字段格式规范及数据资产管理提供了坚实支撑。