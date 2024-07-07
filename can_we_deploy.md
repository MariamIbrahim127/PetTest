# Deployment Recommendation

## Summary
This document provides an assessment of the pet store application to determine its readiness for deployment. Based on an evaluation of its basic functionality, the following observations and recommendations have been made.

## Testing Method 
- Open docker container as mentioned in the steps in the readme file.
- Investigate swagger file in the solution.
- Prepare detailed test cases on postman with all links, body and end points.
- Have the main functionality assessment ready.

## Functionality Assessment through test cases & results

- Add a new pet successfully - Passed
- Add a new pet with missing category field - Passed
- Add a new pet with missing age field - Passed
- Add a new pet with missing avatarUrl field - Passed
- Add a new pet with missing name field - Passed
- Add a new pet with invalid data type for age - Passed
- Add a new pet with >100 characters for URL - Passed
- Add a new pet with >50 characters for category - Failed
- Add a new pet with >22 characters for name - Failed
- Add a new pet with >3 characters for age - Failed
- Add a new pet with an extra field - Passed
- Add a new pet with special characters in name & category - Passed
- Add a new pet with empty name - Failed
- Add a new pet with negative age - Failed (it supposed to not accept negative values)
- Get a pet by valid ID - Failed
- Get a pet by invalid ID format - Failed
- Get a pet with non-existing ID - Failed
- Get a pet with ID = 0 - Failed
- Get a pet with special characters in ID - Failed
- Update an existing pet successfully - Failed
- Update a pet with invalid ID format - Failed
- Update a pet with missing required fields - Failed
- Update a pet with empty name - Failed
- Delete an existing pet successfully - Passed
- Delete a pet with non-existing ID - Failed
- Delete a pet with invalid ID format - Failed
- Delete a pet with ID of zero - Failed
- Delete a pet with very large ID - Failed
- Add a new pet successfully, Get the ID & Delete the pet with the ID - Passed

## Fields Validations & Details

- **Name field maximum:** 22 characters (Assumption).
- **Category field maximum:** 50 characters (Mentioned in swagger).
- **AvatarURL maximum:** 100 characters (Found when executing with postman, it should be added to swagger).
- **Age maximum:** 3 characters (Assumption).

## Comments

- If the API specification or documentation expects a 200 OK status code for the creation of a new pet and the server returns 201 Created, it could be considered a defect based on the documentation. However, from a best practices perspective, 201 Created is the more appropriate status code for a successful resource creation.
- The home page should have been handled better, through welcome message or an empty page with 200 or documentation.
- There was no use for put and delete in the API and it was used as post, this is not pest practice as rest API has crud operations.

## Defects

- The Get functionality is failing to work successfully, so all tcs related to it are failing.
  - Get a pet by valid ID - Failed
  - Get a pet by invalid ID format - Failed 
  - Get a pet with non-existing ID - Failed - Returns 201 but should return 400 or 404
  - Get a pet with ID = 0 - Failed - - Returns 201 but should return 400 or 404
  - Get a pet with special characters in ID - Failed - Returns 201 but should return 400 or 404
- The edit functionality is failing to work successfully, so all tcs related to it are failing.
  - Update an existing pet successfully.
  - Update a pet with invalid ID format.
  - Update a pet with missing required fields.
  - Update a pet with an empty name.
- The ID is supposed to be int64 according to the swagger file, so it should only accept numbers, but it also accepts letters and special characters; this should be handled better. Examples:
  - In the delete test cases.
  - In the Get test cases 
- The age should only have 3 numeric characters by maximum, no pet will be older than 999 years old.
- The URL for remove is /pet/{petId}/remove and the variable should be at the end of the URL.
- Delete a pet with a non-existing ID.
- Delete a pet with invalid ID format.
- Add a new pet with >50 characters for category failed and accepting more the 50 characters.
- Add a new pet with >3 characters for age failed as the assumption was that age cannot be more than 999.
- Add a new pet with an empty name,
- Add a new pet with a negative age failed as it is not logical to have a negative age.
- Get a pet by invalid ID format.
- Get a pet with a non-existing ID.
- Get a pet with special characters in ID as ID should be int64.
- Post was used as also put and delete and this is not recommended, not it is best practice because:
  - RESTful APIs use different HTTP methods (GET, POST, PUT, DELETE, etc.) to represent different actions. This makes the API intuitive and easy to understand.
  - Using the correct HTTP methods improves security by allowing proper configuration of web servers and firewalls.
- The ID generated should not accept 0 or negative characters. In general cases, int64 has a minimum value of -9,223,372,036,854,775,808 and a maximum value of 9,223,372,036,854,775,807.
- Also, the maximum number for the ID is too big, and we need to ask for the business expectations on how much it should accept.

## Recommendation
Based on the assessment above, it is recommended that the application **cannot be deployed** at this time. The application failed API functional testing.

## How to make it acceptable for deployment 
- Detailed refinement of the application requirements mentioned and asked in the defects.
- Analysis of the defects.
- Fixing whatever is agreed on.
- Make naming all endpoints resource-oriented, example: it should be: /pet/remove/{petId} not /pet/{petId}/remove
- User proper status codes 201 for creation, and 200 for general success.

