import { Camera } from "@mediapipe/camera_utils";
import { useRef } from "react";
import { useEffect } from "react";

export const CameraInput = ({ handleFrame }) => {
    const cameraRef = useRef(null);

    useEffect(() => {
        const camera = new Camera(cameraRef.current, {
            onFrame: () => handleFrame(cameraRef.current)
        });

        camera.start()

        return camera.stop;
    }, []);
    
    return <div>
        <video ref={cameraRef}></video>
    </div>
}
