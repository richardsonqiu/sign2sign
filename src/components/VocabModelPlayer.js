const { useEffect } = require("react");

import { FaPause, FaPlay, FaSquare } from "react-icons/fa";

import { ModelPlayer } from "components/ModelPlayer";
import { useModelPlayer } from "components/hooks";

export const VocabModelPlayer = ({ words, index }) => {
    const {
        playerState,
        handleFrame,
        loadSentenceClips,
        setSentences, setIndex,
        seek, play, stop, reset
    } = useModelPlayer();

    useEffect(() => {
        setSentences(words.map(w => [w]));
    }, [words]);

    useEffect(() => {
        setIndex(index);
    }, [index]);

    // Current word from player state
    const wordDuration = playerState.wordTimes[playerState.index]?.at(-1);

    return <div className="model-container">
        <div className="model-player">
            <ModelPlayer
                playerState={playerState}
                handleFrame={handleFrame}
                loadSentenceClips={loadSentenceClips}
            />
        </div>
        <div className="model-controls">
                <div
                    className="play-pause"
                    onClick={() =>
                        (Math.abs(playerState.time - wordDuration) < 0.01)
                            ? reset()
                            : (playerState.isPlaying)
                                ? stop()
                                : play()
                    }
                >
                    {
                        (Math.abs(playerState.time - wordDuration) < 0.01)
                            ? <FaSquare />
                            : (playerState.isPlaying)
                                ? <FaPause />
                                : <FaPlay />
                    }
                </div>
                <input
                    type="range"
                    min={0}
                    max={wordDuration}
                    step={0.01}
                    value={playerState.time}
                    onInput={e => seek(parseFloat(e.target.value))}
                />
            </div>
    </div>
}