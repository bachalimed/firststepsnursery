import React from 'react'
import { useEffect,useState, useRef} from 'react'



const Stepper = ({steps, currentStep}) => {
    const[newStep, setNewStep]=useState([])
    const stepRef = useRef()
   
    const updateStep=(stepNumber, steps)=>{
        const newSteps =[...steps]
        let count = 0 
        while(count < newStep.length){//curretn step
            if(count===stepNumber){
                newSteps[count]={
                    ...newSteps[count],
                    highlighted:true,
                    selected:true,
                    completed:true,
                }
                count++
            }
            else if(count<stepNumber ){//step completed
                newSteps[count]={
                    ...newSteps[count],
                    highlighted:false,
                    selected:true,
                    completed:true,
                }
                count++
            } else{//step pending
                newSteps[count]={
                    ...newSteps[count],
                    highlighted:false,
                    selected:false,
                    completed:false,
                }
                count++
            }
        }
        return newSteps
}
    useEffect(()=>{
    const stepsState =steps.map((step, index)=>
    Object.assign({},{
        description:step,
        completed:false, 
        highlighted:index===0?true:false,
        selected: index===0?true:false,
    }))
    stepRef.current=stepsState
    const current = updateStep(currentStep -1, stepRef.current)
    setNewStep(current)
},[steps, currentStep])

    const displaySteps = newStep.map((step, index) =>{
        return (
            <div key={index}  className={index!==newStep.length -1 ? 'w-full flex items-center' : 'flex items-center'}>
            <div className='relative flex flex-col items-center text-teal-600'>
            <div className={`rounded transition duration-500 ease-in-out border-2 border-gray-300 h-10 w-16 flex items-center 
            justify-center py-3 ${step.selected?"bg-green-600 text-white font-bold border border-green-600":""} `}>
                {step.completed?(
                    <span className='text-white font-bold text-xl'>&#10003;</span>
                ):(index+1)}
            </div>
            <div className={`absolute top-0 text-center mt-16 w-32 text-xs font-medium uppercase ${step.highlighted?"text-gray-900":"text-gray-400"}`}>
                {step.description}
            </div>
        </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.completed?"border-green-600":"border-gray-300"}`}>
        
            </div>
            </div>
        )
    } 
      
    )





  return (
    <div className='mx-4 p-4 flex justify-between items-center'>
      {displaySteps}
    </div>
  )
}

export default Stepper