# 一. FunASR简介
FunASR是一个基础语音识别工具包，提供多种功能，包括语音识别（ASR）、语音端点检测（VAD）、标点恢复、语言模型、说话人验证、说话人分离和多人对话语音识别等。FunASR提供了便捷的脚本和教程，支持预训练好的模型的推理与微调。

# 二.安装部署
## 1.新建conda环境
`conda` create -n funasr `python==3.11.0`
`conda activate funasr`
## 2.安装对应pytorch及各项依赖库（检查当前cuda版本）
`nvidia-smi`
`pip install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu129`
`pip install torchaudio`
`pip3 install -U funasr`
`pip3 install -U modelscope huggingface huggingface_hub`
`pip install websockets==12.0`
`pip install pyaudio`
## 3.启动 funasr服务端
`cd runtime/python/websocket`
`python funasr_wss_server.py --port 10095`
## 4.启动 funasr客户端
`python funasr_wss_client.py --host "0.0.0.0" --port 10095 --mode online --chunk_size "5,10,5" --audio_in "./data/v.wav" --output_dir "./results"`
     