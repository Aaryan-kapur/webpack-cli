'use strict';

const { run } = require('../../../testUtils');
const serializer = require('jest-serializer-ansi');

test('precedence-dashed', () => {
    const { stdout, stderr } = run(__dirname, ['--target', 'browser', '--version']);
    expect.addSnapshotSerializer(serializer);
    expect(stdout).toMatchSnapshot();
    expect(stderr).toHaveLength(0);
});
