import { httpClient } from '../../../../shared/infrastructure/http/httpClient.js';

export async function logoutUserApi(): Promise<void> {
  await httpClient.post('/logout');
}
