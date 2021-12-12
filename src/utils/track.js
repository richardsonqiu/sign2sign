import { getWord } from "api";
import { Euler, Quaternion, QuaternionKeyframeTrack, Vector3, AnimationClip } from "three";
import { armAngles } from "utils/pose"; 


function landmarksToVector3(landmarks, normFactor={x: 16/9, y: 1, z: 16/9}) {
    return landmarks.map(p => (p.length == 0)
        ? new Vector3(NaN, NaN, NaN)
        : new Vector3(
            p[0] * normFactor.x,
            (1-p[1]) * normFactor.y,
            -p[2] * normFactor.z
        ));
}

async function fetchTrack(word) {
    const res = await getWord(word);
    return res.data.track;
}

function processAngles(jsonTrack) {
    const track = {
        pose: jsonTrack.pose_landmarks.map(landmarks => landmarksToVector3(landmarks)),
        leftHand: jsonTrack.left_hand_landmarks.map(landmarks => landmarksToVector3(landmarks)),
        rightHand: jsonTrack.right_hand_landmarks.map(landmarks => landmarksToVector3(landmarks))
    };

    const trackAngles = {};

    const leftTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "LEFT"));
    const rightTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "RIGHT"));
    // const leftTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "LEFT", track.leftHand[i]));
    // const rightTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "RIGHT", track.leftHand[i]));

    const times = Array.from({length: leftTrackAngles.length}, (_, i) => i / 30);

    for (let key of Object.keys(leftTrackAngles[0])) {
        
        trackAngles["left" + key] = leftTrackAngles.map(frameAngles =>
            new Quaternion().setFromEuler(
                new Euler(frameAngles[key].x, frameAngles[key].y, frameAngles[key].z, "ZYX")
            ).toArray()
        ).flat(1);

        trackAngles["right" + key] = rightTrackAngles.map(frameAngles =>
            new Quaternion().setFromEuler(
                new Euler(frameAngles[key].x, frameAngles[key].y, frameAngles[key].z, "ZYX")
            ).toArray()
        ).flat(1);
    }

    return {
        trackAngles,
        times
    };
}


export const getTrackAngles = function() {
    const cache = {};
    return async word => {
        if (!cache[word]) {
            const track = await fetchTrack(word);
            cache[word] = processAngles(track);
        }
        
        return cache[word];
    }
}()


export async function getSentenceClipWithTimes(sentence, boneNames) {
    const wordTracks = [];
    for (const word of sentence) {
        wordTracks.push(await getTrackAngles(word));
    }
    
    const wordTimes = [];
    const times = [];
    {
        let offset = 0;
        const transition = 0.25;
        for (const wordTrack of wordTracks) {
            wordTimes.push(offset);
            times.push(...wordTrack.times.map(t => t + offset));
            offset = times[times.length - 1] + transition;
        }
        wordTimes.push(offset - transition);
    }
    
    const keyframeTracks = [];
    for (const key of Object.keys(wordTracks[0].trackAngles)) {
        keyframeTracks.push(new QuaternionKeyframeTrack(
            `${boneNames[key]}.quaternion`,
            times,
            [].concat(...wordTracks.map(wt => wt.trackAngles[key]))
        ));
    }

    return {
        clip: new AnimationClip(sentence.join(' '), -1, keyframeTracks),
        wordTimes: wordTimes
    }
}