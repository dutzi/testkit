import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MarginH, MarginV } from '../styles';
import { storage, auth, firestore } from '../firebase';
import { importDataFromPractitest } from '../clients/import-data-from-practitest';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { WorkspaceContext } from './Main';

const Wrapper = styled.div`
  max-width: 60%;
  margin: 50px auto;
`;

const Padding = styled.div`
  padding: 30px;
`;

const Flex = styled.div`
  display: flex;
`;

const Settings = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const workspace = useContext(WorkspaceContext);

  var storageRef = storage.ref();
  const { value: workspaceData } = useDocumentData(
    firestore.doc(`workspaces/${workspace}`),
  );

  function handleImportTestLodge() {
    console.log('handleImportTestLodge');
  }

  const handleFileInputChange = provider => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      var fileRef = storageRef.child('file.csv');

      setIsProcessing(true);

      fileRef.put(e.target.files[0]).then(async function(snapshot) {
        const idToken = await auth.currentUser!.getIdToken(true);

        importDataFromPractitest('file.csv', idToken);
        // console.log('Uploaded a blob or file!', snapshot);
        // debugger;
      });
    }
  };

  if (!workspaceData) {
    return null;
  }

  return (
    <Wrapper>
      <Typography variant="h4">{workspaceData.name}</Typography>
      <MarginH />
      <Paper>
        <Padding>
          <Typography variant="h5">Import Tests</Typography>
          <MarginH />
          <div>
            <p>
              Currently you can import tests from either PractiTest or
              TestLodge.
            </p>
            <p>
              First export the tests as CSV, then hit one of the buttons below
              and upload the file here.
            </p>
          </div>
          <MarginH />
          <Flex>
            <input
              accept="text/csv"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleFileInputChange('practitest')}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span">
                Import from Practitest
              </Button>
            </label>
            <MarginV />
            <Button onClick={handleImportTestLodge} variant="outlined">
              Import from TestLodge
            </Button>
          </Flex>
          {isProcessing && (
            <React.Fragment>
              <MarginH />
              <LinearProgress />
            </React.Fragment>
          )}
        </Padding>
      </Paper>
    </Wrapper>
  );
};

export default Settings;
