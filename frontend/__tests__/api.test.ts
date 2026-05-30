import { getPortfolio, uploadDocument } from '../src/lib/api';
import api from '../src/lib/api';

jest.mock('axios', () => {
  const mAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
  };
  return {
    create: jest.fn(() => mAxiosInstance),
  };
});

describe('API Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPortfolio', () => {
    it('fetches portfolio data successfully', async () => {
      const mockData = {
        data: {
          profile: { name: 'John Doe' },
          skills: [],
          projects: []
        }
      };

      (api.get as jest.Mock).mockResolvedValueOnce(mockData);

      const result = await getPortfolio();

      expect(api.get).toHaveBeenCalledWith('/api/portfolio');
      expect(result).toEqual(mockData.data);
    });
  });

  describe('uploadDocument', () => {
    it('uploads a document successfully', async () => {
      const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = { data: { status: 'success' } };

      (api.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await uploadDocument(mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/api/admin/upload',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
