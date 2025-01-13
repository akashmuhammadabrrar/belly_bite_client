import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router-dom";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItem = () => {
  const { recipe, image, price, category, name, _id } = useLoaderData();
  // console.table({ name, recipe, price, image, category });
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const onSubmit = async (data) => {
    // image upload to image bb and then get an url
    const imageFile = { image: data.image[0] };
    const res = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.success) {
      // now send the menu item data to the server with the image url
      const menuItem = {
        name: data.name,
        category: data.category,
        image: res.data.data.display_url,
        price: parseFloat(data.price),
        recipe: data.recipe,
      };
      // now send data with use axios secure
      const menuRes = await axiosSecure.patch(`/menu/${_id}`, menuItem);
      console.table(menuRes.data);
      if (menuRes.data.modifiedCount > 0) {
        // reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Item Updated Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
    // console.log("with image url", res.data);
  };

  return (
    <div>
      <SectionTitle
        heading={"Update The Item"}
        subHeading={"Hurry Up"}></SectionTitle>

      <div className="bg-slate-200 p-10 mt-4 w-4/5 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* name field */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Recipe Name*</span>
            </div>
            <input
              defaultValue={name}
              {...register("name", { required: true })}
              type="text"
              required
              placeholder="Recipe Name Here"
              className="input input-bordered w-full rounded-md"
            />
          </label>
          <div className="flex justify-between items-center gap-2 mt-4">
            {/* price field */}
            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Make A Price*</span>
              </div>
              <input
                defaultValue={price}
                {...register("price", { required: true })}
                type="number"
                placeholder="Put Down The Price"
                className="input input-bordered w-full rounded-md"
              />
            </label>
            {/* category */}
            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Select Category*</span>
              </div>
              <select
                defaultValue={category}
                {...register("category", { required: true })}
                className="select select-bordered w-full rounded-md">
                <div className="label">
                  <span className="label-text">Make A Price*</span>
                </div>
                <option disabled value="default">
                  Select A Category
                </option>
                <option value="salad">Salad</option>
                <option value="pizza">Pizza</option>
                <option value="soup">Soup</option>
                <option value="dessert">Desserts</option>
                <option value="drinks">Drinks</option>
                <option value="popular">Popular</option>
                <option value="offered">Offered</option>
              </select>
            </label>
          </div>
          {/* text area */}
          <label className="form-control w-full ">
            <div className="label mt-6">
              <span className="label-text">Recipe Details*</span>
            </div>
            <textarea
              defaultValue={recipe}
              {...register("recipe", { required: true })}
              placeholder="Recipe details"
              className="textarea textarea-bordered textarea-xs w-full mt-10 py-10 rounded"></textarea>
          </label>
          {/* upload files here */}
          <div className="mt-2">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs rounded"
            />
          </div>
          <br />
          <button className="btn bg-[#e3b96a] font-bold">
            Update Menu Items{" "}
            <FaUtensils className="ml-4 text-white text-xl font-bold"></FaUtensils>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateItem;
