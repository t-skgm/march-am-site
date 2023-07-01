const contentfulManagement = require('contentful-management')
require('dotenv').config()

module.exports = async () => {
  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN
  })

  return contentfulClient
    .getSpace(process.env.PUBLIC_CONTENTFUL_SPACE_ID)
    .then((space) => space.getEnvironment(process.env.PUBLIC_CONTENTFUL_ENVIRONMENT))
}
