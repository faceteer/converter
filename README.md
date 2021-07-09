# Faceteer Converter

This is a clone of the [AWS.DynamoDB.Converter](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/Converter.html) class.

It was created to allow Faceteer to be able to convert to and from Dynamo DB objects without requiring the installation of the `aws-sdk`.

It also adds functionality for handling `Date` values when converting to a Dynamo DB object. By default dates are converted to an ISO string, but they may be converted to a Unix timestamp by overriding the converter options.
