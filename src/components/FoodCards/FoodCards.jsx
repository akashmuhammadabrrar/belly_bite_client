import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useCart from "../../hooks/useCart";

const FoodCards = ({ item }) => {
  const { name, image, category, price, recipe, _id } = item;
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [, refetch] = useCart();

  const handleAddToCart = () => {
    if (user && user?.email) {
      // send cart item to the database
      const cartItems = {
        menuId: _id,
        email: user.email,
        name,
        image,
        price,
      };

      axiosSecure.post("/carts", cartItems).then((res) => {
        // console.log(res.data);
        if (res.data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${name} Added To The Cart`,
            showConfirmButton: false,
            timer: 2500,
          });
          // refetch the cart to update the items count
          refetch();
        }
      });
    } else {
      Swal.fire({
        title: "Your Are Not Logged In !",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Login",
      }).then((result) => {
        if (result.isConfirmed) {
          //  send the user to the login page
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };

  return (
    <div className="card bg-base-200 h-[541px]  shadow-xl rounded-none">
      <figure>
        <img src={image} alt="foods" />
      </figure>
      <p className="absolute right-0 mr-4 mt-4 p-1 rounded-md bg-slate-900 text-white font-semibold">
        Price $:{price}
      </p>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>Category: {category}</p>
        <p>Recipe: {recipe}</p>
        <div className="card-actions justify-center">
          <button
            onClick={handleAddToCart}
            className="btn btn-outline text-orange-500 border-0 border-b-4">
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCards;
