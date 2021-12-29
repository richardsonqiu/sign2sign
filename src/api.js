import axios from "axios";
import config from "config"

export const apiClient = axios.create({
    baseURL: config.API_BASE,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

export function getUser(userId) {
    return apiClient.get(`/user/${userId}`);
}

export function getProgress() {
    return apiClient.get(`/progress`);
}

export function getLessons() {
    return apiClient.get(`/lessons`);
}

export function getLesson(lessonId) {
    return apiClient.get(`/lesson/${lessonId}`);
}

export function getVocabs() {
    return apiClient.get(`/vocabularies`);
}

export function getVocab(lessonId, vocabIndex) {
    return apiClient.get(`/lesson/${lessonId}/vocabulary/${vocabIndex}`);
}

export function getConversations() {
    return apiClient.get(`/conversations`);
}

export function getConversation(lessonId, convoIndex) {
    return apiClient.get(`/lesson/${lessonId}/conversation/${convoIndex}`);
}

export function getWord(key) {
    return apiClient.get(`/word/${key}`);
}
