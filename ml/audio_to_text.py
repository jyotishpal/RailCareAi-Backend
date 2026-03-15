import whisper
import sys

# load whisper model
model = whisper.load_model("base")

audio_path = sys.argv[1]

# speech to text
result = model.transcribe(audio_path)

print(result["text"])