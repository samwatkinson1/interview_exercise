import arg from 'arg';
import { mockServerClient } from 'mockserver-client';

const args = arg({
  '--userId': String,
});

const userId = args['--userId'];
if (!userId) {
  console.error('missing --userId!');
  process.exit(1);
}

process.on('SIGINT', function () {
  process.exit();
});

mockServerClient(process.env.MOCK_USER_SERVICE ?? '', 1080)
  .mockSimpleResponse(
    `/api/v1/users/${userId}`,
    {
      id: userId,
      firstName: 'Ben',
      lastName: 'Giles',
      profilePhoto: null,
    },
    200,
  )
  .then(() => {
    console.log('server mocking...');
  })
  .catch((e) => {
    console.error(`failed to mock server, ${e.message}`);
    process.exit(1);
  });
