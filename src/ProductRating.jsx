import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

const ProductRating = () => {
  const [editId, setEditId] = useState(null);
  const [feedbackListSec, setFeedbackListSec] = useState(
    () => JSON.parse(localStorage.getItem("feedbacks")) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: null,
      feedback: "",
    },
  });

  useEffect(() => {
    localStorage.setItem("feedbacks", JSON.stringify(feedbackListSec));
  }, [feedbackListSec]);

  const rating = watch("rating");

  const onSubmit = (data) => {
    if (data.rating && data.feedback.trim()) {
      if (editId) {
        setFeedbackListSec(
          feedbackListSec.map((item) =>
            item.id === editId
              ? { ...item, rating: Number(data.rating), feedback: data.feedback }
              : item
          )
        );
        setEditId(null); 
      } else {
        const newFeedback = {
          id: Date.now(),
          rating: Number(data.rating),
          feedback: data.feedback,
        };
        setFeedbackListSec([...feedbackListSec, newFeedback]);
      }
      reset(); 
    }
  };

  const handleDelete = (id) => {
    setFeedbackListSec(feedbackListSec.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    const itemToEdit = feedbackListSec.find((item) => item.id === id);
    setValue("rating", itemToEdit.rating);
    setValue("feedback", itemToEdit.feedback);
    setEditId(id); 
  };

  const averageRating = feedbackListSec.length
    ? (
        feedbackListSec.reduce((acc, item) => acc + item.rating, 0) /
        feedbackListSec.length
      ).toFixed(1)
    : <span className="text-gray-600">"N/A"</span>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-lg font-bold text-center mb-4 text-gray-800">
          How would you rate your service with us?
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-center mb-4 space-x-2">
            {[...Array(10)].map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-gray-800 transition-colors duration-200 ${
                  rating === String(index + 1)
                    ? "bg-pink-400 text-white"
                    : "bg-pink-100 hover:bg-pink-400"
                }`}
                onClick={() => setValue("rating", String(index + 1))}
              >
                {index + 1}
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mb-2">
              Please select a rating.
            </p>
          )}

          <div className="mb-4 flex items-center relative">
            <input
              type="text"
              {...register("feedback", { required: "Feedback is required." })}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Write a review"
            />
            <button
              type="submit"
              className="bg-gray-300 text-gray-700 py-1 px-2 text-sm font-semibold mr-1 absolute right-0 rounded-md hover:bg-gray-400"
            >
              {editId ? "Update" : "Send"}
            </button>
          </div>
          {errors.feedback && (
            <p className="text-red-500 text-sm mb-2">
              {errors.feedback.message}
            </p>
          )}
        </form>

        <div className="mt-6">
          <h2 className="font-semibold mb-3 text-md text-gray-800">Feedback List:</h2>
          <div className="max-h-48 overflow-y-auto scrollbar-hide bg-gray-100 rounded-md p-4 shadow-sm">
            {feedbackListSec.length > 0 ? (
              <ul className="space-y-4">
                {feedbackListSec.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between bg-white p-4 rounded-md shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">Rating: {item.rating}</p>
                      <p>{item.feedback}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No review available.</p>
            )}
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <h2 className="font-semibold text-md text-gray-800">
            Average Rating: {averageRating}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default ProductRating;