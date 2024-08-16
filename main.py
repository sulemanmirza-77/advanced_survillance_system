import argparse
import pdb
from typing import List
import shutil
import time
import numpy as np
from outfile import move_file
from draw import center, draw
from yolo import yolo_ultralytics_detections_to_norfair_detections, tracker_to_input
from ultralytics import YOLO
from norfair import AbsolutePaths, Paths, Tracker, Video
from norfair.camera_motion import HomographyTransformationGetter, MotionEstimator
from norfair.distances import create_normalized_mean_euclidean_distance
# from main import my_detector

DISTANCE_THRESHOLD_CENTROID: float = 0.08

def inference(input_video: str, output_video: str, model="yolov8", track_points='bbox', model_threshold="0.25", classes=0):
    st = time.time()
    coord_transformations = None
    paths_drawer = None
    fix_paths = True
    model = YOLO('models/yolov8l-world.pt')
    video = Video(input_path=input_video, output_path=output_video)

    transformations_getter = HomographyTransformationGetter()
    motion_estimator = MotionEstimator(
        max_points=500, min_distance=7, transformations_getter=transformations_getter
    )

    distance_function = create_normalized_mean_euclidean_distance(video.input_height, video.input_width)
    distance_threshold = DISTANCE_THRESHOLD_CENTROID

    tracker = Tracker(
        distance_function=distance_function,
        distance_threshold=distance_threshold,
        past_detections_length=5,
        hit_counter_max=5
    )

    paths_drawer = Paths(center, attenuation=0.01)
    if fix_paths:
        paths_drawer = AbsolutePaths(max_history=40, thickness=2)
    
    frame_count = 0
    for frame in video:
        frame_count += 1
        print("frame no:", frame_count)

        if frame_count == 1 or frame_count % 6 == 0:
            yolo_detections = model.predict(frame)
            detections = yolo_ultralytics_detections_to_norfair_detections(yolo_detections,frame, frame_count, track_points=track_points)
        else:
            detections = None

        tracked_objects = tracker.update(
            detections=detections, #coord_transformations=coord_transformations,
            period=5
        )
        # points_detected = tracker_to_input(tracked_objects)
        # print(tracked_objects)
        frame = draw(
            paths_drawer,
            track_points,
            frame,
            detections,
            tracked_objects,
            coord_transformations,
            fix_paths,
        )
        video.write(frame)

    print("time: ",time.time() - st)
    video_name = input_video.split("/")[-1]
    # print("video_name",video_name)
    video_name = video_name.split(".mp4")[0]
    # print("video_name",video_name)
    video_name = video_name + "_out.mp4"

    move_file(video_name)

#
# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="Track objects in a video.")
#     parser.add_argument(
#         "--files", type=str, default="videos/vid2_10s.mp4", help="Video files to process")
#     parser.add_argument(
#         "--detector-path", type=str, default="yolov7.pt", help="YOLOv7 model path"
#     )
#     parser.add_argument(
#         "--img-size", type=int, default="720", help="YOLOv7 inference size (pixels)"
#     )
#     parser.add_argument(
#         "--conf-threshold",
#         type=float,
#         default="0.25",
#         help="YOLOv7 object confidence threshold",
#     )
#     parser.add_argument(
#         "--classes",
#         default=0,
#         nargs="+",
#         type=int,
#         help="Filter by class: --classes 0, or --classes 0 2 3",
#     )
#     parser.add_argument(
#         "--device", type=str, default=None, help="Inference device: 'cpu' or 'cuda'"
#     )
#     parser.add_argument(
#         "--track-points",
#         type=str,
#         default="bbox",
#         help="Track points: 'centroid' or 'bbox'",
#     )
#     args = parser.parse_args()
#     print(args)
#     inference(
#         args.files,
#         args.detector_path,
#         args.track_points,
#         args.conf_threshold,
#         args.classes,
#     )


# inference('videos/vid2_10s.mp4')