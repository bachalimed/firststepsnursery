import React from "react";
import { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
const StepperControl = ({
  handleClick,
  currentStep,
  steps,
  canSaveFather,
  setCanSaveFather,
  canSaveMother,
  setCanSaveMother,
  canSaveChildren,
  handleSubmit,
}) => {
  //console.log(currentStep)
 
 

  return (
    <div className="container flex justify-around mt-4 mb-8">
      <button
        onClick={() => handleClick("Back")}
        className={`bg-white text-slate-400 uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white
        transition duration-200 ease-in-out ${
          currentStep === 1 ? "opacity-50 cursor-not-allowed " : ""
        }`}
      >
        {" "}
        back{" "}
      </button>
     
      <button
        onClick={() => handleClick("Next")}
        className={`bg-green-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer  hover:bg-slate-700 hover:text-white
        transition duration-200 ease-in-out `}
        disabled={
          (!canSaveFather && currentStep === 1) ||
          (!canSaveMother && currentStep === 2) ||
          (!canSaveChildren && currentStep === 3)
        }
      >
        {" "}
        {currentStep === steps.length - 1 ? "Confirm" : "Next"}{" "}
      </button>
    </div>
  );
};

export default StepperControl;
