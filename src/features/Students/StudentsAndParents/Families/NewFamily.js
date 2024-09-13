import { useState, useEffect } from "react"
import { useAddNewFamilyMutation } from "./familiesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../../config/UserRoles"
import { ACTIONS } from "../../../../config/UserActions"
import StudentsParents from '../../StudentsParents'
import { useGetFamiliesByYearQuery } from "./familiesApiSlice"
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice"
import Stepper from "./Stepper"
import StepperControl from "./StepperControl"
import NewFatherForm from "./NewFatherForm"
import NewMotherForm from "./NewMotherForm"
import NewFamilyAddChildrenForm from "./NewFamilyAddChildrenForm"
import NewFamilyCompleted from './NewFamilyCompleted'
import { StepperContext } from "../../../../contexts/StepperContext"


const NewFamily = () => {//an add parent function that can be called inside the component

 








  
const [currentStep, setCurrentStep] =useState(1)
const [father, setFather] =useState({})
const [mother, setMother] =useState({})
const [familySituation, setFamilySituation] =useState("Joint")
const [family, setFamily]= useState([])
const [stepSuccess, setStepSuccess] = useState(false)

const steps=[
    "Father Details",
    "Mother Details",
    "Children",
    "Completed"
]

const displayStep =(step)=>{
    switch(step){
        case 1: 
            return <NewFatherForm/>
        case 2: 
            return <NewMotherForm/>
        case 3: 
            return <NewFamilyAddChildrenForm/>
        case 4: 
            return <NewFamilyCompleted/>

            default:
        }
}

const handleClick=(direction)=>{
    let newStep=currentStep
    direction==="Next"? newStep++ :  newStep--
    //check if step are within bounds
    newStep>0 && newStep <= steps.length &&setCurrentStep(newStep)
}
console.log( father, mother)
//maybe check here and allow steps to move on

    const content = (
        <>
        <StudentsParents/>
       <div className='md:w-3/4 mx-auto shadow-xl rounded-2xl pb-2 bg-white'>
            <div className="container horizontal mt-5">
                <Stepper 
                    steps={steps} 
                    currentStep={currentStep}
                    
                />
                {/* display componentns */}
                <div className="my-10 p-10">
                    <StepperContext.Provider value={{father, setFather, mother , setMother, familySituation, setFamilySituation, family, setFamily, stepSuccess, setStepSuccess}}>
                        {displayStep(currentStep)}
                    </StepperContext.Provider >
                </div>

            </div>
            <div >
                {currentStep!==steps.length &&
                <StepperControl 
                    stepSuccess={stepSuccess}
                    handleClick={handleClick} 
                    currentStep={currentStep}
                    steps={steps}

                />}
            </div>
        </div>
            

           
        </>
    )

    return content
}
export default NewFamily
