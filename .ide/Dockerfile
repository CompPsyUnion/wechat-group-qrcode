FROM node:20

# 安装 ssh 服务，用于支持 VSCode 等客户端通过 Remote-SSH 访问开发环境（也可按需安装其他软件）
RUN apt-get update && apt-get install -y git wget unzip openssh-server

# 设置腾讯源
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

# 安装 code-server 和插件
RUN curl -fsSL https://code-server.dev/install.sh | sh && \
    code-server --install-extension cnbcool.cnb-welcome && \
    code-server --install-extension redhat.vscode-yaml && \
    code-server --install-extension dbaeumer.vscode-eslint && \
    code-server --install-extension waderyan.gitblame && \
    code-server --install-extension mhutchie.git-graph && \
    code-server --install-extension donjayamanne.githistory && \
    code-server --install-extension tencent-cloud.coding-copilot &&\
    code-server --install-extension Vue.volar &&\
    code-server --install-extension eamodio.gitlens

# 安装 pnpm
RUN npm install -g pnpm --no-fund --no-audit && pnpm --version

# 安装依赖
RUN pnpm install

# 指定字符集支持命令行输入中文（根据需要选择字符集）
ENV LANG C.UTF-8
ENV LANGUAGE C.UTF-8