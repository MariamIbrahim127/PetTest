const { test, expect } = require('@playwright/test');

// Grouping related tests under a common description for better organization
test.describe('Pet Routes', () => {
  let petId;

  // 1- Test to add a new pet to the store
  test('POST /pet should add a new pet', async ({ request }) => {
    // Define the new pet's details
    const newPet = {
      name: 'Fluffy',
      age: 2,
      type: 'cat'
    };

    // Make a POST request to add the new pet
    const response = await request.post('/pet', {
      data: newPet
    });

    // Check that the response status is 201 (Created)
    expect(response.status()).toBe(201);
    const responseBody = await response.json();

    // Check that the response body contains an 'id' property
    expect(responseBody).toHaveProperty('id');
    
    // Store the pet ID for subsequent tests
    petId = responseBody.id;
  });

  // 2- Test to check that adding a pet with missing fields fails
  test('POST /pet should fail to add a new pet with missing fields', async ({ request }) => {
    // Define a new pet with missing fields
    const newPet = {
      name: 'Fluffy'
      // Missing age and type
    };

    // Make a POST request with incomplete data
    const response = await request.post('/pet', {
      data: newPet
    });

    // Check that the response status is 400 (Bad Request)
    expect(response.status()).toBe(400);
  });

  // 3- Test to retrieve the details of a pet by its ID
  test('GET /pet/:petId should retrieve the pet details by ID', async ({ request }) => {
    // Make a GET request to retrieve the pet details
    const response = await request.get(`/pet/${petId}`);

    // Check that the response status is 201 (Created)
    expect(response.status()).toBe(201);
    const pet = await response.json();

    // Check that the retrieved pet details are correct
    expect(pet).toHaveProperty('name', 'Fluffy');
    expect(pet).toHaveProperty('age', 2);
    expect(pet).toHaveProperty('type', 'cat');
  });

  // 4- Test to check that retrieving a non-existent pet returns 404
  test('GET /pet/:petId should return 404 for a non-existent pet ID', async ({ request }) => {
    // Make a GET request for a non-existent pet ID
    const response = await request.get('/pet/999999');  // Assuming this ID doesn't exist

    // Check that the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
  });

  // 5- Test to update the details of an existing pet
  test('PUT /pet/:petId should update the pet details', async ({ request }) => {
    // Define the updated pet details
    const updatedPet = {
      name: 'Fluffy',
      age: 3,
      type: 'cat'
    };

    // Make a PUT request to update the pet details
    const response = await request.put(`/pet/${petId}`, {
      data: updatedPet
    });

    // Check that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  });

  // 6- Test to check that updating a non-existent pet returns 404
  test('PUT /pet/:petId should fail to update a non-existent pet', async ({ request }) => {
    // Define the updated pet details
    const updatedPet = {
      name: 'Fluffy',
      age: 3,
      type: 'cat'
    };

    // Make a PUT request for a non-existent pet ID
    const response = await request.put('/pet/999999', {  // Assuming this ID doesn't exist
      data: updatedPet
    });

    // Check that the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
  });

  // 7- Test to delete an existing pet
  test('POST /pet/:petId/remove should delete the pet', async ({ request }) => {
    // Make a POST request to delete the pet
    const response = await request.post(`/pet/${petId}/remove`);

    // Check that the response status is 200 (OK)
    expect(response.status()).toBe(200);
  });

  // 8- Test to check that deleting a non-existent pet returns 404
  test('POST /pet/:petId/remove should return 404 for a non-existent pet ID', async ({ request }) => {
    // Make a POST request to delete a non-existent pet
    const response = await request.post('/pet/999999/remove');  // Assuming this ID doesn't exist

    // Check that the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
  });

  // 9- Additional test to ensure the pet was actually deleted
  test('GET /pet/:petId should return 404 after deletion', async ({ request }) => {
    // Make a GET request to retrieve the deleted pet
    const response = await request.get(`/pet/${petId}`);  // The petId from the earlier add test

    // Check that the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
  });
});
