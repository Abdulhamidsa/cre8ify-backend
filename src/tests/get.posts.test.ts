import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// For making HTTP requests
import app from '../app';
import { handleFetchAllPosts } from '../features/post/post.handlers';

// Import the Express app

// Import your handler

// Mock the handler logic
vi.mock('../handlers/postHandler', () => ({
  handleFetchAllPosts: vi.fn(),
}));

describe('GET /post', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all posts successfully with valid query parameters', async () => {
    // Mock a response from the handler
    const mockPosts = [
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' },
    ];

    handleFetchAllPosts.mockImplementation((req, res) => {
      res.status(200).json(mockPosts);
    });

    const response = await request(app).get('/post').query({ page: 1, limit: 10 }); // Example query params

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPosts);
    expect(handleFetchAllPosts).toHaveBeenCalled();
  });

  it('should return 400 when invalid query parameters are provided', async () => {
    const response = await request(app).get('/post').query({ page: 'invalid', limit: 'invalid' }); // Invalid query params

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error'); // Assuming you send validation errors
  });

  it('should handle unexpected errors gracefully', async () => {
    handleFetchAllPosts.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const response = await request(app).get('/post').query({ page: 1, limit: 10 });

    expect(response.status).toBe(500); // Assuming 500 for unexpected errors
    expect(response.body).toHaveProperty('error');
  });
});
