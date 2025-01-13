import React from "react";
import MenuItems from "../../../shared/MenuItem/MenuItems";
import Covered from "../../../shared/Covered/Covered";
import { Link } from "react-router-dom";

const MenuCategory = ({ items, title, Img }) => {
  // console.log(title);
  return (
    <div>
      {title && <Covered img={Img} title={title}></Covered>}
      <div className="grid md:grid-cols-2 gap-4 mt-10">
        {items.map((item) => (
          <MenuItems key={item._id} item={item}></MenuItems>
        ))}
      </div>
      <Link to={`/orders/${title}`}>
        <button className="btn btn-outline border-0 border-b-4 text-black mt-4 my-5">
          Order Now
        </button>
      </Link>
    </div>
  );
};

export default MenuCategory;
