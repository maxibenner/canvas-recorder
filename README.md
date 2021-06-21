# Recorder
Express server that accepts a set of images and converts them into an h264 encoded mp4 video. Commonly used to record a canvas element with a consistent frame rate.

## How to use
**Default port** ```5000``` <br />
<br />
<br/>
```/add_frame```<br />
<br />
An ***async post request*** that returns after the image has been saved to the server's harddrive.<br />
```javascript
{
    action: "add_frame",
    data: <image dataUrl>,
    sessionId: <id identifying images of the same video>,
}
```
Accepts a ***stringified request object*** with three parameters.<br />
<br/>
<br/>
```/process```<br />
<br />
An ***aync get request*** that starts converting all images of the provided session id and then returns the download url for the final video. Accepts three query parameters:<br/>
<br/>
***duration:*** Clip duration in second"<br/>
***fps:*** Target fps<br/>
***sessionId:*** Group id provided with /add_frame
