## Part 1

Solved in `9a4876cfef8798ad466e4ca849539d8eebd6dbfb`

## Part 2

Solved in `f32de2289849aed5a46f113375c2d454e6a5ccb3`

## Part 3

Solved in `8cc8bef957339ee1efa64e03144bcd9a7a1ea04a`

### How you would go about implementing the solution

- As conversations already has tags, we can take a look at the solution there and follow a similar implementation
    - Turns out it doesn't work like this, we are better off looking at reactions
- Adding search logic should be simple enough, we can add a new endpoint or amend a current one to add a tags argument
  that searches (potentially fuzzy) tags
- Need to look into the nestjs docs to figure out how to add the field and work with the graphql integration
- As we're working headless (i.e. no UI) e2e tests are our best friend here, we'll need to implement some tests to
  handle our new functionality and ensure the logic we implement is corrects

### What problems you might encounter

- If we implement as is we won't have any schema ready so we'll need to consider adding migrations to add the tags
  column
- We'll need to make sure we can't add the same tag twice so we'll need to consider some validation logic
- Messages are handled by graphQL, will need to consider how this affects our mutation logic
- `Error: Undefined type error. Make sure you are providing an explicit type for the "tags" of the "ChatMessage" class.`
- Need to consider how we check if a user is authorised to update the message, I presume we can use the `updateMessage`
  permission to handle allowing to add a tag but we could add more code to handle this

### How you would go about testing

- We could do this test-driven, build out our tests first and red-green-refactor til we have a complete solution
- We'll need to add both unit and end-to-end tests
    - Unit so we can ensure add/update/search logic works in isolation
    - End-to-end so we can ensure a user do all operations in band

### What might you do differently

- Adding fuzzy searching for tags will account for user error when filtering messages based on tags, we could also
  handle this in the UI by getting all known tags on messages and only allowing the user to filter by those tags
- We could add a tag model/logic to store user tags in DB
    - This would make adding tags/updating a 1-many relationship and user specific
    - Would make searching for tags easier, we could pull all user tags from DB and use that in UI for filtering
- `user can delete a message` e2e test fails for a reason I can't seem to figure out, see comment

## Part 4

Solved in [https://github.com/samwatkinson1/interview_exercise_app](https://github.com/samwatkinson1/interview_exercise_app)

### How you would go about implementing the solution

- First we need to scaffold our app, so we need to introduce a vite project with `npm create vite@latest`
- We then need to figure out the endpoints to implement and how we should display our information
- We'll need to add unit tests for UI to cover our application logic

### What problems you might encounter

- How do we represent our data?
- How do we authorise our user?
- Do we need to consider using apollo or graphql libraries?
- CORS...
    - Turns out this was a vite issue and adding a proxy fixed!
- Working with GQL
    - Needed to create a conversation with appropriate permissions
    - Needed a JWT to authenticate with GQL
    - Needed to mock user service for API to properly validate auth

### How you would go about testing

- We should add unit testing at a bare minimum to ensure our application logic is error-free, performant and matches our
  contract

### What might you do differently

- Use the [Patron component library](https://design.unibuddy.com/) for our styling etc.
- Add e2e testing at a UI level to ensure user flows are error-free
- A monorepo may be of use here - we could isolate our API and UI code but share any packages/business logic between the
  two
- Complete unit testing, having issues with mocking packages and due to time constraints decided to leave as is for
  reflection
- The way permissions are handled at the API level could be changed to allow the API to determine what DB operators
  to
  used based on permissions given
    - Currently, we provide objects like below which is insecure as bad actors could use this data to infer how
      permissions are set up
      ```js
       const permission = {
        action: 'readConversation',
        subject: 'User',
        conditions: {
          userId: {
            $in: 'conversation.memberIds',
            $nin: 'conversation.blockedMemberIds',
          },
        },
      };
      ```
