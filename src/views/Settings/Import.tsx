import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MarginH, MarginV } from '../../styles';
import { storage, auth } from '../../firebase';
import { importDataFromPractitest } from '../../clients/import-data-from-practitest';

const Padding = styled.div`
  padding: 30px;
`;

const Flex = styled.div`
  display: flex;
`;

interface ImportSummary {
  numSuccess: number;
  numFailed: number;
  failedIds: string[];
}

const Import = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<ImportSummary>();

  var storageRef = storage.ref();

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

        const response = await importDataFromPractitest('file.csv', idToken);

        const importSummary = response.data;

        setIsProcessing(false);

        setImportSummary(importSummary);
      });
    }
  };

  return (
    <Paper>
      <Padding>
        <Typography variant="h5">Import Tests</Typography>
        <MarginH />
        <div>
          <p>
            Currently you can import tests from either PractiTest or TestLodge.
          </p>
          <p>
            First export the tests as CSV, then hit one of the buttons below to
            upload the file.
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
        {importSummary && (
          <React.Fragment>
            <p>
              Successfully imported <strong>{importSummary.numSuccess}</strong>{' '}
              tests
            </p>
            <div>
              Error importing <strong>{importSummary.numFailed}</strong> tests
              {importSummary.failedIds.length > 0 && (
                <span> ({importSummary.failedIds.join(', ')})</span>
              )}
            </div>
          </React.Fragment>
        )}
      </Padding>
    </Paper>
  );
};

export default Import;
