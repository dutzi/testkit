import axios from 'axios';

let client = axios.create({
  baseURL: 'https://us-central1-testkit-c0228.cloudfunctions.net',
});

export async function createWorkspace(name: string) {
  return client.get(`/createWorkspace?name=${name}`);
}
