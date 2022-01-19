import { Admin } from './admin'
import { RegisteredVoter } from './registeredVoter';
import { VoterRegistration } from './voterRegistration';

export const CreateElection = ({_id, candidates, admin, isRegistered, phase}) => {
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
