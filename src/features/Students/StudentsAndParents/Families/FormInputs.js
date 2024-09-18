

import NewFatherForm from "./NewFatherForm"
import NewMotherForm from "./NewMotherForm"
import NewFamilyAddChildrenForm from "./NewFamilyAddChildrenForm"


import React from 'react'
import useNewFamilyFormContext from "../../../../hooks/useNewFamilyFormContext"
import NewFamilyCompleted from "./NewFamilyCompleted"

const FormInputs = () => {
    const {page} = useNewFamilyFormContext
  
  const display = {
    0: <NewFatherForm/>,
    1:<NewMotherForm/>,
    2:<NewFamilyAddChildrenForm/>,
    3:<NewFamilyCompleted/>
  }
  
  const content =(
    <div className="">
        {display[page]}
    </div>
  )
  
    return content
}

export default FormInputs