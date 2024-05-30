from ultralytics import YOLO

# Load a pretrained YOLOv10n model
model = YOLO("models/yolov10n.pt")

# # Perform object detection on an image
# results = model("image.jpg")
#
# # Display the results
# results[0].show()