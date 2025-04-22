
exports.handler = async (event, context) => {
  // Redirect to external API
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "This is a placeholder API response. In production, API requests should be directed to your backend service."
    })
  };
};
