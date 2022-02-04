import React from 'react';
import { Admin } from './admin'
import { RegisteredVoter } from './registeredVoter';
import { VoterRegistration } from './voterRegistration';

const ElectionDetails = ({_id, candidates, admin, isRegistered, phase, voted}) => {
  return (
    <>
    {
      admin && 
      <Admin 
        candidates={candidates}
        phase={phase} 
        _id={_id}
      />
    }
    {
      (!admin && isRegistered) &&
      <RegisteredVoter
        _id={_id} 
        phase={phase}
        candidates={candidates}
        voted={voted}
      />
    }
    {
      (!admin && !isRegistered) &&
      <VoterRegistration
        _id={_id} 
        phase={phase}
      />
    }
    </>
  );
};

export default React.memo(ElectionDetails);
