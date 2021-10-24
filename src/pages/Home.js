import React from "react";
import MenuList from "../components/MenuList";
import LessonCard from "../components/LessonCard";
import Menu from "../components/Menu";
import { menu } from "../data";

const Home = () => {
  const { id, title, img, progress, detail } = menu;
  return (
    <section className="container section">
      <h1 className="section-title">Welcome back, Bob</h1>
      <div className="cards-center">
        {menu.map((item) => {
          return <Menu key={item.id} {...item} />;
        })}
      </div>
    </section>
  );
};

export default Home;
