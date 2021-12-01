import React from "react";

export const users = [
  {
    id: 1,
    username: "Bob",
    lesson_progress: 1,
    vocab_progress: 2,
    convo_progress: 3,
  },
  {
    id: 2,
    username: "Alice",
    lesson_progress: 2,
    vocab_progress: 3,
    convo_progress: 1,
  },
];

export const menu = [
  {
    id: "lesson",
  },
  {
    id: "vocabulary",
  },
  {
    id: "conversation",
  },
];

export const lessons = [
  {
    id: 1,
    img: require("./imgs/lesson1.png").default,
    title: "Getting to know you",
  },
  {
    id: 2,
    img: require("./imgs/lesson2.png").default,
    title: "Going to eat pizza",
  },
  {
    id: 3,
    img: require("./imgs/lesson3.png").default,
    title: "Asking direction",
  },
];
