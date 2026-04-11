import { apiClient, ApiError } from './apiClient';

describe('apiClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('parses JSON responses', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(apiClient.get<{ ok: boolean }>('/test', 'failed')).resolves.toEqual({ ok: true });
  });

  it('surfaces JSON error messages', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'bad request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    await expect(apiClient.get('/test', 'failed')).rejects.toEqual(new ApiError('bad request', 400));
  });

  it('falls back to provided message when the response body is empty', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('', { status: 500 }));

    await expect(apiClient.get('/test', 'fallback')).rejects.toEqual(new ApiError('fallback', 500));
  });
});
