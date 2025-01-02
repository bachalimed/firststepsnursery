import { useState, useEffect } from "react";
import { useUpdateFamilyMutation } from "./familiesApiSlice";
import {  useParams } from "react-router-dom";

import Students from "../../Students";
import { useGetFamilyByIdQuery } from "./familiesApiSlice";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import EditFatherForm from "./EditFatherForm";
import EditMotherForm from "./EditMotherForm";
import EditFamilyAddChildrenForm from "./EditFamilyAddChildrenForm";
import FamilyCompleted from "./FamilyCompleted";
import { StepperContext } from "../../../../contexts/StepperContext";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
const EditFamily = () => {
  //an add parent function that can be called inside the component
  const { id } = useParams();
  //console.log(id, "id");

  const [family, setFamily] = useState({});
  const [father, setFather] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [canSaveFather, setCanSaveFather] = useState(false);
  const [canSaveMother, setCanSaveMother] = useState(false);
  const [canSaveChildren, setCanSaveChildren] = useState(false);
  const [mother, setMother] = useState({});
  const [familySituation, setFamilySituation] = useState("");
  const [children, setChildren] = useState([]);
  const [isUpdatingFather, setIsUpdatingFather] = useState(false); // Track state updates
  const [isUpdatingChildren, setIsUpdatingChildren] = useState(false); // Track state updates
  const {
    data: familyToEdit, //the data is renamed families
    isLoading: isFamilyLoading, //monitor several situations
    isSuccess: isFamilySuccess,
    isError: isFamilyError,
    error: familyError,
  } = useGetFamilyByIdQuery(
    { id: id, criteria: "Dry", endpointName: "EditFamily" } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isFamilySuccess) {
      const { entities } = familyToEdit;
      //const familyInit = Object.values(entities)
      setFamily(Object.values(entities)[0]); // Set family state to the first object
    }
  }, [isFamilySuccess, familyToEdit]);

  // Update father, mother, familySituation, and children when family changes
  useEffect(() => {
    if (Object.keys(family).length > 0) {
      // Ensure family is not an empty object
      setIsUpdatingFather(true); // Start updating
      setFather(family.father); // Update father state
      setIsUpdatingChildren(true); // Start updating
      setChildren(family.children);
    }
  }, [family]);

  useEffect(() => {
    // Only runs after father state is set
    if (isUpdatingFather) {
      //console.log(father, 'father in parent1'); // Log the updated state
      setIsUpdatingFather(false); // Finish updating
    }
  }, [father, isUpdatingFather]);
  useEffect(() => {
    // Only runs after father state is set
    if (isUpdatingChildren) {
      setIsUpdatingChildren(false); // Finish updating
    }
  }, [children, isUpdatingChildren]);
  useEffect(() => {
    if (family != {}) {
      setMother(family.mother); // Update mother state
      setFamilySituation(family.familySituation); // Update family situation
    }
  }, [family]);

  //   useEffect(() => {
  //   // Ensure children are formatted correctly when component mounts or children updates
  //   console.log('isUpdatingChildren', isUpdatingChildren)
  //   if ( children?.length > 1 && !isUpdatingChildren) {
  //     console.log('children before formatting in parent', children)
  //     const formattedChildren = children.map((child) => (

  //         {
  //       _id: child?.child?._id ||child?._id,
  //       studentFullName: `${child?.studentName.firstName} ${child?.studentName.middleName || ""} ${child?.tudentName.lastName}`.trim()||child?.studentFullName,

  //   }));

  //     setChildren(formattedChildren);
  //     setIsUpdatingChildren(false);
  //     console.log('children afterrrrrrrrr formatting in parent', children)
  //   }
  // }, [children, setChildren]);

  const steps = ["Father Details", "Mother Details", "Children", "Completed"];

  const [
    updateFamily,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateFamilyMutation(); //it will not execute the mutation nownow but when called

  const displayStep = (step) => {
    switch (step) {
      case 1:
        if (isUpdatingFather) {
          return <LoadingStateIcon />;
        } else {
          return <EditFatherForm />;
        }
      case 2:
        return <EditMotherForm />;
      case 3:
        if (isUpdatingChildren) {
          return <LoadingStateIcon />;
        } else {
          return <EditFamilyAddChildrenForm />;
        }
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
  const handleSubmit = async () => {
    // Check if the last element of children is empty and remove it
    // console.log("children to submit after cleanup:", children);
    if (children[children.length - 1]?.child === "") {
      // Remove the last element using slice
      setChildren((prevChildren) => prevChildren.slice(0, -1));
    }

    // Log the cleaned-up children array for verification

    try {
      // Call the updateFamily function with the cleaned-up data
      await updateFamily({
        _id: id,
        father: father,
        mother: mother,
        children: children,
        familySituation: familySituation,
      });

      // Handle the success state, e.g., move to the next step
      if (isUpdateSuccess) {
        setCurrentStep(4); // Navigate to the next step
      }
    } catch (error) {
      // Handle any errors during update
      console.log("Error saving:", updateError);
    }
  };

  let content;
  //console.log( father, 'father', mother, 'mother', children, familySituation,'data in parent form')
  //maybe check here and allow steps to move on

  if (isFamilyLoading) {
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  }
  if (isFamilySuccess) {
    content = (
      <>
        <Students />

        <div className="md:w-3/4 mx-auto shadow-xl rounded-2xl pb-2 bg-white">
          <div className="container horizontal mt-5">
            <Stepper steps={steps} currentStep={currentStep} />
            {/* display componentns */}
            <div className="my-10 p-10">
              <StepperContext.Provider
                value={{
                  father: father,
                  setFather: setFather,
                  mother: mother,
                  setMother: setMother,
                  familySituation: familySituation,
                  setFamilySituation: setFamilySituation,
                  // family: family,
                  // setFamily: setFamily,
                  children: children,
                  setChildren: setChildren,
                  canSaveFather,
                  setCanSaveFather,
                  canSaveMother,
                  setCanSaveMother,
                  canSaveChildren,
                  setCanSaveChildren,
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
  }

  return content;
};
export default EditFamily;
