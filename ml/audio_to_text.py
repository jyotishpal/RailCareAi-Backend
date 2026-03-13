import whisper
import sys

# load whisper model
model = whisper.load_model("base")

# audio file path
audio_path = sys.argv[1]

# convert audio → text
result = model.transcribe(audio_path)

print(result["text"])