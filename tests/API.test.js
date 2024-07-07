const { test, request, expect } = require("@playwright/test");

test.describe("PetStore API Automation", () => {
  let petId;

  // 1- Test creating a new pet successfully
  test("1- Add a new pet successfully", async ({ request }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy1",
        age: 3,
        avatarUrl:
          "https://t4.ftcdn.net/jpg/08/55/83/09/240_F_855830927_LP3sbwxJcAYBwtMlmaF1rOa51gZghYtK.jpg",
        category: "cat",
      },
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id");
    petId = responseBody.id;
    console.log(petId);
  });

  // 2- Test to check that adding a pet with missing non mandatory fields pass
  test("POST /pet should succeed to add a new pet with missing non-mandatory fields", async ({
    request,
  }) => {
    // Define a new pet with missing fields & Make a POST request with incomplete data

    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy2",
        age: 3,
        category: "cat",
      },
    });

    // Check that the response status is 201 (created)
    expect(response.status()).toBe(201);
  });

  // 3- Test to add a new pet with missing age field
  test("POST /pet should fail to add a new pet with missing mandatory field", async ({
    request,
  }) => {
    // Define a new pet with missing fields & Make a POST request with incomplete data

    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy3",
        category: "cat",
      },
    });

    // Check that the response status is 400
    expect(response.status()).toBe(400);
  });

  // 4- Test to add a new pet with invalid data type for age
  test("POST /pet should fail to add a new pet with invalid data type for age", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy4",
        age: "three",
        category: "cat",
      },
    });

    // Check that the response status is 400
    expect(response.status()).toBe(400);
  });

  // 5- Test to add a new pet with negative age
  test("POST /pet should fail to add a new pet with negative number for age", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy5",
        age: -3,
        category: "cat",
      },
    });

    // Check that the response status is 400
    expect(response.status()).toBe(400);
  });

  // 6- Test to add a new pet with empty name
  test("POST /pet should fail to add a new pet with empty name", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "", // Fluffy6
        age: 3,
        category: "cat",
      },
    });

    // Check that the response status is 400
    expect(response.status()).toBe(400);
  });

  // 7- Test to add a new pet with special characters in name & category
  test("POST /pet should fail to add a new pet with special characters in name & category", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy@7",
        age: 3,
        category: "cat#7",
      },
    });
    expect(response.status()).toBe(201);
  });

  // 8- Test to add a new pet with an extra field
  test("POST /pet should fail to add a new pet with an extra field", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy8",
        age: 3,
        category: "cat",
        extraField: "extraValue",
      },
    });
    expect(response.status()).toBe(201);
  });

  // 9- Test to add a new pet with >50 characters for category
  test("POST /pet should fail to add a new pet with >50 characters for category", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy9",
        age: 3,
        category:
          "cat123456789cat123456789cat123456789cat123456789cat123456789cat123456789cat123456789cat123456789cat123456789cat123456789",
      },
    });
    // As per the swagger file, it should be maximum 50 characters
    expect(response.status()).toBe(400);
  });

  // 10- Test to add a new pet with age above 999
  test("POST /pet should fail to add a new pet with above 999", async ({
    request,
  }) => {
    const response = await request.post("http://localhost:3000/api/pet", {
      data: {
        name: "Fluffy10",
        age: 1200,
        category: "cat",
      },
    });
    // Check that the response status is 400 as in the assumptions this should fail
    expect(response.status()).toBe(400);
  });

  // 11- Test to retrieve the details of a pet by its ID
  test("GET /pet/:petId should retrieve the pet details by ID", async ({
    request,
  }) => {
    // Make a GET request to retrieve the pet details
    const response = await request.get(
      "http://localhost:3000/api/pet/" + { petId }
    );

    // Check that the response status is 200 (ok)
    expect(response.status()).toBe(201);
    const pet = await response.json();

    // Check that the retrieved pet details are correct
    expect(pet).toHaveProperty("name", "Fluffy2");
    expect(pet).toHaveProperty("age", 3);
    expect(pet).toHaveProperty("category", "cat");
  });

  // 12 - Test to check that retrieving a non-existent pet returns 404 
  test("GET /pet/:petId should return 404 for a non-existent pet ID", async ({
    request,
  }) => {
    // Make a GET request for a non-existent pet ID
    const response = await request.get(
      "http://localhost:3000/api/pet/9999999"
    );
    // Check that the response status is 404 (Not Found)
    expect(response.status()).toBe(404);
  });

  // 13- Test to get a pet by invalid ID format
  test('GET /pet/:petId should return 400 for invalid ID format', async ({ request }) => {
    const response = await request.get("http://localhost:3000/api/pet/abc");
    expect(response.status()).toBe(400);
  });

  // 14- Test to get a pet with ID = 0
  test('GET /pet/:petId should return 400 for pet ID of 0', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/pet/0');
    expect(response.status()).toBe(400);
  });

  // 15- Test to get a pet with special characters in ID
  test('GET /pet/:petId should return 400 for pet ID with special characters', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/pet/#$%^');
    expect(response.status()).toBe(400);
  });  

  

});
