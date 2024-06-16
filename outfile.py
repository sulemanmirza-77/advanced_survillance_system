import shutil

def move_file(filename):
    # file = "vid2_10s_out.mp4"
    print(filename)
    shutil.move(filename,f"output/{filename}")
    print("file moved to output directory...")