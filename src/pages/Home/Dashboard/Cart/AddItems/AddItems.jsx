import React from "react";
import SectionTitle from "../../../../../components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";
import useAxiosPublic from "../../../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddItems = () => {
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
    // console.log(res.data);
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
      const menuRes = await axiosSecure.post("/menu", menuItem);
      console.table(menuRes.data);
      if (menuRes.data.insertedId) {
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Item Added Successfully",
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
        heading={"Add An Item Here"}
        subHeading={"What's New"}></SectionTitle>

      <div className="bg-slate-200 p-10 mt-4 w-4/5 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* name field */}
          <label className="form-control w-full ">
            <div className="label">
              <span className="label-text">Recipe Name*</span>
            </div>
            <input
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
                defaultValue="default"
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
            Add Items{" "}
            <FaUtensils className="ml-4 text-white text-xl font-bold"></FaUtensils>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItems;

// import React from "react";
// import SectionTitle from "../../../../../components/SectionTitle/SectionTitle";
// import { useForm } from "react-hook-form";
// import { FaUtensils } from "react-icons/fa";
// import useAxiosPublic from "../../../../../hooks/useAxiosPublic";
// import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
// import Swal from "sweetalert2";

// const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
// const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

// const AddItems = () => {
//   const { register, handleSubmit, reset } = useForm();
//   const axiosPublic = useAxiosPublic();
//   const axiosSecure = useAxiosSecure();

//   const onSubmit = async (data) => {
//     try {
//       // Prepare FormData for image upload
//       const formData = new FormData();
//       formData.append("image", data.image[0]);
//       console.log(formData);

//       // Upload image to image hosting API
//       const res = await axiosPublic.post(image_hosting_api, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("API Response:", res.data); // Log the entire response

//       if (res.data.success) {
//         const imageUrl = res.data.data.display_url;
//         if (!imageUrl) {
//           throw new Error("Image URL is undefined.");
//         }

//         // Prepare menu item data
//         const menuItem = {
//           name: data.name,
//           category: data.category,
//           image: imageUrl,
//           price: parseFloat(data.price),
//           recipe: data.recipe,
//         };

//         console.log("Image URL:", imageUrl); // Log the image URL

//         // Send menu item data to the server
//         const menuRes = await axiosSecure.post("/menu", menuItem);
//         console.table(menuRes.data);
//         if (menuRes.data.insertedId) {
//           reset();
//           Swal.fire({
//             position: "top-end",
//             icon: "success",
//             title: "Item Added Successfully",
//             showConfirmButton: false,
//             timer: 1500,
//           });
//         }
//       } else {
//         throw new Error("Image upload failed.");
//       }
//     } catch (error) {
//       console.error("Error adding item:", error);
//       Swal.fire("Error", error.message, "error");
//     }
//   };

//   return (
//     <div>
//       <SectionTitle heading={"Add An Item Here"} subHeading={"What's New"} />
//       <div className="bg-slate-200 p-10 mt-4 w-4/5 mx-auto">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* name field */}
//           <label className="form-control w-full">
//             <div className="label">
//               <span className="label-text">Recipe Name*</span>
//             </div>
//             <input
//               {...register("name", { required: true })}
//               type="text"
//               required
//               placeholder="Recipe Name Here"
//               className="input input-bordered w-full rounded-md"
//             />
//           </label>
//           <div className="flex justify-between items-center gap-2 mt-4">
//             {/* price field */}
//             <label className="form-control w-full">
//               <div className="label">
//                 <span className="label-text">Make A Price*</span>
//               </div>
//               <input
//                 {...register("price", { required: true })}
//                 type="number"
//                 placeholder="Put Down The Price"
//                 className="input input-bordered w-full rounded-md"
//               />
//             </label>
//             {/* category */}
//             <label className="form-control w-full">
//               <div className="label">
//                 <span className="label-text">Select Category*</span>
//               </div>
//               <select
//                 defaultValue="default"
//                 {...register("category", { required: true })}
//                 className="select select-bordered w-full rounded-md">
//                 <option disabled value="default">
//                   Select A Category
//                 </option>
//                 <option value="salad">Salad</option>
//                 <option value="pizza">Pizza</option>
//                 <option value="soup">Soup</option>
//                 <option value="dessert">Desserts</option>
//                 <option value="drinks">Drinks</option>
//                 <option value="popular">Popular</option>
//                 <option value="offered">Offered</option>
//               </select>
//             </label>
//           </div>
//           {/* text area */}
//           <label className="form-control w-full">
//             <div className="label mt-6">
//               <span className="label-text">Recipe Details*</span>
//             </div>
//             <textarea
//               {...register("recipe", { required: true })}
//               placeholder="Recipe details"
//               className="textarea textarea-bordered textarea-xs w-full mt-10 py-10 rounded"
//             />
//           </label>
//           {/* upload files here */}
//           <div className="mt-2">
//             <input
//               {...register("image", { required: true })}
//               type="file"
//               className="file-input file-input-bordered w-full max-w-xs rounded"
//             />
//           </div>
//           <br />
//           <button className="btn bg-[#e3b96a] font-bold">
//             Add Items{" "}
//             <FaUtensils className="ml-4 text-white text-xl font-bold" />
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddItems;
