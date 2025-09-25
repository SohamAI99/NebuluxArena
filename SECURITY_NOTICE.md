# Security Notice: Exposed API Keys

## Summary
The Supabase API keys were exposed in multiple files in the repository:
1. `.env.local` file (correctly ignored by .gitignore)
2. `scripts/test-form-submission.js`
3. `scripts/test-service-role-key.js`
4. `scripts/create-contacts-table.js`

While the `.gitignore` file prevented `.env.local` from being committed, the script files contained hardcoded keys that were committed to the repository.

## Immediate Actions Required

1. **Rotate Supabase API Keys**:
   - Go to your Supabase dashboard: https://app.supabase.com/project/cyiacmjrqdrbkxnafikp/settings/api
   - Generate a new "anon" key
   - Reset the "service_role" key

2. **Update Local Configuration**:
   - Replace the placeholder values in `.env.local` with your new keys
   - Restart your development server

3. **Verify Functionality**:
   - Test the database connection at http://localhost:3001/test-db
   - Test the contact form submission
   - Run the test scripts to ensure they work with the new keys:
     - `node scripts/test-form-submission.js`
     - `node scripts/test-service-role-key.js`
     - `node scripts/create-contacts-table.js`

## Security Best Practices

- Never commit sensitive credentials to version control
- Use environment variables for all secrets
- Regularly rotate API keys
- Monitor API usage for unusual activity
- Use the principle of least privilege (use anon key for client-side operations)
- Implement security checks in scripts to prevent running with default keys

## Files Updated

The following files have been updated to remove hardcoded keys:
- `scripts/test-form-submission.js`
- `scripts/test-service-role-key.js`
- `scripts/create-contacts-table.js`

All scripts now:
- Load environment variables from `.env.local`
- Check for proper key configuration before running
- Exit with an error message if keys are not properly configured

## Additional Resources

- [Supabase API Key Management](https://supabase.com/docs/guides/platform/api-keys)
- [Security Best Practices](https://supabase.com/docs/guides/platform/security)