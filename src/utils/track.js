import * as api from "api";
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

async function fetchTrack(key) {
    const res = await api.getTrack(key.replace(/[^A-Za-z0-9]/g, '_'));
    return res.data.track;
}

async function fetchAnimation(key) {
    const res = await api.getAnimation(key.replace(/[^A-Za-z0-9]/g, '_'));
    return res.data;
}

function processAngles(jsonTrack) {
    const normFactor = {
        x: jsonTrack.width/jsonTrack.height,
        y: 1,
        z: jsonTrack.width/jsonTrack.height
    }
    const track = {
        pose: jsonTrack.pose_landmarks.map(landmarks => landmarksToVector3(landmarks, normFactor)),
        leftHand: jsonTrack.left_hand_landmarks.map(landmarks => landmarksToVector3(landmarks, normFactor)),
        rightHand: jsonTrack.right_hand_landmarks.map(landmarks => landmarksToVector3(landmarks, normFactor)),
        fps: jsonTrack.fps
    };

    const trackAngles = {};

    const leftTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "LEFT"));
    const rightTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "RIGHT"));
    // const leftTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "LEFT", track.leftHand[i]));
    // const rightTrackAngles = track.pose.map((_, i) => armAngles(track.pose[i], "RIGHT", track.leftHand[i]));

    const times = Array.from({length: leftTrackAngles.length}, (_, i) => i / track.fps);

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

export const getAnimation = function() {
    const cache = {};
    return async key => {
        if (!cache[key]) {
            const animationData = await fetchAnimation(key);
            cache[key] = AnimationClip.parse(animationData);
        }
        
        return cache[key].clone();
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

const wordTransitionTime = 0.25;

export async function getSentenceClipWithAnimation(sentence) {
    const trackDataList = {};

    const wordTimes = [];
    let offset = 0;
    for (const word of sentence) {
        const wordClip = await getAnimation(word.gloss);

        for (const wordTrack of wordClip.tracks) {
            const name = wordTrack.name;

            if (!trackDataList[name]) {
                trackDataList[name] = {
                    constructor: wordTrack.constructor,
                    name: wordTrack.name,
                    times: [],
                    values: []
                }
            }

            
            const trackData = trackDataList[name];
            wordTrack.shift(offset);

            // let values = null;
            // if (name.includes('position')) {
            //     console.log(wordTrack.values)
            //     values = flipPositionAxis(wordTrack.values);
            //     console.log(values)
            // } else {
            //     values = wordTrack.values;
            // }

            trackData.times.push(...Array.from(wordTrack.times));
            trackData.values.push(...Array.from(wordTrack.values));
        }
        
        wordTimes.push(offset);
        offset += wordClip.duration + wordTransitionTime;
    }
    wordTimes.push(offset - wordTransitionTime);

    const tracks = [];
    for (const {constructor, name, times, values} of Object.values(trackDataList)) {
        tracks.push(new constructor(name, times, values));
    }

    return {
        clip: new AnimationClip(sentence.join(' '), -1, tracks),
        wordTimes
    }
}
