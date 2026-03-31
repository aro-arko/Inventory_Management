/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const authenticationError = (err: any) => {
    const statusCode = 401;

    return {
        statusCode,
        message: 'Invalid token or expired session!',
    };
};
export default authenticationError;