# Docker核心概念与实战指南
## 1. Docker基础概念
### Docker概述: 
Docker是一种成熟高效的软件部署技术，利用容器化技术为应用程序封装独立的运行环境。每个运行环境即为一个容器，承载容器运行的计算机称为宿主机。与虚拟机最大的区别是：Docker 容器共享同一个系统内核，而每个虚拟机都包含一个完整的系统内核。所以 Docker 容器比虚拟机更轻量，启动速度更快。

### 镜像 (Image):
镜像可以理解为是一个特殊的压缩包，容器就像是通过压缩包解压（创建）出来的文件，我们可以使用同一个压缩包，解压出很多份相同的文件，也可以将这个压缩包分享给他人，得到和我们一样的文件。这里所说的 “文件”，就是上面提到的容器。我们也可以通过修改容器，并生成自己特定的 Docker 镜像，并将这些镜像分享给他人，其他人可以通过镜像，创建出和我们一样的容器环境。

### Docker仓库 (Registry):
Docker 仓库就是我们用来存储、分享镜像的地方。所有人都可以把自己的镜像上传到仓库里面，其他人就可以下载镜像并使用。Docker 的官方仓库是 Docker Hub (https://hub.docker.com/)

## 2.Docker核心原理
Docker 利用了 Linux 的两大原生功能Cgroups 和Namespaces 来实现容器化：Cgroups 用来限制和隔离进程的资源使用。可以为每个容器设定 CPU、内存、网络带宽等资源的使用上限，确保容器的内存消耗不会影响到宿主机。Namespaces 用于隔离进程的资源视图，使得容器只能看到自己内部的进程 ID、网络资源、文件目录，看不到宿主机的。容器本质上还是一个特殊的进程，但是当我们进入容器内部时，看起来就像是一个独立的操作系统。

## 3. Docker安装
Docker 是基于 Linux 的容器化技术，Windows 和 Mac 需要虚拟化一个 Linux 的子系统。所以 Docker 最好的使用方式是使用 Linux 系统的宿主机。

### Linux 系统
Linux 系统可以通过包管理器安装 Docker，例如 Redhat 系可以使用 yum install docker 安装。Alpine Linux 可以通过 apk add docker 安装
### Windows 安装
打开 “Windows 功能”, 勾选上 Virtual Machine Paftform（虚拟机平台）、适用于 Linux 的 Windows 子系统，并重启电脑。管理员打开命令提示符，安装 wsl2
```
wsl --set-default-version 2
wsl --update --web-download
```
去 Docker 官网 或者 https://github.com/tech-shrimp/docker_installer/releases 下载符合自己系统的 Docker Desktop 安装包，并进行安装，安装成功后 可以在终端尝试一下：
```
PS C:\Users\Administrator> docker --version
Docker version 28.3.3, build 980b856
```
在使用的过程中 Docker Desktop 需要一直开着，否则执行命令会出现这个报错。
```
PS C:\Users\Administrator> docker ps
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/containers/json": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```
### Mac 安装
直接在 Docker 官网下载安装包 安装就行。

## 4. Docker镜像管理命令
### 下载镜像
docker pull 命令用来从仓库下载镜像。
`docker pull docker.io/library/nginx:latest`
 一个 Docker 镜像下载地址包含 4 部分内容：
1.docker.io: registry：仓库地址 / 注册表，如果是 Docker 官方仓库，则可以省略这个地址。
2.library: 命名空间（镜像作者），为了防止不同用户上传同一个名字的镜像 发生冲突。“library" 是 docker 官方仓库的命名空间，这个空间下的所有镜像都是由 Docker 官方维护。如果是官方的命名空间则可以省略不写。
3.nginx: 镜像名。
4.latest: 标签名、版本号。写 "latest" 或者不写 表示获取最新版本的镜像。
其中镜像库（repository）用来存放一个镜像的不同版本，比如"docker.io/library/nginx" 就是一个镜像库。从 Docker 官方仓库的官方命名空间里面下载最新的 Nginx Docker 镜像的简化命令;
`docker pull nginx`
从 docker.n8n.io 的私有仓库下载 n8nio 上传的 n8n 镜像命令：
`docker pull docker.n8n.io/n8nio/n8n`

### 镜像源配置
在国内的网络环境中，如果执行 docker pull 可能会出现 下载失败的问题，可以参考这篇文档配置镜像站解决：[[docker_installer?tab=readme-ov-file#2-pull 镜像](https://github.com/tech-shrimp/docker_installer?tab=readme-ov-file#2-pull%E9%95%9C%E5%83%8F)](https://github.com/tech-shrimp/docker_installer?tab=readme-ov-file#2-pull%E9%95%9C%E5%83%8F)

### 查看镜像
`docker images`
使用此命令可以查看 所有 Pull 到本地的镜像。

### 删除镜像
`docker rmi [镜像标识]`
使用此命令可以删除 pull 到本地的镜像，镜像标识可以选择镜像的 ID（image id）或者镜像的名称

### 创建并运行容器
`docker run [镜像标识]`
使用 run 命令 可以通过镜像创建一个容器，并启动它。镜像标识可以是镜像ID或者镜像名称。
例如：docker run nginx 就是创建一个 Nginx 容器。docker pull 命令可以省略，直接使用 docker run 运行，如果 docker 发现本地没有这个镜像则会自动拉取。

### 分离模式
默认情况下docker run创建容器后会导致当前终端挂起，不能进行其他操作，可以增加 -d 参数 表示容器在后台运行，不阻塞当前窗口。
`docker run -d nginx`

### 自定义容器名称
`docker run -d -name kz_nginx nginx`
容器的名称和 容器 ID 的效果是等价的，但是名字更方便记忆。

### 端口映射
容器的网络和宿主机的网络是隔离的，例如运行了一个 Nginx 容器，容器内的 Nginx 监听了 80 端口。这时通过宿主机的 80 端口是无法访问到 Nginx 服务的。所以需要 -p {宿主机端口}:{容器端口} 命令进行映射，例如 `-p 8080:80 `标识将 Nginx 容器的 80 端口映射到宿主机的 8080 端口。

### 目录映射（绑定挂载）
与端口映射类似的就是目录映射，将容器外和容器内的目录进行绑定，容器内对文件的修改会影响宿主机的文件夹，宿主机的修改也会影响容器内文件夹。这种目录也被称为挂载卷，他的最大作用是数据的持久化。 当容器删除时，容器内的所有数据都会被删除，但通过挂载卷映射到宿主机的文件夹将得以保留。
`docker run -d -p 8080:80 -v ./:/usr/share/nginx/html nginx`
使用绑定挂载的时候，宿主机的文件会暂时覆盖掉容器内的目录。除了这种用法 还有一种叫 Docker 卷，可以在容器之间共享和重用。

### 环境变量
可以在命令行通过 -e 参数传递环境变量到容器内部，例如创建一个数据库应用，需要在创建容器时，就指定数据库的账户、密码等信息。
```
docker run -d -p 27017:27017 \
-e MONGO_INITDB_ROOT_USERNAME=tech \
-e MONGO_INITDB_ROOT_PASSWORD=dbkuaizi \mongo
```
如果不知道容器的环境变量有哪些，可以在 Docker Hub 上搜索一下，或者去 Github 上看一下 readme 文档，都有详细的描述。

### 进入容器
`docker run -it alpine`
通过 -it 参数可以在创建一共容器时，同时进入容器内部的终端。

### 退出删除
`docker run -it --rm alpine`
--rm 表示当退出容器时，自动删除这个容器。一般和 -it 命令配合使用

### 容器重启策略
`docker run -d --restart always nginx`
--restart 参数用来表示 容器在停止时的重启策略，它有两个选项：always 只要容器停止了，就会立即重启。包含容器因为内部错误崩溃，或者宿主机断电等场景unless-stopped ，与 always 类似，唯一区别是：手动停止的容器不会尝试重启了

### 创建容器
`docker create nginx`
与 run 命令功能类似，区别在于只创建容器，不自动启动。

### 查看容器列表
`docker ps` 
CONTAINER ID   IMAGE     COMMAND                  CREATED              STATUS              PORTS     NAMES
48fe482ecff2   nginx     "/docker-entrypoint.…"   About a minute ago   Up About a minute   80/tcp    cool_hodgkin
ps 是 Process Status (进程状态) 的缩写，也是 Linux 上的一个经典命令，用于查看进程的状态信息。这一命令也被继承到 Docker 里面了
这些列含义如下：
CONTAINER ID 容器 ID，每个容器在创建时会生成一个唯一的 ID
IMAGE 基于那个镜像创建出来的
CREATED 镜像创建时间
STATUS 镜像当前状态
PORTS 镜像使用端口
NAMES 容器的名字，如果创建容器时没有指定名字，系统就会随机分配一个。
增加 -a 参数可以看到所有的容器，包括正在运行的和已经停止的。

### 启停容器
每次使用 docker run 运行都会创建一个新的容器，如果我们需要对同一个容器进行持续的操作，可以通过容器的启停命令来控制。
### 启动容器
`docker start {容器标识}`
### 停止容器
`docker stop {容器标识}`
使用 start 启停容器的时候，不需要再传递创建容器时的 端口映射、挂载卷、环境变量等参数都不需要重新写了，docker 已经自动保存了，重新启动可以按照原因运行。

### 删除容器
`docker rm {容器标识}`
使用 rm 命令可以删除容器，如果要删除运行中的容器 需要加 -f 参数强制删除。

### 进入容器内部
`docker exec -it {容器标识} bash`
使用 exec -it 命令 可以进入容器，在容器内部执行 shell 命令
`docker exec {容器标识} {shell 命令}`
也可以通过这种方式 在容器外部执行容器内部的命令

### 查看容器 alpine 中的进程信息
`docker exec alpine ps -ef`
注意 docker 镜像为了尽可能缩小镜像体积，内部一般是一个极简的操作系统，很多系统工具、基础命令都是缺失的

### 查看创建信息
`docker inspect {容器标识}`
使用这个命令可以看到容器的所有信息，输出的是一个 JSON 格式，可以直接丢给 ai 帮忙解析

### 容器日志
`docker logs {容器标识}`
这个命令可以看容器的日志，加上 -f 命令，可以持续输出，滚动查看。

### Docker 卷
docker volume 命令用于管理 Docker 卷（volume）。卷是用于持久化数据的文件系统，可以将数据和应用程序分离，便于管理，可以在容器之间共享和重用。同时卷可以用于数据的备份和恢复。
### 创建卷
`docker volume create {卷名称}`
### 查看卷信息
`docker volume inspect nginx_html`
```
[
    {
        "CreatedAt": "2025-09-07T14:58:39Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/nginx_html/_data",
        "Name": "nginx_html",
        "Options": null,
        "Scope": "local"
    }
]
```
### 查看所有卷
`docker volume list`

DRIVER    VOLUME NAME
local         nginx_html

### 删除卷
`docker volume rm nginx_html`

### 删除未使用的卷
`docker volume prune`

### Dockerfile
Dockerfile 是一个用来 构建镜像文件的文本文件，Dockerfile 文件内包含了构建镜像所需的各种信息。
在项目目录下创建一个名为 Dockerfile 的文件，并在文件中编写镜像构成的信息。
# 选择一个基础镜像作为运行环境
FROM python:3.13-slim
# 在镜像内切换一个工作目录，后续所有的操作都是基于这个目录来的
WORKDIR /app
# 将项目文件拷贝到镜像的工作目录
# 第一个 “.” 代表当前目录，第二个 “.” 代表镜像的工作目录 
COPY . .

# 安装容器内环境需要的依赖
RUN pip install -r requirements.txt

# 声明对外提供服务的端口是哪个
EXPOSE 8000

# 容器内服务启动命令，每次启动时容器内会自动执行这个命令
CMD ["python3","main.py"]
项目内容
main.py

from fastapi import FastAPI
import uvicorn
app = FastAPI()

@app.get("/")
def read_root():
    return {"hello":"dbkuaizi"}

if __name__ == "__main__":
    uvicorn.run(app,host='0.0.0.0',port=8000)
requirements.txt

fastapi
uvicorn
构建镜像

Dockerfile 文件写好了，可以使用 docker build 构建镜像。

PS E:\docker\demo> docker build -t docker_test .
[+] Building 65.7s (9/9) FINISHED                                                                                                                                                                                                                                  docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                                                                                                                                                                                               0.0s
 => => transferring dockerfile: 616B                                                                                                                                                                                                                                               0.0s
 => [internal] load metadata for docker.io/library/python:3.13-slim                                                                                                                                                                                                                0.0s
 => [internal] load .dockerignore                                                                                                                                                                                                                                                  0.0s
 => => transferring context: 2B                                                                                                                                                                                                                                                    0.0s
 => [1/4] FROM docker.io/library/python:3.13-slim@sha256:1bca0202e953784ac2a1daf36ebbc9cbebed48afcfba12d1225aaab3793eca33                                                                                                                                                          0.0s
 => => resolve docker.io/library/python:3.13-slim@sha256:1bca0202e953784ac2a1daf36ebbc9cbebed48afcfba12d1225aaab3793eca33                                                                                                                                                          0.0s
 => [internal] load build context                                                                                                                                                                                                                                                  0.0s
 => => transferring context: 310B                                                                                                                                                                                                                                                  0.0s
 => CACHED [2/4] WORKDIR /app                                                                                                                                                                                                                                                      0.0s
 => [3/4] COPY . .                                                                                                                                                                                                                                                                 0.1s
 => [4/4] RUN pip install -r requirements.txt                                                                                                                                                                                                                                     63.6s
 => exporting to image                                                                                                                                                                                                                                                             1.6s
 => => exporting layers                                                                                                                                                                                                                                                            0.9s
 => => exporting manifest sha256:fb2f23e7feeb23365ee8cc3cd9a5a8c5d497c73538c16463e23195a6b873d7bf                                                                                                                                                                                  0.0s
 => => exporting config sha256:41ffab42f6b9d9c336023838318f252e00e15a9d5a73cc17a765dae05fdc5435                                                                                                                                                                                    0.0s
 => => exporting attestation manifest sha256:83d850f342fee281553b7b387484f4790d4553015fb12d4cec7ac00462229a25                                                                                                                                                                      0.0s
 => => exporting manifest list sha256:1bfb1d56ae1e7a710f2f6277d9c2a6b2b746e6710a83b1792bea01ef7bbec520                                                                                                                                                                             0.0s
 => => naming to docker.io/library/docker_test:latest                                                                                                                                                                                                                              0.0s
 => => unpacking to docker.io/library/docker_test:latest    
创建容器并运行

PS E:\docker\demo> docker run -d -p 8000:8000 docker_test
22fd617066ad0f95b1a664257f4c00a6dc1b60d9de7c894f8940f24b34859629
PS E:\docker\demo> docker ps -a
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS                     PORTS                                         NAMES
22fd617066ad   docker_test   "python3 main.py"        4 seconds ago   Up 4 seconds               0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp   sharp_banach
PS E:\docker\demo> curl http://127.0.0.1:8000


StatusCode        : 200
StatusDescription : OK
Content           : {"hello":"dbkuaizi"}
RawContent        : HTTP/1.1 200 OK
                    Content-Length: 20
                    Content-Type: application/json
                    Date: Tue, 09 Sep 2025 14:31:30 GMT
                    Server: uvicorn

                    {"hello":"dbkuaizi"}
Forms             : {}
Headers           : {[Content-Length, 20], [Content-Type, application/json], [Date, Tue, 09 Sep 2025 14:31:30 GMT], [Server, uvicorn]}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : System.__ComObject
RawContentLength  : 20
Docker 网络
桥接模式
Docker 网络 默认 Bridge（桥接模式），所有的容器都连接到这个网络中，每一个容器都分配了一个内部的 IP 地址，一般都是 172.17 开头。在这个内部子网里面，容器可以通过内部 IP 地址互相访问。

但容器网络和宿主机的网络是隔离的，可以使用 docker network create 命令创建子网，默认情况下，子网也是桥接模式的一种，然后可以指定容器加入不同的子网，同一个子网内的容器可以互相通信，而跨子网则不可以通信。

使用子网还有一个好处，同一个子网内的容器，可以直接使用容器名称互相访问，而不必使用内部的 IP 地址。

# 创建一个 名叫 network1 的子网
docker network create network1

# 创建一个 nginx 容器 使用 network1 的子网
docker run -d --network network1 nginx
116224390346617.webp

HOST 模式
host 模式下，docker 容器直接共享宿主机的网络，容器直接使用宿主机的 IP 地址，无需 -p 参数进行端口映射，容器内的服务直接运行在宿主机的端口上，通过宿主机的 IP 和端口就能访问到容器中服务。

docker run -d --network host nginx
NONE 模式
这个模式表示不联网

控制命令
创建网络

docker network create network1
查看网络

PS C:\Users\Administrator> docker network list
NETWORK ID     NAME       DRIVER    SCOPE
d30095b3bc13   bridge     bridge    local
24b646446630   host       host      local
a26161c3eff2   network1   bridge    local
7800c9b21eb6   none       null      local
除了我们创建的模式以外，还有 Docker 自带的三种模式，需要注意的是 这三个自带的网络模式是不可删除的

删除网络

docker network rm network1
Docker Compose
有的时候 一个完整的应用可能会是很多部分组成的，例如前端、后端、数据库 以及各种附加的技术栈，这些东西应该如何容器化呢？

我们可以自然的想到，将这些模块都打包在一起，做成一个巨大的容器。但这样做有一个弊端，只要其中一个模块发生故障，例如 服务端内存泄露，可能会导致整个容器都崩溃挂掉。

并且这样做的可伸缩性差，如果想给系统做扩容，只能把整个大容器在复制一份，做不到对某个模块的精确扩容。

多应用的最佳实践，是把每一个模块都打包成一个独立的容器。但这样多容器 增加了很多使用成本，因为想创建多个 容器 就要多次使用 docker run ，还需要配置容器之间的网络环境，尝试管理这些容器时，一个遗漏就会导致很多问题，并且若让其他人部署项目，如果操作者对部署流程不熟悉 也会导致各种问题的发生。

这个时候，容器编排技术就很有用了，也就是 Docker Compose，它使用 yml 文件 管理多个容器，在这个文件中记录了容器之间时如何创建以及如何协同工作的，我们可以简单的把 Docker Compose 文件理解成一个或多个 Docker run 命令，按照特定的格式书写到一个文件中，

Docker Compose 格式如下：

254110120740349.webp

右侧最顶级的就是 Services 元素，每个元素就对应一个 Services
左侧的 --name 在右侧就变成了 services 名
左侧的镜像名，在右侧写在了 image: 属性后面
左侧的 -e 参数，对应右边的 environments
左侧的 -v 对应右侧的 volume 也就是挂载卷。
左侧的 -p 对应右边的 ports
右侧的 depends_on 用来表示启动顺序关系，这里表示 my_mongodb_express 容器，依赖 my_mongodb 。这时 程序会先启动 mongodb 再启动荣亲
左右两边唯一的区别是：左边自定义了一个子网 network1 ，而右边没有。同一个 compose 文件中，定义的所有容器都会自动加入同一个子网，不用我们额外维护。

我们可以借助 AI 来生成 需要的 Compose 文件，而无需手动编写。

使用 Compose

在启动目录下创建 docker-compose.yaml 文件，内容如下：

services:
  my_mongodb:
    image: mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: name
      MONGO_INITDB_ROOT_PASSWORD: pass
    volumes:
      - /my/datadir:/data/db

  my_mongodb_express:
    image: mongo-express
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_SERVER: my_mongodb
      ME_CONFIG_MONGODB_ADMINUSERNAME: name
      ME_CONFIG_MONGODB_ADMINPASSWORD: pass
    depends_on:
      - my_mongodb
创建并运行启动

然后执行 docker compose up -d 运行，如果容器已经在运行了 重复执行这个命令不会有任何效果。

执行该命令时，会检测当前目录下 名为 docker-compose.yaml 或 compose.yaml 文件。可以通过 docker compose -f tesst.yaml up -d 指定 compose 文件。

PS E:\dbkuaizi\mongodb> docker compose up -d
[+] Running 3/3
 ✔ Network mongodb_default                 Created                                                                 0.0s
 ✔ Container mongodb-my_mongodb-1          Started                                                                 0.6s
 ✔ Container mongodb-my_mongodb_express-1  Started                                                                 0.7s
PS E:\dbkuaizi\mongodb>
停止并删除

docker compose down 命令会停止并删除容器

PS E:\docker\mongodb> docker compose down
time="2025-09-18T21:47:55+08:00" level=warning msg="E:\\docker\\mongodb\\docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion"
[+] Running 3/3
 ✔ Container mongodb-my_mongodb_express-1  Removed                                                                 0.3s
 ✔ Container mongodb-my_mongodb-1          Removed                                                                 0.3s
 ✔ Network mongodb_default                 Removed                                                                 0.4s
停止不删除

docker compose stop 命令会停止并且不会删除容器

启动

docker compose start 命令会启动停止的容器



## 7. Docker Compose - 多容器编排



*  **背景**: 当一个完整的应用由多个模块（如前端、后端、数据库）组成时，若将所有模块打包成一个巨大容器，会导致故障蔓延、伸缩性差。若每个模块独立容器化，则管理多个容器（创建、网络配置）会增加复杂性。

*  **解决方案**: Docker Compose是一种轻量级的容器编排技术，用于管理多个容器的创建和协同工作。

*  **核心**: 使用YAML文件（通常命名为`docker-compose.yml`）定义多服务应用。

*  **YAML文件结构**: 可视为多个`docker run`命令按照特定格式组织在一个文件中。

  *  `services`: 顶级元素，每个服务对应一个容器。

  *  服务名称（如`mongodb`）: 对应`docker run`中的`--name`，作为容器名的一部分。

  *  `image`: 对应`docker run`中的镜像名。

  *  `environment`: 对应`docker run`的`-e`参数。

  *  `volumes`: 对应`docker run`的`-v`参数。

  *  `ports`: 对应`docker run`的`-p`参数。

  *  **网络**: Docker Compose会自动为每个Compose文件创建一个默认子网，文件中定义的所有容器都会自动加入此子网，并可通过服务名称互相访问。

  *  `depends_on`: 定义容器的启动顺序，确保依赖服务先启动。

*  **AI辅助**: 可借助AI工具生成等价的Docker Compose文件。

*  **Docker Compose命令**:

  *  `docker compose up`: 启动YAML文件中定义的所有服务（容器）。

    *  `-d`: 后台运行。

    *  会自动创建子网和容器。

  *  `docker compose down`: 停止并删除由Compose文件定义的所有服务和网络。

  *  `docker compose stop`: 仅停止服务，不删除容器。

  *  `docker compose start`: 启动已停止的服务。

  *  `docker compose -f <文件名.yml> up`: 指定非标准文件名的Compose文件进行操作。

*  **适用场景**: Docker Compose适合个人使用和单机运行的轻量级容器编排需求。

*  **与Kubernetes对比**: Kubernetes是企业级服务器集群和大规模容器编排的解决方案，功能更为复杂。



## 8. 总结



以上内容涵盖了Docker的核心概念、在不同操作系统上的安装方法、常用的镜像与容器管理命令、Dockerfile的编写与镜像构建流程、Docker的多种网络模式，以及轻量级多容器编排工具Docker Compose的使用。这些是理解和应用Docker的关键知识点。

