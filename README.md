# Recorder
Express server that accepts a set of images and converts them into an h264 encoded mp4 video. Commonly used to record a canvas element with a consistent frame rate.

## How to use
**Default port** ```5000``` <br />
<br />
```/add_frame```<br />
<br />
An ***async post request*** that returns after the image has been saved to the server's harddrive. Accepts a ***stringified request object*** with three parameters.<br />
```
{
    action: "add_frame",
    data: <image dataUrl>,
    sessionId: <id identifying images of the same video>,
}
```
<br/>
<br />
```/process```
<br/>
<br />
