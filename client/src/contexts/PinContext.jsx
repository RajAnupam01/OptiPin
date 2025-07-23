import { createContext, useContext, useEffect, useState } from "react";
import { UserData } from "./UserContext";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState();
  const [category, setCategory] = useState("");

  const { isAuth, setBtnLoading } = UserData();

  // ✅ Fetch all pins
  async function fetchPins(categoryName = "") {
    try {
      const url = categoryName
        ? `/api/pins/category?category=${categoryName}`
        : "/api/pins/all";
      const { data } = await axios.get(url);
      setPins(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchPins();
    }
  }, [isAuth]);

  const searchCategory = (categoryName) => {
    setCategory(categoryName);
    fetchPins(categoryName);
  };

  // ✅ Fetch single pin
  async function fetchSinglePin(id) {
    setLoading(true);
    setPin(null);
    try {
      const { data } = await axios.get(`/api/pins/single/${id}`);
      setPin(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Create pin
  async function createPin(title, description, image, category, navigate) {
    try {
      setBtnLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("image", image);

      const { data } = await axios.post("/api/pins/create", formData);
      toast.success(data.message);
      fetchPins();
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  }

  // ✅ Update pin
  async function updatePin(pinId, title, description, setEdit) {
    try {
      const { data } = await axios.patch(`/api/pins/edit/${pinId}`, {
        title,
        description,
      });
      toast.success(data.message);
      fetchSinglePin(pinId);
      setEdit(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update pin");
    }
  }

    // ✅ Get comments for a specific pin
  async function getCommentForPin(pinId) {
    try {
      const { data } = await axios.get(`/api/comment/pin/${pinId}`);
      return data.data; // returning just the comments array
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
      return [];
    }
  }





  // ✅ Add comment
  async function addComment(pinId, content, setComment) {
    try {
      const { data } = await axios.post(`/api/comment/pin/${pinId}`, { content });
      toast.success(data.message);
      fetchSinglePin(pinId);
      setComment("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  }

  // ✅ Delete comment
  async function deleteComment(commentId) {
    try {
      const { data } = await axios.delete(`/api/comment/${commentId}`);
      toast.success(data.message);
      if (pin?._id) fetchSinglePin(pin._id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  }

  // ✅ Delete pin
  async function deleteEntirePin(pinId, navigate) {
    try {
      const { data } = await axios.delete(`/api/pins/rm-pin/${pinId}`);
      toast.success(data.message);
      fetchPins();
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete pin");
    }
  }
    // ✅ Toggle like
  async function toggleLikePin(pinId) {
    try {
      const { data } = await axios.patch(`/api/pins/${pinId}/like`);
      toast.success(data.message);

      // ✅ Refresh the single pin if open
      if (pin?._id === pinId) {
        fetchSinglePin(pinId);
      }

      // ✅ Optionally refresh all pins list
      fetchPins(category);
    } catch (error) {
      console.error(error);
      toast.error("Failed to like/unlike");
    }
  }


  return (
    <PinContext.Provider
      value={{
        pins,
        loading,
        fetchPins,
        searchCategory,
        fetchSinglePin,
        pin,
        createPin,
        updatePin,
        addComment,
        deleteComment,
        deleteEntirePin,
        getCommentForPin,
        toggleLikePin
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const PinData = () => useContext(PinContext);

