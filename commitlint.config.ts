import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Commit types that are allowed
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Formatting, missing semi-colons, etc. (no code change)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf', // Performance improvement
        'test', // Adding or fixing tests
        'build', // Build system or dependency changes
        'ci', // CI/CD configuration changes
        'chore', // Other changes that don't modify src or test files
        'revert', // Reverts a previous commit
      ],
    ],
    // Subject must not be empty
    'subject-empty': [2, 'never'],
    // Type must not be empty
    'type-empty': [2, 'never'],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
    // Max header length of 100 chars
    'header-max-length': [2, 'always', 100],
    // Body lines max 100 chars
    'body-max-line-length': [1, 'always', 100],
  },
};

export default config;
