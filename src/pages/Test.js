import { CameraInput } from "components/CameraInput";
import { useSignRecognition } from "components/hooks";
import { useState } from "react"

export default () => {
    const [predictions, setPredictions] = useState([]);
    const { handleFrame } = useSignRecognition(p => setPredictions([...predictions, p]));

    return <div>
        <CameraInput handleFrame={handleFrame} />
        <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)"}}>
            {predictions.map((val, i) =>
                <div key={i}>
                    {val}
                </div>
            )}
        </div>
    </div>
}