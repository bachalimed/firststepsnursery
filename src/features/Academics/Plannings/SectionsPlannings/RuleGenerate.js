import { createRoot } from 'react-dom/client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule';


/**
 * Recurrence editor generate rule
 */
const RuleGenerate = () => {
    const [ruleOutput, setRuleOutput] = useState('FREQ=DAILY;INTERVAL=2;COUNT=8');
    const onChange = (args) => {
        setRuleOutput(args.value);
    };
    return (<div className='schedule-control-section'>
      <div className='control-section'>
        <div className='recurrence-editor-wrap'>
          <div className='generate-rule' style={{ paddingBottom: '15px' }}>
            <label>Rule Output</label>
            <div className='rule-output-container'>
              <div id='rule-output'>{ruleOutput}</div>
            </div>
          </div>
          <div className='RecurrenceEditor'>
            <RecurrenceEditorComponent id='RecurrenceEditor' value={ruleOutput} change={onChange}></RecurrenceEditorComponent>
          </div>
        </div>
      </div>
    </div>);
};
export default RuleGenerate;