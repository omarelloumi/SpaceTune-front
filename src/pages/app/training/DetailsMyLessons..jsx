import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrum";
import capture from "../../../assets/capture.png";
import EditTraining from "./EditTraining";
const DetailsMyLessons = () => {
  //réperer id in param
  const { id } = useParams();
  const { data: training, isLoading } = useQuery(
    ["fetchDetailsTraining", id],
    () =>
      axios
        .get(`http://localhost:3000/spacetune/api/formation/findOne/${id}`)
        .then((res) => res.data)
  );

  console.log(training, "training");

  return (
    <div>
      <Breadcrumb title="Training > Details training" />
      <div className="px-2 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-14">
        {!isLoading && (
          <div className="flex flex-col max-w-screen-lg bg-white border rounded shadow-sm lg:flex-row sm:mx-auto">
            <div className="relative lg:w-1/2">
              <img
                src={capture}
                alt=""
                className="object-cover w-full lg:absolute h-80 lg:h-full"
              />
              <svg
                className="absolute top-0 right-0 hidden h-full text-white lg:inline-block"
                viewBox="0 0 20 104"
                fill="currentColor"
              >
                <polygon points="17.3036738 5.68434189e-14 20 5.68434189e-14 20 104 0.824555778 104" />
              </svg>
            </div>
            <div className="flex flex-col justify-center p-8 bg-white lg:p-16 lg:pl-10 lg:w-1/2">
              <div>
                <p className="bg-green-300 inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
                  Guitar
                </p>
              </div>
              <h5 className="mb-3 text-3xl font-extrabold leading-none sm:text-4xl">
                {training.name}
              </h5>
              <p className="mb-5 text-gray-800">{training.description}</p>
              <div className="flex items-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center py-2 px-5 mr-6 font-medium tracking-wide text-white transition duration-200 rounded border border-gray-300
                           shadow-md bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none"
                >
                  Subscribe
                </button>
                <a
                  href="/"
                  aria-label=""
                  className="inline-flex items-center font-semibold transition-colors duration-200 text-deep-purple-accent-400 hover:text-deep-purple-800"
                >
                  Learn More
                  <svg
                    className="inline-block w-3 ml-2"
                    fill="currentColor"
                    viewBox="0 0 12 12"
                  >
                    <path d="M9.707,5.293l-5-5A1,1,0,0,0,3.293,1.707L7.586,6,3.293,10.293a1,1,0,1,0,1.414,1.414l5-5A1,1,0,0,0,9.707,5.293Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        <EditTraining />
      </div>
    </div>
  );
};

export default DetailsMyLessons;