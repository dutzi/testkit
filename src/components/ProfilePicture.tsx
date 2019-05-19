import React from 'react';
import styled from 'styled-components';
import { storage, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Wrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  margin-right: 24px;
  overflow: hidden;
  display: inline-block;
`;

const Picture = styled.img`
  width: 100%;
  object-fit: cover;
`;

const UploadButton = styled.div`
  height: 100%;
  background: #eee;
  position: absolute;
  top: 0;
  width: 100%;
  opacity: ${(p: { keepVisible: boolean }) => (p.keepVisible ? '0.5' : '0')};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ProfilePicture = ({
  src,
  onChange,
}: {
  src: string;
  onChange: (url: string) => void;
}) => {
  const { user } = useAuthState(auth);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (user && e.target.files) {
      const storageRef = storage.ref();

      const ext = e.target.files[0].name.split('.').pop();

      var fileRef = storageRef.child(`${user.uid}.${ext}`);

      fileRef.put(e.target.files[0]).then(async function(snapshot) {
        const storageRef = storage.ref();
        const path = await storageRef
          .child(snapshot.metadata.fullPath)
          .getDownloadURL();

        onChange(path);
      });
    }
  }
  return (
    <Wrapper>
      {src && <Picture src={src} />}
      {
        <UploadButton keepVisible={!src}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            type="file"
            onChange={handleFileInputChange}
          />
          <Label htmlFor="raised-button-file">Upload</Label>
        </UploadButton>
      }
    </Wrapper>
  );
};

export default ProfilePicture;
