# Tagging Messages

Tags can be added or removed from messages by their original sender using the standard GraphQL interfaces.

## Adding tags

Adding tags to messages can be achieved with the following mutation:

```
mutation ($tagDto: TagDto!) {
    tagConversationMessage(tagDto: $tagDto) {
      id
      text
      tags {
        tag
      }
      sender {
        id
      }
    }
  }
```

A `TagDto` must contain the following fields:

- `conversationId` - the `ObjectID` of the conversation the user is currently participating in
- `messageId` - the `ObjectID` of the message the user is planning to add a tag to
- `tag` - a string value of the tag the user wants to add to their message

This mutation is resolved through the usual resolver/data interfaces and processed by a handler which validates the user
is able to modify the message and is the correct sender.

Tags are then stored as a unique set on each message, ensuring they are unique.

## Removing tags

Once a tag is added it can be removed with the following mutation:

```
mutation ($tagDto: TagDto!) {
    untagConversationMessage(tagDto: $tagDto) {
      id
      text
      tags {
        tag
      }
      sender {
        id
      }
    }
  }
```

Again, a `TagDto` must contain the following fields:

- `conversationId` - the `ObjectID` of the conversation the user is currently participating in
- `messageId` - the `ObjectID` of the message the user is planning to add a tag to
- `tag` - a string value of the tag the user wants to remove from their message

This mutation is resolved through the usual resolver/data interfaces and processed by a handler which validates the user
is able to modify the message, is the correct sender and that the tag exists.

Tags are then pulled from the tag array and the message is updated.

## Searching for messages with tags

Conversation messages can be queried by tag using the following mutation:

```
query ($getMessageDto: GetMessageDto!) {
    getChatConversationMessages(getMessageDto: $getMessageDto) {
      messages {
        id
        created
        text
        tags {
          tag
        }
        sender {
          id
        }
        deleted
        isSenderBlocked
      }
      hasMore
    }
  }
```

When a tag parameter is provided, messages are fuzzy searched for the expected tag.

Search permissions follow the usually expected constraints, i.e. the user belongs to the conversation and has permission
to read it at that point in time.