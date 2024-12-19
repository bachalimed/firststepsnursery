import { useState, useEffect } from "react";
import { useAddNewFamilyMutation } from "./familiesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import Students from "../../Students";
import { useGetFamiliesByYearQuery } from "./familiesApiSlice";
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import NewFatherForm from "./NewFatherForm";
import NewMotherForm from "./NewMotherForm";
import NewFamilyAddChildrenForm from "./NewFamilyAddChildrenForm";
import FamilyCompleted from "./FamilyCompleted";
import { StepperContext } from "../../../../contexts/StepperContext";
import { selectAllAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice"
import { useOutletContext } from "react-router-dom";

const NewFamily = () => {
  //an add parent function that can be called inside the component

  const [currentStep, setCurrentStep] = useState(1);
  const [father, setFather] = useState({});
  const [mother, setMother] = useState({});
  const [familySituation, setFamilySituation] = useState("Joint");
  const [children, setChildren] = useState([]);
  const [family, setFamily] = useState({});

  const [canSaveFather, setCanSaveFather] = useState(false);
  const [canSaveMother, setCanSaveMother] = useState(false);
  const [canSaveChildren, setCanSaveChildren] = useState(false);

  const steps = ["Father Details", "Mother Details", "Children", "Completed"];

  const [
    addNewFamily,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewFamilyMutation(); //it will not execute the mutation nownow but when called

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <NewFatherForm />;
      case 2:
        return <NewMotherForm />;
      case 3:
        return <NewFamilyAddChildrenForm />;
      case 4:
        return <FamilyCompleted />;

      default:
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;
    if (currentStep === 3) {
      handleSubmit();
    }

    if (currentStep <= 2 && direction === "Next") {
      newStep++;
    }
    if (currentStep <= 2 && direction === "Back") {
      newStep--;
    }

    //check if step are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  const handleSubmit = async () => {
    //remove last element of children if it is empty
    if (children[children.length - 1]?.child === "") {
      // Remove the last element using slice
      setChildren(children.slice(0, -1));
    }
    console.log("children", children);

    try {
      const response = await addNewFamily({
      father: father,
      mother: mother,
      children: children,
      familySituation: familySituation,
    }); 
    //we call the add new user mutation and set the arguments to be saved
    //added this to confirm save
    console.log(response,'response')
    if (response?.data?.message ) {
        // Success response
        triggerBanner(response?.data?.message, "success");
        setCurrentStep(4)

      } else if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
        setCurrentStep(4)

      }
      else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
        setCurrentStep(3)
      } else if (isAddError) {
        // In case of unexpected response format
        triggerBanner(addError?.data?.message, "error");
        setCurrentStep(3)
      
    } else {
      // In case of unexpected response format
      triggerBanner("Unexpected response from server.", "error");
      setCurrentStep(3)
    }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
      setCurrentStep(3)
    }
    // if (!isAddLoading) {
    //   setCurrentStep(4);
    // }
  };
  //console.log( father, 'father', mother, 'mother', children, familySituation,'data in parent form')
  //maybe check here and allow steps to move on

  const content = (
    <>
      <Students />
      <div className="md:w-3/4 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
        <div className="container horizontal mt-5">
          <Stepper steps={steps} currentStep={currentStep} />
          {/* display componentns */}
          <div className="my-10 p-10">
            <StepperContext.Provider
              value={{
                father,
                setFather,
                mother,
                setMother,
                familySituation,
                setFamilySituation,
                family,
                setFamily,
                canSaveFather,
                setCanSaveFather,
                canSaveMother,
                setCanSaveMother,
                canSaveChildren,
                setCanSaveChildren,
                children,
                setChildren,
              }}
            >
              {displayStep(currentStep)}
            </StepperContext.Provider>
          </div>
        </div>
        <div>
          {currentStep !== steps.length && (
            <StepperControl
              canSaveFather={canSaveFather}
              canSaveMother={canSaveMother}
              canSaveChildren={canSaveChildren}
              handleClick={handleClick}
              handleSubmit={handleSubmit}
              currentStep={currentStep}
              steps={steps}
            />
          )}
        </div>
      </div>
    </>
  );

  return content;
};
export default NewFamily;
