#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  console.log('🧪 Testing Student Collaboration Hub Backend API\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Register User
    console.log('2. Testing User Registration...');
    const registerData = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'SecurePass123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
    console.log('✅ User Registered:', registerResponse.data.message);
    const token = registerResponse.data.token;
    const userId = registerResponse.data.user._id;
    console.log('📝 User ID:', userId);
    console.log('');

    // Test 3: Login User
    console.log('3. Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'SecurePass123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
    console.log('✅ User Logged In:', loginResponse.data.message);
    console.log('');

    // Test 4: Get Profile
    console.log('4. Testing Get Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile Retrieved:', profileResponse.data.user.username);
    console.log('');

    // Test 5: Create Post
    console.log('5. Testing Create Post...');
    const postData = {
      title: 'Test Study Group',
      content: 'Looking for people to study Computer Science with!',
      category: 'study-group',
      tags: ['computer-science', 'study', 'collaboration']
    };

    const createPostResponse = await axios.post(`${BASE_URL}/posts`, postData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Post Created:', createPostResponse.data.message);
    const postId = createPostResponse.data.post._id;
    console.log('📝 Post ID:', postId);
    console.log('');

    // Test 6: Get All Posts
    console.log('6. Testing Get All Posts...');
    const postsResponse = await axios.get(`${BASE_URL}/posts`);
    console.log('✅ Posts Retrieved:', postsResponse.data.posts.length, 'posts found');
    console.log('');

    // Test 7: Like Post
    console.log('7. Testing Like Post...');
    const likeResponse = await axios.post(`${BASE_URL}/posts/${postId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Post Liked:', likeResponse.data.message);
    console.log('');

    // Test 8: Add Comment
    console.log('8. Testing Add Comment...');
    const commentData = {
      content: 'Great idea! I would love to join the study group.'
    };

    const commentResponse = await axios.post(`${BASE_URL}/posts/${postId}/comments`, commentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Comment Added:', commentResponse.data.message);
    console.log('');

    // Test 9: Get Post by ID
    console.log('9. Testing Get Post by ID...');
    const postByIdResponse = await axios.get(`${BASE_URL}/posts/${postId}`);
    console.log('✅ Post Retrieved:', postByIdResponse.data.post.title);
    console.log('📊 Likes:', postByIdResponse.data.post.likesCount);
    console.log('📊 Comments:', postByIdResponse.data.post.commentsCount);
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.\n');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Status:', error.response?.status);
    console.error('');
  }
};

// Run tests
testAPI();
