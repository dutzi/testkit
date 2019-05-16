import axios from 'axios';

let client = axios.create({
  baseURL: 'http://localhost:5000/testkit-c0228/us-central1',
  // baseURL: 'https://us-central1-testkit-c0228.cloudfunctions.net',
});

export async function importDataFromPractitest(
  filename: string,
  idToken: string,
) {
  return client.post(
    `/importDataFromPractitest?filename=${filename}&idToken=${idToken}`,
  );
}
