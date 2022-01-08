import { CameraInput } from "components/CameraInput";
import { useSignRecognition } from "components/hooks";
import { useState } from "react"

export default () => {
    const [prediction, setPrediction] = useState(null);
    const { handleFrame } = useSignRecognition(setPrediction);

    return <div>
        <CameraInput handleFrame={handleFrame} />
        <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)"}}>
            {prediction && Object.entries(prediction).map(([label, conf]) =>
                <div key={label} style={{backgroundColor: `rgba(0, 170, 19, ${conf})`}}>
                    {label}: {conf.toFixed(2)}
                </div>
            )}
        </div>
    </div>
}