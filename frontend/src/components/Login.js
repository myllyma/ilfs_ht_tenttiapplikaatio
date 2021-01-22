import {useContext} from 'react';
import { FormattedMessage } from 'react-intl';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {Context} from '../utility/provider';
import {userLogin, inputUserNameChange, inputPasswordChange} from "../utility/callbacks"

const Login = () => {
  const {state, dispatch} = useContext(Context);

  return(
    <div className="longinForm">
      <FormattedMessage id="login_text"/>
      <TextField 
        required
        fullWidth
        autoFocus
        variant="outlined"
        margin="normal"
        id="user_name"
        label="User name"
        name="username"
        value={state.inputUserName}
        onChange={inputUserNameChange(dispatch)}
      />
      <TextField 
        required
        fullWidth
        variant="outlined"
        margin="normal"
        name="password"
        label="Password"
        type="password"
        id="password"
        value={state.inputPassword}
        onChange={inputPasswordChange(dispatch)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={userLogin(dispatch, state.inputUserName, state.inputPassword)}
      >
        <FormattedMessage id="login_text"/>
      </Button>
    </div>
  );
}

export default Login;