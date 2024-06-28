from ultralytics import YOLO
import torch
import yaml

# Specify paths
model_path = 'betterbus-ml/best.pt'
data_yaml_path = 'betterbus-ml/data.yaml'

# Load YOLOv8 model
model = YOLO(model_path)

# Manually load data.yaml
with open(data_yaml_path, 'r') as f:
    data_config = yaml.safe_load(f)

# Set model attributes
model.model.names = data_config['names']
model.model.yaml_path = data_yaml_path

# Set model to evaluation mode
model.model.eval()

# Create dummy input
dummy_input = torch.randn(1, 3, 640, 640)

# Export the model to ONNX
torch.onnx.export(model.model, dummy_input, 'betterbus-ml/best_yolov8.onnx', opset_version=11, input_names=['images'], output_names=['output'])

print("Model has been successfully converted to ONNX format and saved as 'best_yolov8.onnx'")
